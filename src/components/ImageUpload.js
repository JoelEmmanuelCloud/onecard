'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, User, Camera, Crop, Check, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ImageUpload({ 
  currentImage, 
  onImageUpdate, 
  userId,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  aspectRatio = 1, // 1:1 for profile pictures
  size = 'large' // 'small', 'medium', 'large'
}) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const [error, setError] = useState('')
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  
  const fileInputRef = useRef(null)
  const cropperRef = useRef(null)

  // Responsive size classes
  const sizeClasses = {
    small: 'w-12 h-12 sm:w-16 sm:h-16',
    medium: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24', 
    large: 'w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32'
  }

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)'
    }
    
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
    
    return null
  }

  const handleFileSelect = (file) => {
    setError('')
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setCropModalOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const uploadImage = async (croppedBlob) => {
    try {
      setUploading(true)
      setError('')

      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${userId}/profile_${Date.now()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, croppedBlob, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      const imageUrl = urlData.publicUrl

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: imageUrl })
        .eq('user_id', userId)

      if (updateError) throw updateError

      // Delete old image if it exists
      if (currentImage && currentImage.includes('supabase')) {
        const oldPath = currentImage.split('/').pop()
        if (oldPath) {
          await supabase.storage
            .from('profile-images')
            .remove([`${userId}/${oldPath}`])
        }
      }

      setPreview(imageUrl)
      onImageUpdate?.(imageUrl)
      setCropModalOpen(false)

    } catch (error) {
      console.error('Image upload error:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCrop = async () => {
    if (!cropperRef.current) return

    // Get cropped canvas (this would use a cropper library like react-image-crop)
    // For now, we'll simulate cropping by using the original file
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Simple center crop simulation
      const size = Math.min(img.width, img.height)
      const x = (img.width - size) / 2
      const y = (img.height - size) / 2
      
      canvas.width = 400
      canvas.height = 400
      
      ctx.drawImage(img, x, y, size, size, 0, 0, 400, 400)
      
      canvas.toBlob((blob) => {
        if (blob) {
          uploadImage(blob)
        }
      }, 'image/jpeg', 0.9)
    }
    
    img.src = preview
  }

  const removeImage = async () => {
    try {
      setUploading(true)

      // Remove from database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: null })
        .eq('user_id', userId)

      if (updateError) throw updateError

      // Remove from storage if it's a Supabase image
      if (currentImage && currentImage.includes('supabase')) {
        const path = currentImage.split('/').pop()
        if (path) {
          await supabase.storage
            .from('profile-images')
            .remove([`${userId}/${path}`])
        }
      }

      setPreview(null)
      onImageUpdate?.(null)

    } catch (error) {
      console.error('Error removing image:', error)
      setError('Failed to remove image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="space-y-4 w-full">
        {/* Current Image Display - Mobile First */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 flex-shrink-0`}>
            {preview ? (
              <img 
                src={preview} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-1/2 h-1/2 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Profile Picture</h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Upload a photo to personalize your profile
            </p>
            {error && (
              <p className="text-xs sm:text-sm text-red-600 mt-2 flex items-center justify-center sm:justify-start">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                <span className="break-words">{error}</span>
              </p>
            )}
          </div>
        </div>

        {/* Upload Area - Responsive */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
            dragActive
              ? 'border-accent bg-accent/5'
              : 'border-gray-300 hover:border-accent hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-2">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                <span className="hidden sm:inline">Click to upload or drag and drop</span>
                <span className="sm:hidden">Tap to upload photo</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG or WebP up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive Stack */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center py-2.5 sm:py-3 px-4 text-sm sm:text-base"
          >
            <Camera className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Choose Photo'}
          </button>
          
          {preview && (
            <button
              onClick={removeImage}
              disabled={uploading}
              className="flex-1 btn-secondary disabled:opacity-50 flex items-center justify-center py-2.5 sm:py-3 px-4 text-sm sm:text-base"
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Crop Modal - Mobile Optimized */}
      <AnimatePresence>
        {cropModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg font-semibold text-primary">Crop Image</h3>
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Crop Area - Responsive Size */}
              <div className="mb-4 sm:mb-6">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                  {preview && (
                    <img 
                      ref={cropperRef}
                      src={preview} 
                      alt="Crop preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Crop overlay */}
                  <div className="absolute inset-3 sm:inset-4 border-2 border-white rounded-full shadow-lg"></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                  Adjust the image to fit within the circle
                </p>
              </div>

              {/* Crop Actions - Mobile Stack */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="flex-1 btn-secondary py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCrop}
                  disabled={uploading}
                  className="flex-1 btn-primary disabled:opacity-50 py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Bulk Image Upload Component - Mobile Optimized
export function BulkImageUpload({ profiles, onComplete }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState([])

  const handleBulkUpload = async (files) => {
    setUploading(true)
    setProgress(0)
    const uploadResults = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const profile = profiles[i]
        
        if (!profile) continue

        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${profile.userId}/profile_${Date.now()}.${fileExt}`
          
          const { data, error } = await supabase.storage
            .from('profile-images')
            .upload(fileName, file)

          if (error) throw error

          const { data: urlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(fileName)

          uploadResults.push({
            profile: profile.name,
            success: true,
            url: urlData.publicUrl
          })

        } catch (error) {
          uploadResults.push({
            profile: profile.name,
            success: false,
            error: error.message
          })
        }

        setProgress(((i + 1) / files.length) * 100)
      }

      setResults(uploadResults)
      onComplete?.(uploadResults)

    } catch (error) {
      console.error('Bulk upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">Bulk Image Upload</h3>
      
      {uploading ? (
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2 text-sm sm:text-base">Uploading images...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Upload Results:</h4>
          <div className="max-h-48 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <span className="text-xs sm:text-sm truncate flex-1 mr-2">{result.profile}</span>
                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.success ? 'Success' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Upload profile images for multiple users</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleBulkUpload(Array.from(e.target.files || []))}
            className="hidden"
            id="bulk-upload"
          />
          <label
            htmlFor="bulk-upload"
            className="btn-primary cursor-pointer inline-flex items-center justify-center w-full sm:w-auto py-2.5 sm:py-3 px-4 text-sm sm:text-base"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Images
          </label>
        </div>
      )}
    </div>
  )
}