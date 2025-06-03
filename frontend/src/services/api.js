import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getEstudiantes = () => axios.get(`${API_URL}/estudiantes/`);
export const getEstudiante = (id) => axios.get(`${API_URL}/estudiantes/${id}/`);
export const createEstudiante = (data) => axios.post(`${API_URL}/estudiantes/`, data);
export const updateEstudiante = (id, data) => axios.put(`${API_URL}/estudiantes/${id}/`, data);
export const deleteEstudiante = (id) => axios.delete(`${API_URL}/estudiantes/${id}/`); 