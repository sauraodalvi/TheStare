import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google Drive folder IDs (provided by user)
const GOOGLE_DRIVE_LOGO_FOLDER = '1eruGLtCGGu3PeXrFqKYPMB_tg4KgsXOC'
const GOOGLE_DRIVE_PDF_FOLDER = '1NedyZm9HIJqKZGmY19zReyysSvZtgPE6'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const fileType = (formData.get('type') as string | null) ?? '' // 'pdf' or 'logo'

    if (!file) {
      return new Response('No file provided', { status: 400, headers: corsHeaders })
    }

    // Try Google Drive first
    const driveResult = await uploadToGoogleDrive(file, fileType)

    if (driveResult.ok) {
      return new Response(JSON.stringify({ shareUrl: driveResult.url, source: 'google' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fallback to Supabase Storage if Google Drive fails (e.g., storageQuotaExceeded)
    console.error('Google Drive upload failed, falling back to Supabase Storage:', driveResult.error)
    const storageResult = await uploadToSupabaseStorage(file, fileType)

    if (!storageResult.ok) {
      console.error('Supabase Storage upload failed:', storageResult.error)
      return new Response('File upload failed', { status: 500, headers: corsHeaders })
    }

    return new Response(JSON.stringify({ shareUrl: storageResult.url, source: 'supabase' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in upload-pdf function:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})

async function uploadToGoogleDrive(file: File, fileType: string): Promise<{ ok: boolean; url?: string; error?: unknown }> {
  try {
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON')
    if (!serviceAccountJson) {
      return { ok: false, error: 'Service account not configured' }
    }

    const serviceAccount = JSON.parse(serviceAccountJson)

    // Create JWT for Google OAuth
    const header = { alg: 'RS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/drive.file',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }

    // base64url encode
    const toBase64Url = (input: string) => btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/g, '')
    const encodedHeader = toBase64Url(JSON.stringify(header))
    const encodedPayload = toBase64Url(JSON.stringify(payload))
    const unsignedToken = `${encodedHeader}.${encodedPayload}`

    // Import private key
    const privateKeyPem = (serviceAccount.private_key as string).replace(/\\n/g, '\n')
    const pemContents = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s/g, '')
    const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(unsignedToken))
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const jwt = `${unsignedToken}.${encodedSignature}`

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    })

    if (!tokenResponse.ok) {
      const t = await tokenResponse.text()
      console.error('Failed to get access token:', t)
      return { ok: false, error: t }
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token as string

    const isPdf = fileType === 'pdf' || file.type === 'application/pdf'
    const folderId = isPdf ? GOOGLE_DRIVE_PDF_FOLDER : GOOGLE_DRIVE_LOGO_FOLDER
    const fileName = isPdf ? `case-study-${Date.now()}.pdf` : `logo-${Date.now()}-${file.name}`

    const fileBytes = await file.arrayBuffer()

    const metadata = { name: fileName, parents: [folderId] }

    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', new Blob([fileBytes], { type: file.type }))

    // supportsAllDrives for Shared Drives compatibility
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&includeItemsFromAllDrives=true',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    )

    if (!uploadResponse.ok) {
      const txt = await uploadResponse.text()
      console.error('Failed to upload to Drive:', txt)
      return { ok: false, error: txt }
    }

    const uploadData = await uploadResponse.json()
    const fileId = uploadData.id as string

    // Make file public
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    })

    const shareUrl = `https://drive.google.com/file/d/${fileId}/view`
    return { ok: true, url: shareUrl }
  } catch (error) {
    return { ok: false, error }
  }
}

async function uploadToSupabaseStorage(file: File, fileType: string): Promise<{ ok: boolean; url?: string; error?: unknown }> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) {
      return { ok: false, error: 'Supabase env not configured' }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const isPdf = fileType === 'pdf' || file.type === 'application/pdf'
    const bucket = isPdf ? 'case-study-pdfs' : 'company-logos'
    const ext = isPdf ? 'pdf' : (file.type.split('/')[1] || 'bin')
    const safeName = (file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${isPdf ? 'pdfs' : 'logos'}/${new Date().toISOString().slice(0, 10)}/${Date.now()}_${safeName}.${ext}`

    const fileBytes = await file.arrayBuffer()
    const blob = new Blob([fileBytes], { type: file.type })

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, blob, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      return { ok: false, error: uploadError.message }
    }

    const { data } = await supabase.storage.from(bucket).getPublicUrl(path)
    return { ok: true, url: data.publicUrl }
  } catch (error) {
    return { ok: false, error }
  }
}
