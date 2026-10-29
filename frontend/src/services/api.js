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
