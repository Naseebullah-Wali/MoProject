import axios from 'axios';

const API_URL = 'http://localhost:3000/projects';

export const fetchProjects = () => axios.get(API_URL);
export const addProject = (data) => axios.post(API_URL, data);
export const updateProject = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteProject = (id) => axios.delete(`${API_URL}/${id}`);
