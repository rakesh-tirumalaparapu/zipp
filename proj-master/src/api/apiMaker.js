import { api, toErrorMessage } from './client';

export async function listMakerApplications() {
  try {
    const { data } = await api.get('/api/maker/applications');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function getMakerApplicationById(applicationId) {
  try {
    const { data } = await api.get(`/api/maker/applications/${encodeURIComponent(applicationId)}`);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function reviewMakerApplication(applicationId, action, comment) {
  try {
    const payload = { action, comment };
    const { data } = await api.post(`/api/maker/applications/${encodeURIComponent(applicationId)}/review`, payload);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function getMakerProfile() {
  try {
    const { data } = await api.get('/api/maker/profile');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}


