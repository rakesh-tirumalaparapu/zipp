import { api, API_BASE, toErrorMessage } from './client';

async function handleJsonResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function login({ email, password, role }) {
  const body = { email, password, role };
  try {
    const { data } = await api.post('/api/auth/login', body);
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function signup({ firstName, middleName, lastName, email, phoneNumber, password, favoriteCity, favoriteFood, favoriteColor }) {
  const body = { firstName, middleName, lastName, email, phoneNumber, password, favoriteCity, favoriteFood, favoriteColor };
  try {
    const res = await api.post('/api/auth/signup', body, { responseType: 'text' });
    return { message: res.data || 'Signed up successfully' };
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function verifySecurityQuestions({ email, favoriteCity, favoriteFood, favoriteColor }) {
  const body = { email, favoriteCity, favoriteFood, favoriteColor };
  try {
    const res = await api.post('/api/auth/forgot-password', body, { responseType: 'text' });
    return { message: res.data || 'Security questions verified successfully' };
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function resetPassword({ email, newPassword, confirmPassword }) {
  const body = { email, newPassword, confirmPassword };
  try {
    const res = await api.post('/api/auth/reset-password', body, { responseType: 'text' });
    return { message: res.data || 'Password reset successfully' };
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}


