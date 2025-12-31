'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export default function HotDogPage() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<'hotdog' | 'nothotdog' | null>(null)
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [remainingChecks, setRemainingChecks] = useState<number | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)

  const turnstileRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey || !turnstileRef.current) return

    turnstileRef.current.innerHTML = ''

    if ((window as any).turnstile) {
      ;(window as any).turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
        theme: 'dark',
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      setCameraActive(true)
      setCameraReady(false)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      })

      streamRef.current = stream

      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setCameraReady(true)
          }
        }
      }, 100)
    } catch (err) {
      console.error('Camera error:', err)
      setError('Could not access camera. Please check permissions.')
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setCameraReady(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 640
    canvas.height = videoRef.current.videoHeight || 480

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setImage(dataUrl)
      setResult(null)
      setError(null)
      setStatus('idle')
      stopCamera()
    }
  }

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setResult(null)
      setError(null)
      setStatus('idle')
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const classify = async () => {
    if (!image || !turnstileToken) return

    setStatus('analyzing')
    setError(null)

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, turnstileToken }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Classification failed')

      setResult(data.isHotDog ? 'hotdog' : 'nothotdog')
      setRemainingChecks(data.remainingChecks)
      setStatus('done')

      if ((window as any).turnstile && turnstileRef.current) {
        ;(window as any).turnstile.reset(turnstileRef.current)
        setTurnstileToken(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  const reset = () => {
    setImage(null)
    setResult(null)
    setStatus('idle')
    setError(null)
    stopCamera()
    
    // Reset CAPTCHA
  if ((window as any).turnstile && turnstileRef.current) {
    ;(window as any).turnstile.reset(turnstileRef.current)
  }
  }

  // ==================== SILICON VALLEY STYLE RESULT SCREEN ====================
  if (status === 'done' && result && image) {
    const isHotDog = result === 'hotdog'
    
    return (
      <div className="min-h-screen flex flex-col bg-[#0b1220]">
        {/* Result Banner */}
        <div 
          className="py-5 text-center shadow-lg"
          style={{ 
            backgroundColor: isHotDog ? '#00e640' : '#e62e00',
          }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md tracking-tight">
            {isHotDog ? 'Hotdog!' : 'Not hotdog!'}
          </h1>
        </div>

        {/* Icon */}
        <div 
          className="flex justify-center py-6"
          style={{ 
            backgroundColor: isHotDog ? '#00e640' : '#e62e00',
          }}
        >
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
              style={{ 
                backgroundColor: isHotDog ? '#00c735' : '#cc2900',
              }}
            >
              <span className="text-5xl">🌭</span>
              {!isHotDog && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-20 h-1.5 bg-white rounded-full rotate-45"
                    style={{ 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                    }}
                  />
                </div>
              )}
            </div>
            {isHotDog && (
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-green-400">
                <span className="text-green-500 text-2xl font-bold">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative bg-black">
          <img 
            src={image} 
            alt="Analyzed" 
            className="w-full h-full object-contain"
            style={{ maxHeight: '45vh' }}
          />
        </div>

        {/* Buttons */}
        <div className="p-6 bg-[#0b1220] space-y-4">
          <button
            onClick={reset}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: '#00b4d8',
            }}
          >
            Try Another
          </button>
          
          <a 
            href="/"
            className="block text-center text-neutral-400 hover:text-white transition-colors py-2"
          >
            ← Back to portfolio
          </a>
          
          {remainingChecks !== null && (
            <p className="text-neutral-600 text-xs text-center">
              {remainingChecks} checks remaining today
            </p>
          )}
        </div>
      </div>
    )
  }

  // ==================== MAIN UPLOAD SCREEN ====================
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#0b1220] overflow-hidden">
      {/* Background grid + blue glow (lighter than before) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px),
            radial-gradient(900px 520px at 50% 0%, rgba(59,130,246,0.22), transparent 60%),
            radial-gradient(900px 600px at 0% 100%, rgba(34,211,238,0.12), transparent 55%)
          `,
          backgroundSize: '46px 46px, 46px 46px, auto, auto',
          backgroundPosition: 'center, center, center, center',
          opacity: 0.85,
        }}
      />

      {/* Softer vignette so the background feels lighter */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      <div className="relative w-full" style={{ maxWidth: '720px' }}>
        {/* Card */}
        <div className="bg-neutral-900/90 backdrop-blur rounded-3xl overflow-hidden border border-neutral-800">
          {/* Header */}
          <div className="text-center pt-8 pb-6 px-6 border-b border-neutral-800">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              🌭 Hot Dog Or Not Hot Dog
            </h1>
            <p className="text-neutral-400 text-sm mt-2">
              Upload an image to find out if it&apos;s a hot dog!
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Camera View */}
            {cameraActive && (
              <div
                className="relative mb-5 rounded-2xl overflow-hidden bg-neutral-800 border border-neutral-700"
                style={{ height: '480px' }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '480px',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                  }}
                />
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-neutral-600 border-t-sky-400 rounded-full mx-auto mb-2"></div>
                      <p className="text-neutral-400 text-sm">Starting camera...</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={capturePhoto}
                    disabled={!cameraReady}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      cameraReady ? 'bg-white hover:scale-105' : 'bg-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full ${cameraReady ? 'bg-red-500' : 'bg-neutral-500'}`} />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {image && !cameraActive ? (
              <div className="relative mb-5">
                <img
                  src={image}
                  alt="Upload"
                  className="w-full rounded-2xl object-cover border border-neutral-700"
                  style={{ height: '400px' }}
                />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  ✕
                </button>
              </div>
            ) : !cameraActive && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Upload Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-sky-400 bg-sky-400/10'
                      : 'border-neutral-700 hover:border-sky-400 hover:bg-sky-400/10'
                  }`}
                >
                  <div className="text-3xl mb-2">📁</div>
                  <p className="text-white text-sm font-medium">Upload</p>
                  <p className="text-neutral-500 text-xs mt-1">Drop or click</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>

                {/* Camera Button */}
                <button
                  onClick={startCamera}
                  className="border-2 border-dashed border-neutral-700 rounded-2xl p-6 text-center cursor-pointer transition-all hover:border-sky-400 hover:bg-sky-400/10"
                >
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-white text-sm font-medium">Camera</p>
                  <p className="text-neutral-500 text-xs mt-1">Take photo</p>
                </button>
              </div>
            )}

            {/* CAPTCHA */}
            <div className="flex justify-center mb-5">
              <div ref={turnstileRef} />
            </div>

            {/* Analyze Button */}
            {image && status !== 'done' && (
              <button
                onClick={classify}
                disabled={status === 'analyzing' || !turnstileToken}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                  status === 'analyzing' || !turnstileToken
                    ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {status === 'analyzing' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                    Analyzing...
                  </span>
                ) : !turnstileToken ? (
                  'Complete verification above'
                ) : (
                  'Classify Image 🔍'
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-neutral-400/70 text-xs">
            {remainingChecks !== null ? `${remainingChecks} checks remaining today • ` : ''}
            Rate limited to 5/day
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <a href="/" className="text-neutral-300/70 hover:text-white text-sm transition-colors">
              ← Back to portfolio
            </a>
            <span className="text-neutral-600">•</span>
            <p className="text-neutral-400/70 text-xs italic">Inspired by HBO&apos;s Silicon Valley</p>
          </div>
        </div>
      </div>
    </div>
  )
}