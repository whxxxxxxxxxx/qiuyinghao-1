import axios from 'axios';

// const API_BASE_URL = 'http://101.126.131.6:8080/api'; // 根据您的后端API地址调整
const API_BASE_URL = 'http://127.0.0.1:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 病历检查相关API
export const getExaminationList = (queryString = '') => api.get(`/medical-examinations${queryString}`);
export const getExamination = (id) => api.get(`/medical-examinations/${id}`);
export const createExamination = (data) => api.post('/medical-examinations', data);
export const updateExamination = (id, data) => api.put(`/medical-examinations/${id}`, data);
export const deleteExamination = (id) => api.delete(`/medical-examinations/${id}`);

// 检查项目相关API
export const getExaminationItemList = () => api.get('/examination-items');
export const getExaminationItem = (id) => api.get(`/examination-items/${id}`);
export const createExaminationItem = (data) => api.post('/examination-items', data);
export const updateExaminationItem = (id, data) => api.put(`/examination-items/${id}`, data);
export const deleteExaminationItem = (id) => api.delete(`/examination-items/${id}`);

// 医生相关API
export const getDoctorList = () => api.get('/doctors');
export const getDoctor = (id) => {
  if (!id || id === 'undefined') {
    return Promise.reject(new Error('无效的医生ID'));
  }
  return api.get(`/doctors/${id}`);
};
export const createDoctor = (data) => api.post('/doctors', data);
export const updateDoctor = (id, data) => {
  if (!id || id === 'undefined') {
    return Promise.reject(new Error('无效的医生ID'));
  }
  return api.put(`/doctors/${id}`, data);
};
export const deleteDoctor = (id) => {
  if (!id || id === 'undefined') {
    return Promise.reject(new Error('无效的医生ID'));
  }
  return api.delete(`/doctors/${id}`);
};

// 材料相关API
export const getMaterialList = () => api.get('/materials');
export const getMaterial = (id) => api.get(`/materials/${id}`);
export const createMaterial = (data) => api.post('/materials', data);
export const updateMaterial = (id, data) => api.put(`/materials/${id}`, data);
export const deleteMaterial = (id) => api.delete(`/materials/${id}`);

// 检查项目材料相关API
export const addMaterialToItem = (itemId, materialId, quantity) => api.post(`/examination-items/materials/${itemId}/${materialId}`, { quantity });
export const removeMaterialFromItem = (itemId, materialId) => api.delete(`/examination-items/materials/${itemId}/${materialId}`);

// 导出病历检查记录为Excel
export const exportExaminationsToExcel = (params) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/medical-examinations/export?${queryString}`;
  
  // 使用window.open直接下载文件
  window.open(url, '_blank');
  
  return Promise.resolve();
};

// 科室相关API
export const getDepartmentList = () => api.get('/departments');
export const getDepartment = (id) => api.get(`/departments/${id}`);
export const createDepartment = (data) => api.post('/departments', data);
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

// 医院运营看板API
export const getDashboardSummary = () => api.get('/dashboard/summary');

export default api;