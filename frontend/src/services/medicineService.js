import axiosInstance from '../api/axiosInstance';

export const getMedicines = async (search = '', status = '') => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  
  const response = await axiosInstance.get('/medicines', { params });
  return response.data;
};

export const getMedicineById = async (id) => {
  const response = await axiosInstance.get(`/medicines/${id}`);
  return response.data;
};

export const createMedicine = async (medicineData) => {
  const response = await axiosInstance.post('/medicines', medicineData);
  return response.data;
};

export const updateMedicine = async (id, medicineData) => {
  const response = await axiosInstance.put(`/medicines/${id}`, medicineData);
  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await axiosInstance.delete(`/medicines/${id}`);
  return response.data;
};

export const markMedicineAsTaken = async (id) => {
  const response = await axiosInstance.patch(`/medicines/${id}/taken`);
  return response.data;
};

export const searchDrugSuggestions = async (query = '') => {
  const response = await axiosInstance.get(`/drugs/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getDrugInfoFromFDA = async (name) => {
  const response = await axiosInstance.get(`/drugs/info?name=${encodeURIComponent(name)}`);
  return response.data;
};
