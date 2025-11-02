import { api, toErrorMessage } from './client';

export async function listCheckerApplications() {
  try {
    const { data } = await api.get('/api/checker/applications');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function getCheckerApplicationById(applicationId) {
  try {
    const { data } = await api.get(`/api/checker/applications/${encodeURIComponent(applicationId)}`);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function reviewCheckerApplication(applicationId, action, comment) {
  try {
    const payload = { action, comment };
    const { data } = await api.post(`/api/checker/applications/${encodeURIComponent(applicationId)}/review`, payload);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function getCheckerProfile() {
  try {
    const { data } = await api.get('/api/checker/profile');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}


