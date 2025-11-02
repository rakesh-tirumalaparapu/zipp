import { api, toErrorMessage } from './client';

export async function uploadDocument(applicationId, documentType, file) {
  try {
    const form = new FormData();
    form.append('applicationId', applicationId);
    form.append('documentType', documentType);
    form.append('file', file);
    const { data } = await api.post('/api/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'text',
    });
    return { message: data || 'Uploaded' };
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function getDocument(documentId) {
  try {
    const res = await api.get(`/api/documents/${documentId}`, { responseType: 'blob' });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function listDocumentsByApplication(applicationId) {
  try {
    const { data } = await api.get(`/api/documents/application/${encodeURIComponent(applicationId)}`);
    return data; // array of Document metadata if controller returns objects; else adjust
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function listDocumentIdsByApplication(applicationId) {
  try {
    const { data } = await api.get(`/api/documents/application/${encodeURIComponent(applicationId)}/ids`);
    return data; // [{ id, documentType }]
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}





