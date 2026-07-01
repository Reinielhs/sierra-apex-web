'use client'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { useState, useRef, Suspense } from 'react'

const SAM_URL = 'https://pbojyjjdfqbshrwutsph.supabase.co'
const SAM_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBib2p5ampkZnFic2hyd3V0c3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjg1MjAsImV4cCI6MjA5NDcwNDUyMH0.LnCxb5_bJasZ35KWGHwy_4n8jmgO2pwuICp8oTyGVqw'

function UploadContent() {
  const searchParams = useSearchParams()
  const session = searchParams.get('session')
  const supabase = useRef(createClient(SAM_URL, SAM_KEY))
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(0)
  const [total, setTotal] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1628]">
        <p className="text-white/50 text-sm">Invalid session. Scan the QR code again.</p>
      </div>
    )
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    setTotal(files.length)
    setUploaded(0)
    setError('')

    for (const file of files) {
      const ext = file.name.split('.').pop() || 'jpg'
      const uid = `${Date.now()}_${Math.random().toString(36).slice(2)}`
      const path = `temp-uploads/${session}/${uid}.${ext}`

      const { error: uploadError } = await supabase.current.storage
        .from('sierra-apex-manager-media')
        .upload(path, file, { contentType: file.type })

      if (uploadError) {
        setError('Upload failed. Please try again.')
        setUploading(false)
        return
      }
      setUploaded(prev => prev + 1)
    }

    setUploading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A1628] gap-6 px-8">
        <div className="text-6xl">✅</div>
        <h2 className="text-white text-2xl font-bold text-center">Photos sent!</h2>
        <p className="text-white/50 text-center text-sm">
          {total} photo{total !== 1 ? 's' : ''} uploaded. You can close this tab.
        </p>
        <p className="text-white/20 text-xs text-center">
          They will appear in the Mac app automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A1628] gap-10 px-8">
      <div className="flex flex-col items-center gap-1">
        <div className="text-3xl font-bold text-white tracking-tight">Sierra Apex Group</div>
        <div className="text-xs text-white/30 tracking-widest uppercase">Dealer Manager · Photo Upload</div>
      </div>

      {uploading ? (
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-blue-400 animate-spin" />
          <p className="text-white text-base">{uploaded} / {total} photos uploaded</p>
        </div>
      ) : (
        <label className="cursor-pointer w-full max-w-xs">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <div className="flex flex-col items-center gap-4 bg-white/5 rounded-3xl px-10 py-10 border border-white/15 active:scale-95 transition-transform select-none">
            <span className="text-5xl">📷</span>
            <p className="text-white text-lg font-semibold text-center">Select Photos</p>
            <p className="text-white/40 text-sm text-center">Tap to choose from your library</p>
          </div>
        </label>
      )}

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <p className="text-white/15 text-xs text-center max-w-xs">
        Photos will appear in your Sierra Apex Mac app automatically.
      </p>
    </div>
  )
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0A1628]">
        <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-blue-400 animate-spin" />
      </div>
    }>
      <UploadContent />
    </Suspense>
  )
}
