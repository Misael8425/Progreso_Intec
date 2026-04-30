const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const obtenerPensum = async () => {
  const response = await fetch(`${API_URL}/pensum`);
  if (!response.ok) {
    throw new Error('Error al obtener el pensum');
  }
  return response.json();
};

export const obtenerHistorialTrimestres = async () => {
  const response = await fetch(`${API_URL}/trimestres`);
  if (!response.ok) {
    throw new Error('Error al obtener el historial de trimestres');
  }
  return response.json();
};

export const obtenerVolanteActivo = async () => {
  const response = await fetch(`${API_URL}/volantes/activo`);
  if (!response.ok) {
    throw new Error('Error al obtener el volante activo');
  }
  return response.json();
};

export const obtenerHistorialSimulaciones = async () => {
  const response = await fetch(`${API_URL}/simulaciones`);
  if (!response.ok) {
    throw new Error('Error al obtener el historial de simulaciones');
  }
  return response.json();
};

export const calcularSimulacion = async (asignaturas) => {
  const response = await fetch(`${API_URL}/simulaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ asignaturas })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al calcular la simulación');
  }
  return response.json();
};
