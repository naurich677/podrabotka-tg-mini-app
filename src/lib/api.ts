const API_BASE = '/api';

let _initData = '';

export function setInitData(data: string) {
  _initData = data;
}

export function getInitData() {
  return _initData;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (_initData) {
    headers['Authorization'] = `tma ${_initData}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'API Error');
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    init: (initData: string) => request<Record<string, unknown>>('/auth/telegram/init', {
      method: 'POST',
      body: JSON.stringify({ initData }),
    }),
    me: () => request<Record<string, unknown>>('/auth/me'),
  },

  // Phone
  phone: {
    requestPhone: () => request<Record<string, unknown>>('/user/request-phone', { method: 'POST' }),
    confirm: (phone: string) => request<Record<string, unknown>>('/user/phone/confirm', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
    botContact: (telegramId: number, phone: string) => request<Record<string, unknown>>('/user/phone/bot-contact', {
      method: 'POST',
      body: JSON.stringify({ telegramId, phone }),
    }),
  },

  // Jobs
  jobs: {
    list: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<Record<string, unknown>>(`/jobs${query}`);
    },
    get: (id: string) => request<Record<string, unknown>>(`/jobs/${id}`),
    create: (data: Record<string, unknown>) => request<Record<string, unknown>>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) => request<Record<string, unknown>>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    publish: (id: string) => request<Record<string, unknown>>(`/jobs/${id}/publish`, { method: 'POST' }),
    close: (id: string) => request<Record<string, unknown>>(`/jobs/${id}/close`, { method: 'POST' }),
    apply: (id: string) => request<Record<string, unknown>>(`/jobs/${id}/apply`, { method: 'POST' }),
  },

  // Applications
  applications: {
    my: () => request<Record<string, unknown>>('/applications/my'),
    approve: (id: string) => request<Record<string, unknown>>(`/applications/${id}/approve`, { method: 'PATCH' }),
    reject: (id: string) => request<Record<string, unknown>>(`/applications/${id}/reject`, { method: 'PATCH' }),
    arrived: (id: string) => request<Record<string, unknown>>(`/applications/${id}/arrived`, { method: 'PATCH' }),
    complete: (id: string) => request<Record<string, unknown>>(`/applications/${id}/complete`, { method: 'PATCH' }),
    paid: (id: string) => request<Record<string, unknown>>(`/applications/${id}/paid`, { method: 'PATCH' }),
  },

  // Profile
  profile: {
    get: () => request<Record<string, unknown>>('/profile'),
    update: (data: Record<string, unknown>) => request<Record<string, unknown>>('/profile', { method: 'PATCH', body: JSON.stringify(data) }),
    updateWorker: (data: Record<string, unknown>) => request<Record<string, unknown>>('/profile/worker', { method: 'PATCH', body: JSON.stringify(data) }),
    updateEmployer: (data: Record<string, unknown>) => request<Record<string, unknown>>('/profile/employer', { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Notifications
  notifications: {
    list: () => request<Record<string, unknown>>('/notifications'),
  },
};
