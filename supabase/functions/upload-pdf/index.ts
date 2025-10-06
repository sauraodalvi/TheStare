
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string // 'pdf' or 'logo'

    if (!file) {
      return new Response('No file provided', { status: 400, headers: corsHeaders })
    }

    // Get Google Service Account credentials from secrets
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON')
    if (!serviceAccountJson) {
      console.error('Google Service Account JSON not found in environment')
      return new Response('Service account not configured', { status: 500, headers: corsHeaders })
    }

    const serviceAccount = JSON.parse(serviceAccountJson)
    
    // Create JWT for Google OAuth
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    }

    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/drive.file',
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
      console.error('Failed to get access token:', await tokenResponse.text())
      return new Response('Failed to authenticate with Google', { status: 500, headers: corsHeaders })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Upload file to Google Drive
    const fileBytes = await file.arrayBuffer()
    
    // Determine folder and filename based on file type
    const isPdf = fileType === 'pdf' || file.type === 'application/pdf'
    const folderId = isPdf ? '1NedyZm9HIJqKZGmY19zReyysSvZtgPE6' : '1eruGLtCGGu3PeXrFqKYPMB_tg4KgsXOC'
    const fileName = isPdf ? `case-study-${Date.now()}.pdf` : `logo-${Date.now()}-${file.name}`

    const metadata = {
      name: fileName,
      parents: [folderId]
    }

    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', new Blob([fileBytes], { type: file.type }))

    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    })

    if (!uploadResponse.ok) {
      console.error('Failed to upload to Drive:', await uploadResponse.text())
      return new Response('Failed to upload to Google Drive', { status: 500, headers: corsHeaders })
    }

    const uploadData = await uploadResponse.json()
    const fileId = uploadData.id

    // Make file public
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    })

    const shareUrl = `https://drive.google.com/file/d/${fileId}/view`

    return new Response(JSON.stringify({ shareUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error uploading PDF:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})
