import { api, toErrorMessage } from './client';

export async function getCustomerProfile() {
  try {
    const { data } = await api.get('/api/customer/profile');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function updateCustomerProfile(payload) {
  try {
    const { data } = await api.put('/api/customer/profile', payload);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function submitApplication(customerIdIgnoredByBackend, payload) {
  try {
    const { data } = await api.post('/api/customer/applications', payload);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function resubmitApplication(applicationId, payload) {
  try {
    const { data } = await api.put(`/api/customer/applications/${encodeURIComponent(applicationId)}`, payload);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function listCustomerApplications() {
  try {
    const { data } = await api.get('/api/customer/applications');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function getApplicationByApplicationId(applicationId) {
  try {
    const { data } = await api.get(`/api/customer/applications/${encodeURIComponent(applicationId)}`);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}





