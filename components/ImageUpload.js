'use client';

import { useState, useCallback } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { CloudUpload, Close, Image as ImageIcon } from '@mui/icons-material';

export default function ImageUpload({ 
  value, 
  onChange, 
  label = 'Upload Image',
  helperText = 'Drag and drop an image here, or click to select',
  maxSize = 5, // MB
  accept = 'image/*'
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = async (file) => {
    setError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.url);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          {label}
        </Typography>
      )}

      {value ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Preview"
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <IconButton
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 200,
            border: '2px dashed',
            borderColor: isDragging ? 'secondary.main' : 'divider',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            bgcolor: isDragging ? 'rgba(255, 193, 7, 0.05)' : 'grey.50',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'secondary.main',
              bgcolor: 'rgba(255, 193, 7, 0.05)',
            },
            position: 'relative',
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <CircularProgress size={40} />
          ) : (
            <>
              {isDragging ? (
                <ImageIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
              ) : (
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', px: 2 }}>
                {helperText}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>
                Max size: {maxSize}MB
              </Typography>
            </>
          )}
        </Box>
      )}

      {error && (
        <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
