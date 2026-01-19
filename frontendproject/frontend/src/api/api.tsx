import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface JobModel {
    id: number;
    name: string;
    created_at: string
    updated_at: string
}

interface JobStatus {
    id: number
    job: JobModel
    status_type: string
    timestamp: string
}

export const getJobs = async (): Promise<JobModel[]> => {
    const response = await api.get<JobModel[]>('jobs');
    return response.data;
};

export const createJob = async (newData: Partial<JobModel>):Promise<JobModel> => {
    const response = await api.post<JobModel>('jobs', newData);
    return response.data;
};

export const updateJob = async (newData: Partial<JobModel>):Promise<JobModel> => {
    const response = await api.patch('jobs/${job.id}', newData);
    return response.data;
};

export const deleteJob = async (newData: Partial<JobModel>):Promise<JobModel> => {
    const response = await api.delete('jobs/${job.id}');
    return response.data;
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error: ', error)
        return Promise.reject(error);
    }
);