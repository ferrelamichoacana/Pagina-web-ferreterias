/**
 * Datos maestros reales de Ferretería La Michoacana
 * Estos son los datos que se migrarán a Firebase y se gestionarán desde el panel de admin
 */

// Sucursales reales de Ferretería La Michoacana
export const realBranches = [
  {
    id: 'puente',
    name: 'Sucursal Puente',
    city: 'Corregidora',
    state: 'Querétaro',
    address: 'Av. Paseo Constituyentes, El Pueblito, Qro., 76900, Corregidora, Qro. México.',
    phone: '(442) 786 0631',
    email: 'puente@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00, Dom: 9:00-15:00',
    coordinates: { lat: 20.532214, lng: -100.441519 },
    isMain: true,
    managerId: null,
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio', 'Asesoría técnica'],
    manager: '',
    active: true
  },
  {
    id: 'santa-barbara',
    name: 'Sucursal Santa Bárbara',
    city: 'Querétaro',
    state: 'Querétaro',
    address: 'Sebastián Lerdo de Tejada #6 Col Santa Bárbara C.P. 76906, 76906 Qro.',
    phone: '(442) 677 0568',
    email: 'santabarbara@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00, Dom: 9:00-14:00',
    coordinates: { lat: 20.528593, lng: -100.443397 },
    isMain: false,
    managerId: null,
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio'],
    manager: '',
    active: true
  }
];

// Marcas reales que maneja Ferretería La Michoacana
export const realBrands = [
  {
    id: '1',
    name: 'Häfele',
    logo: '/images/brands/haefele_logo.png',
    category: 'Herrajes y Accesorios',
    featured: true,
    active: true,
    description: 'Líder mundial en herrajes y accesorios para muebles',
    website: 'https://www.hafele.com.mx'
  },
  {
    id: '2',
    name: 'Cerrajes',
    logo: '/images/brands/logo_cerrajes.png',
    category: 'Cerraduras y Herrajes',
    featured: true,
    active: true,
    description: 'Especialistas en cerraduras y sistemas de seguridad',
    website: ''
  },
  {
    id: '3',
    name: 'HandyHome',
    logo: '/images/brands/logo_handyhome.png',
    category: 'Herrajes, Jaladeras y Accesorios',
    featured: true,
    active: true,
    description: 'Accesorios para el hogar y ferreterías',
    website: ''
  },
  {
    id: '4',
    name: 'HERMA',
    logo: '/images/brands/logo_herma.png',
    category: 'Cerraduras y Herrajes',
    featured: true,
    active: true,
    description: 'Cerraduras de alta seguridad y herrajes',
    website: ''
  },
  {
    id: '5',
    name: 'Soarma',
    logo: '/images/brands/logo_soarma.png',
    category: 'Herrajes y Accesorios',
    featured: true,
    active: true,
    description: 'Herrajes y accesorios para construcción',
    website: ''
  },
  {
    id: '6',
    name: 'Sayer',
    logo: '/images/brands/logo_sayer.png',
    category: 'Pinturas y Recubrimientos',
    featured: true,
    active: true,
    description: 'Pinturas y recubrimientos de calidad',
    website: ''
  },
  {
    id: '7',
    name: 'RESISTOL',
    logo: '/images/brands/logo_resistol.png',
    category: 'Pegamentos y Adhesivos',
    featured: true,
    active: true,
    description: 'Adhesivos y pegamentos industriales',
    website: 'https://www.resistol.com.mx'
  },
  {
    id: '8',
    name: 'TRUPER',
    logo: '/images/brands/logo_truper.png',
    category: 'Herramientas',
    featured: true,
    active: true,
    description: 'Herramientas mexicanas de calidad profesional',
    website: 'https://www.truper.com'
  },
  {
    id: '9',
    name: 'DeWALT',
    logo: '/images/brands/logo_dewalt.png',
    category: 'Herramientas Eléctricas',
    featured: true,
    active: true,
    description: 'Herramientas profesionales de alta resistencia',
    website: 'https://www.dewalt.com.mx'
  },
  {
    id: '10',
    name: 'Makita',
    logo: '/images/brands/logo_makita.png',
    category: 'Herramientas Eléctricas',
    featured: true,
    active: true,
    description: 'Innovación en herramientas eléctricas',
    website: 'https://www.makita.com.mx'
  },
  {
    id: '11',
    name: 'Black & Decker',
    logo: '/images/brands/logo_blackdecker.png',
    category: 'Herramientas',
    featured: false,
    active: true,
    description: 'Herramientas para el hogar y profesionales',
    website: 'https://www.blackanddecker.com.mx'
  },
  {
    id: '12',
    name: 'Stanley',
    logo: '/images/brands/logo_stanley.png',
    category: 'Herramientas',
    featured: false,
    active: true,
    description: 'Herramientas manuales de precisión',
    website: 'https://www.stanleytools.com.mx'
  },
  {
    id: '13',
    name: 'Silverline',
    logo: '/images/brands/logo_silverline.png',
    category: 'Maquinaria y Herramienta',
    featured: true,
    active: true,
    description: 'Herramientas y maquinaria especializada',
    website: ''
  }
];

// Configuración del sistema real
export const realSystemConfig = {
  companyName: 'Ferretería La Michoacana',
  slogan: 'Tu ferretería de confianza con más de 8 años de experiencia',
  description: 'Somos una empresa con más de 8 años de experiencia en el sector de materiales de construcción, herramientas y productos para el hogar. Nos especializamos en brindar soluciones completas para construcción, remodelación y mantenimiento.',
  heroTitle: 'Ferretería La Michoacana',
  heroSubtitle: 'Materiales de construcción y herramientas de calidad',
  phone: '(442) 786 0631',
  email: 'contacto@ferreterialamichoacana.com',
  address: 'Av. Paseo Constituyentes, El Pueblito, Qro., 76900',
  socialMedia: {
    facebook: 'https://facebook.com/ferreterialamichoacana',
    instagram: 'https://instagram.com/ferreterialamichoacana',
    whatsapp: '+524427860631'
  },
  businessHours: {
    weekdays: '8:00 - 19:00',
    saturday: '8:00 - 17:00',
    sunday: '9:00 - 15:00'
  },
  features: [
    'Venta al público y mayoreo',
    'Entrega a domicilio',
    'Asesoría técnica especializada',
    'Amplio catálogo de productos',
    'Precios competitivos',
    'Atención personalizada'
  ]
};

// Categorías de productos reales
export const realProductCategories = [
  'Herrajes y Accesorios',
  'Cerraduras y Herrajes',
  'Herramientas',
  'Herramientas Eléctricas',
  'Pinturas y Recubrimientos',
  'Pegamentos y Adhesivos',
  'Maquinaria y Herramienta',
  'Materiales de Construcción',
  'Fontanería',
  'Electricidad',
  'Ferretería General'
];

// Servicios reales que ofrece la empresa
export const realServices = [
  'Venta al público',
  'Venta mayorista',
  'Entrega a domicilio',
  'Asesoría técnica',
  'Cotizaciones personalizadas',
  'Proyectos de construcción'
];
