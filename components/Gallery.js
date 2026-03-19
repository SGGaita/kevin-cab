'use client';

import { Box, Container, Typography, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 6;

const defaultImages = [
  { url: '/uploads/gallery/Elephant.jpeg', caption: 'Majestic Elephants' },
  { url: '/uploads/gallery/lion.jpeg', caption: 'Wild Lions' },
  { url: '/uploads/gallery/giraffe.jpeg', caption: 'Giraffe Family' },
  { url: '/uploads/gallery/cheetah.jpeg', caption: 'Cheetah Sprint' },
  { url: '/uploads/gallery/rhino.jpeg', caption: 'Rhino Power' },
  { url: '/uploads/gallery/buffalo.jpeg', caption: 'Buffalo Herd' },
  { url: '/uploads/gallery/leopard.jpeg', caption: 'Leopard Watch' },
  { url: '/uploads/gallery/hippo.jpeg', caption: 'Hippo Pool' },
  { url: '/uploads/gallery/Lake Nakuru.jpeg', caption: 'Lake Nakuru' },
  { url: '/uploads/gallery/baboon.jpeg', caption: 'Baboon Troop' },
  { url: '/uploads/gallery/baboon2.jpeg', caption: 'Baboon Family' },
  { url: '/uploads/gallery/crocodile.jpeg', caption: 'Nile Crocodile' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [galleryImages, setGalleryImages] = useState(defaultImages);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/cms/gallery');
      const result = await response.json();
      if (result.success && result.images && result.images.length > 0) {
        setGalleryImages(result.images.map(img => ({
          url: img.image_url,
          caption: img.caption
        })));
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    }
  };

  const totalPages = Math.ceil(galleryImages.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImages = galleryImages.slice(startIndex, endIndex);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <Box id="gallery" sx={{ py: 12, bgcolor: '#f9f9f9' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Safari{' '}
            <Box
              component="span"
              sx={{
                color: 'secondary.dark',
                textDecoration: 'underline',
                textDecorationColor: 'secondary.main',
                textUnderlineOffset: 8,
              }}
            >
              Gallery
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}
          >
            Explore the beauty of Kenya's wildlife through our safari adventures
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          {currentImages.map((image, index) => (
            <Box
              key={index}
              onClick={() => setSelectedImage(image)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(2deg)',
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: 'white',
                  p: 2,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transform: index % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  component="img"
                  src={image.url}
                  alt={image.caption}
                  sx={{
                    width: '100%',
                    height: 280,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    textAlign: 'center',
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1.3rem',
                    color: 'text.primary',
                  }}
                >
                  {image.caption}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            mt: 6,
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'secondary.main',
                color: 'white',
              },
            }}
          >
            <ArrowBackIos sx={{ ml: 0.5 }} />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentPage(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: currentPage === index ? 'secondary.main' : '#ddd',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.3)',
                  },
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'secondary.main',
                color: 'white',
              },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mt: 2,
            color: 'text.secondary',
          }}
        >
          Page {currentPage + 1} of {totalPages} • {galleryImages.length} photos total
        </Typography>

        {selectedImage && (
          <Box
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              p: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: 'white',
                p: 3,
                maxWidth: 800,
                maxHeight: '90vh',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box
                component="img"
                src={selectedImage.url}
                alt={selectedImage.caption}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 'calc(90vh - 100px)',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  textAlign: 'center',
                  fontFamily: "'Caveat', cursive",
                  fontSize: '1.8rem',
                }}
              >
                {selectedImage.caption}
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
