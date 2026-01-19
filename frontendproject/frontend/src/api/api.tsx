import axios from 'axios';

const API_BASE_URL = '/api/';
//'http://localhost:8000/api/';  // Add trailing slash; adjust port if Docker maps differently (e.g., http://localhost:8080/api/)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface JobModel {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  current_status: string;  // Added to match Django serializer
}

export const getJobs = async (): Promise<JobModel[]> => {
  const response = await api.get<JobModel[]>('jobs/');
  return response.data;
};

export const createJob = async (newData: { name: string }): Promise<JobModel> => {
  const response = await api.post<JobModel>('jobs/', newData);
  return response.data;
};

export const updateJob = async (id: number, newData: { status_type: string }): Promise<JobModel> => {
  const response = await api.patch<JobModel>(`jobs/${id}/`, newData);  // Fixed template literal
  return response.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`jobs/${id}/`);  // Fixed template literal; no data return
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);