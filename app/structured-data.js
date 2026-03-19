// Structured Data (JSON-LD) for SEO
export function getLocalBusinessSchema(contactInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://kevincab.co.ke/#organization',
    name: 'Kevincab Tour and Travel',
    alternateName: 'Kevincab Kenya',
    description: 'Leading taxi and cab services in Kenya. 24/7 airport transfers, hotel pickups, and reliable transportation across all 47 counties.',
    url: 'https://kevincab.co.ke',
    telephone: contactInfo?.phone || '+254716406998',
    email: contactInfo?.email || 'karugokevin527@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contactInfo?.address || 'Nairobi',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.286389,
      longitude: 36.817223,
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Kenya',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'All 47 Counties of Kenya',
      },
    ],
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      'https://facebook.com/kevincab',
      'https://twitter.com/kevincab',
      'https://instagram.com/kevincab',
    ],
  };
}

export function getServiceSchema(services) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Taxi and Cab Services',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Kevincab Tour and Travel',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Taxi Services',
      itemListElement: services?.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
        },
        position: index + 1,
      })) || [],
    },
  };
}

export function getBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://kevincab.co.ke',
      },
    ],
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kevincab Tour and Travel',
    url: 'https://kevincab.co.ke',
    logo: 'https://kevincab.co.ke/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254716406998',
      contactType: 'Customer Service',
      areaServed: 'KE',
      availableLanguage: ['English', 'Swahili'],
    },
  };
}
