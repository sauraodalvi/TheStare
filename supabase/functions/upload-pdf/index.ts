import "https://deno.land/x/xhr@0.4.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google Drive folder IDs (must be in a Shared Drive, not My Drive)
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
    const file = formData.get('file') as File
    const fileType = (formData.get('type') as string) || '' // 'pdf' or 'logo'
    const fileInfo = file ? { name: file.name, type: file.type, size: file.size } : null
    console.log('upload-pdf request received', { fileType, fileInfo })

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'no_file', message: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Google Service Account credentials from secrets (support two env names)
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') ?? Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY')
    if (!serviceAccountJson) {
      console.error('Google Service Account JSON not found in environment (checked GOOGLE_SERVICE_ACCOUNT_JSON and GOOGLE_SERVICE_ACCOUNT_KEY)')
      return new Response(
        JSON.stringify({
          error: 'missing_service_account',
          message: 'Service account not configured',
          details: 'Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_KEY'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const serviceAccount = JSON.parse(serviceAccountJson)
    console.log('Using service account', { client_email: serviceAccount?.client_email })
    
    // Create JWT for Google OAuth
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }

    // Encode JWT (base64url as required by Google OAuth)
    const toBase64Url = (input: string) =>
      btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/g, '');
    const encodedHeader = toBase64Url(JSON.stringify(header))
    const encodedPayload = toBase64Url(JSON.stringify(payload))
    const unsignedToken = `${encodedHeader}.${encodedPayload}`

    // Import private key
    const privateKeyPem = serviceAccount.private_key.replace(/\\n/g, '\n')
    const pemContents = privateKeyPem.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '')
    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    )

    // Sign the token
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(unsignedToken)
    )

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const jwt = `${unsignedToken}.${encodedSignature}`

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Failed to get access token:', errorText)
      return new Response(
        JSON.stringify({
          error: 'google_auth_failed',
          message: 'Failed to authenticate with Google',
          details: errorText,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Upload file to Google Drive
    const fileBytes = await file.arrayBuffer()
    
    // Determine folder and filename based on file type
    const isPdf = fileType === 'pdf' || file.type === 'application/pdf'
    const folderId = isPdf ? GOOGLE_DRIVE_PDF_FOLDER : GOOGLE_DRIVE_LOGO_FOLDER
    const fileName = isPdf ? `case-study-${Date.now()}.pdf` : `logo-${Date.now()}-${file.name}`
    console.log('upload target resolved', { isPdf, folderId, fileName })

    const metadata = {
      name: fileName,
      parents: [folderId]
    }

    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', new Blob([fileBytes], { type: file.type }))

    // CRITICAL: Add supportsAllDrives parameters for Shared Drive compatibility
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&includeItemsFromAllDrives=true',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: form
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      let parsed: any = undefined
      try { parsed = JSON.parse(errorText) } catch {}
      const reason = parsed?.error?.errors?.[0]?.reason || parsed?.error?.status
      const message = parsed?.error?.message || 'Failed to upload to Google Drive'
      const status = reason === 'storageQuotaExceeded' ? 400 : 500
      const help = reason === 'storageQuotaExceeded'
        ? 'Service Accounts have no storage quota. Move target folders into a Shared Drive and grant the service account Content Manager, then update folder IDs.'
        : undefined
      console.error('Failed to upload to Drive:', { errorText, reason, folderId, fileType, fileName })
      return new Response(
        JSON.stringify({
          error: 'google_upload_failed',
          message,
          reason,
          details: errorText,
          help,
          folderId,
          fileType,
          fileName,
        }),
        { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const uploadData = await uploadResponse.json()
    const fileId = uploadData.id

    // Optional permission warning collection
    let permissionWarning: string | undefined = undefined

    // Make file public (also add supportsAllDrives)
    const permissionResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      }
    )

    if (!permissionResponse.ok) {
      const permError = await permissionResponse.text()
      console.error('Failed to set permissions:', permError)
      permissionWarning = permError
    }

    const shareUrl = `https://drive.google.com/file/d/${fileId}/view`

    return new Response(JSON.stringify({ shareUrl, permissionWarning }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error uploading file:', (error as any)?.message ?? error, (error as any)?.stack)
    return new Response(
      JSON.stringify({
        error: 'internal_error',
        message: 'Internal server error',
        details: String((error as any)?.message ?? error)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})