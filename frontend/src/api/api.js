import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};

export const getProjects = async (token) => {
  const response = await axios.get(`${API_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createProject = async (project, token) => {
  const response = await axios.post(`${API_URL}/projects`, project, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getProjectById = async (id, token) => {
  const response = await axios.get(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProject = async (id, project, token) => {
  const response = await axios.put(`${API_URL}/projects/${id}`, project, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};