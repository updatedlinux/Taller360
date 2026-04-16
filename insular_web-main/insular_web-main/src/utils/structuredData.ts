export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Insular Casa de Cambio',
  alternateName: 'Insular',
  url: 'https://insular.io',
  logo: 'https://insular.io/logos/insular-logo.svg',
  description: 'Casa de cambio líder en Venezuela con los mejores tipos de cambio. Servicio seguro, rápido y confiable para todas tus necesidades de cambio de divisas.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Francisco de Miranda, Parque Cristal, Torre Oeste, Piso 4',
    addressLocality: 'Caracas',
    addressRegion: 'Distrito Capital',
    postalCode: '1060',
    addressCountry: 'VE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.4950,
    longitude: -66.8568,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+58-414-2093083',
    contactType: 'customer service',
    areaServed: 'VE',
    availableLanguage: ['es'],
  },
  sameAs: [
    'https://www.instagram.com/insular.io',
    'https://www.facebook.com/insular.io',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '15:30',
    },
  ],
  priceRange: '$$',
  currenciesAccepted: 'USD, EUR, VES',
  paymentAccepted: 'Cash, Bank Transfer, Zelle, PayPal',
  creator: {
    '@type': 'Organization',
    name: 'Van Alva',
    url: 'https://vanalva.io',
  },
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://insular.io${item.url}`,
  })),
});

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Insular Casa de Cambio',
  url: 'https://insular.io',
  creator: {
    '@type': 'Organization',
    name: 'Van Alva',
    url: 'https://vanalva.io',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://insular.io/buscar?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://insular.io/#organization',
  name: 'Insular Casa de Cambio',
  image: 'https://insular.io/images/hero/home-hero.webp',
  description: 'Casa de cambio líder en Venezuela con los mejores tipos de cambio.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Francisco de Miranda, Parque Cristal, Torre Oeste, Piso 4',
    addressLocality: 'Caracas',
    addressRegion: 'Distrito Capital',
    postalCode: '1060',
    addressCountry: 'VE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.4950,
    longitude: -66.8568,
  },
  url: 'https://insular.io',
  telephone: '+58-414-2093083',
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '15:30',
    },
  ],
};
