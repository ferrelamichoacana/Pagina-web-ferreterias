// Datos de sucursales - Centralizados para fácil mantenimiento
// Para agregar una nueva sucursal, simplemente añadir una entrada aquí

export const branches = [
  {
    id: 'puente',
    name: 'Sucursal Puente',
    city: 'Morelia',
    state: 'Michoacán',
    address: 'Av. Puente #123, Col. Puente',
    phone: '(443) 123-4567',
    email: 'puente@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00, Dom: 9:00-15:00',
    coordinates: { lat: 19.7026, lng: -101.1947 },
    isMain: true,
    managerId: null, // Se asignará cuando se cree el usuario gerente
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio', 'Asesoría técnica']
  },
  {
    id: 'santa-barbara',
    name: 'Sucursal Santa Barbara',
    city: 'Morelia',
    state: 'Michoacán',
    address: 'Av. Santa Barbara #456, Col. Santa Barbara',
    phone: '(443) 234-5678',
    email: 'santabarbara@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00',
    coordinates: { lat: 19.6888, lng: -101.1844 },
    isMain: false,
    managerId: null,
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio']
  }
]

// Función para obtener sucursal por ID
export function getBranchById(id: string) {
  return branches.find(branch => branch.id === id)
}

// Función para obtener sucursales por estado
export function getBranchesByState(state: string) {
  return branches.filter(branch => branch.state === state)
}

// Función para obtener la sucursal principal
export function getMainBranch() {
  return branches.find(branch => branch.isMain)
}

// Función para calcular distancia entre dos puntos (fórmula de Haversine)
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distancia en km
}

// Función para encontrar la sucursal más cercana
export function findNearestBranch(userLat: number, userLng: number) {
  let nearestBranch = branches[0]
  let minDistance = calculateDistance(
    userLat, 
    userLng, 
    nearestBranch.coordinates.lat, 
    nearestBranch.coordinates.lng
  )

  branches.forEach(branch => {
    const distance = calculateDistance(
      userLat, 
      userLng, 
      branch.coordinates.lat, 
      branch.coordinates.lng
    )
    if (distance < minDistance) {
      minDistance = distance
      nearestBranch = branch
    }
  })

  return { branch: nearestBranch, distance: minDistance }
}