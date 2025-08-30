'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Share2, Copy, Check } from 'lucide-react'

// QR Code Generator Component
export default function QRCodeGenerator({ 
  profileUrl, 
  username, 
  size = 256, 
  includeText = true,
  style = 'modern' // 'modern', 'classic', 'minimal'
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    generateQRCode()
  }, [profileUrl, size, style])

  const generateQRCode = async () => {
    try {
      setLoading(true)
      
      // Import QR code library dynamically
      const QRCode = (await import('qrcode')).default
      
      const qrOptions = {
        width: size,
        margin: 2,
        color: getQRColors(),
        errorCorrectionLevel: 'M'
      }
      
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(profileUrl, qrOptions)
      
      // Create enhanced QR code with branding
      if (style !== 'minimal') {
        const enhancedQR = await createEnhancedQRCode(qrDataUrl)
        setQrCodeUrl(enhancedQR)
      } else {
        setQrCodeUrl(qrDataUrl)
      }
      
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  const getQRColors = () => {
    const colorSchemes = {
      modern: {
        dark: '#1E90FF', // Accent blue
        light: '#FFFFFF'
      },
      classic: {
        dark: '#0A0E27', // Primary dark
        light: '#FFFFFF'
      },
      minimal: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }
    
    return colorSchemes[style] || colorSchemes.modern
  }

  const createEnhancedQRCode = async (qrDataUrl) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Set canvas size
      canvas.width = size + 80 // Add space for branding
      canvas.height = size + (includeText ? 140 : 80)
      
      // Background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Load and draw QR code
      const img = new Image()
      img.onload = () => {
        // Draw QR code centered
        const qrX = (canvas.width - size) / 2
        const qrY = 40
        ctx.drawImage(img, qrX, qrY, size, size)
        
        // Add 1necard branding
        ctx.fillStyle = getQRColors().dark
        ctx.font = 'bold 16px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('1necard', canvas.width / 2, 25)
        
        if (includeText && username) {
          // Add username/text below QR
          ctx.font = '14px Inter, sans-serif'
          ctx.fillStyle = '#666666'
          ctx.fillText(`Scan to connect with ${username}`, canvas.width / 2, size + 70)
          
          // Add instructions
          ctx.font = '12px Inter, sans-serif'
          ctx.fillStyle = '#999999'
          ctx.fillText('Point your camera at this code', canvas.width / 2, size + 95)
        }
        
        // Add decorative elements for modern style
        if (style === 'modern') {
          // Add corner accents
          ctx.fillStyle = getQRColors().dark
          const cornerSize = 20
          // Top left
          ctx.fillRect(qrX - 10, qrY - 10, cornerSize, 4)
          ctx.fillRect(qrX - 10, qrY - 10, 4, cornerSize)
          // Top right
          ctx.fillRect(qrX + size - 10, qrY - 10, cornerSize, 4)
          ctx.fillRect(qrX + size + 6, qrY - 10, 4, cornerSize)
          // Bottom left
          ctx.fillRect(qrX - 10, qrY + size + 6, cornerSize, 4)
          ctx.fillRect(qrX - 10, qrY + size - 10, 4, cornerSize)
          // Bottom right
          ctx.fillRect(qrX + size - 10, qrY + size + 6, cornerSize, 4)
          ctx.fillRect(qrX + size + 6, qrY + size - 10, 4, cornerSize)
        }
        
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = qrDataUrl
    })
  }

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.download = `${username || 'profile'}_qr_code.png`
    link.href = qrCodeUrl
    link.click()
  }

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeUrl)
        const blob = await response.blob()
        const file = new File([blob], `${username}_qr_code.png`, { type: 'image/png' })
        
        await navigator.share({
          title: `${username}'s 1necard QR Code`,
          text: 'Scan this QR code to connect with me!',
          files: [file]
        })
      } catch (error) {
        console.error('Error sharing QR code:', error)
        // Fallback to copying URL
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm mx-auto">
      {/* QR Code Display */}
      <div className="mb-6">
        {qrCodeUrl ? (
          <img 
            src={qrCodeUrl} 
            alt="QR Code"
            className="mx-auto rounded-lg shadow-md"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        ) : (
          <div 
            className="bg-gray-100 rounded-lg flex items-center justify-center mx-auto"
            style={{ width: size, height: size }}
          >
            <span className="text-gray-500">QR Code</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadQRCode}
          className="flex-1 btn-primary flex items-center justify-center"
          disabled={!qrCodeUrl}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
        
        <button
          onClick={shareQRCode}
          className="flex-1 btn-secondary flex items-center justify-center"
          disabled={!qrCodeUrl}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </button>
        
        <button
          onClick={copyToClipboard}
          className="flex-1 btn-secondary flex items-center justify-center"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </>
          )}
        </button>
      </div>

      {/* Hidden canvas for enhanced QR generation */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={size + 80}
        height={size + 140}
      />
    </div>
  )
}

// QR Code Modal Component
export function QRCodeModal({ isOpen, onClose, profileUrl, username }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Your QR Code</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
        
        <QRCodeGenerator 
          profileUrl={profileUrl}
          username={username}
          size={280}
          includeText={true}
          style="modern"
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Anyone can scan this code to view your profile
          </p>
          <p className="text-xs text-gray-500">
            No app required • Works with any camera
          </p>
        </div>
      </div>
    </div>
  )
}

// Bulk QR Code Generator for printing
export function BulkQRGenerator({ profiles, onComplete }) {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const generateBulkQRCodes = async () => {
    setGenerating(true)
    setProgress(0)

    try {
      const QRCode = (await import('qrcode')).default
      const JSZip = (await import('jszip')).default
      
      const zip = new JSZip()
      
      for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i]
        const qrDataUrl = await QRCode.toDataURL(profile.url, {
          width: 512,
          margin: 2,
          color: {
            dark: '#0A0E27',
            light: '#FFFFFF'
          }
        })
        
        // Convert data URL to blob
        const response = await fetch(qrDataUrl)
        const blob = await response.blob()
        
        zip.file(`${profile.username}_qr_code.png`, blob)
        setProgress(((i + 1) / profiles.length) * 100)
      }
      
      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      
      // Download zip file
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = 'qr_codes_bulk.zip'
      link.click()
      
      onComplete?.()
    } catch (error) {
      console.error('Error generating bulk QR codes:', error)
    } finally {
      setGenerating(false)
      setProgress(0)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-primary mb-4">Bulk QR Code Generator</h3>
      
      {generating ? (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Generating QR codes...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Generate QR codes for {profiles.length} profiles
          </p>
          <button
            onClick={generateBulkQRCodes}
            className="btn-primary"
          >
            Generate & Download All
          </button>
        </div>
      )}
    </div>
  )
}