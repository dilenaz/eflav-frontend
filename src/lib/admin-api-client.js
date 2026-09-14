export class AdminRequestError extends Error {
  constructor(message, { status = 0, errors = {} } = {}) {
    super(message);
    this.name = 'AdminRequestError';
    this.status = status;
    this.errors = errors;
  }
}

async function readJsonSafely(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return {};

  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function adminRequest(url, options = {}, fallbackMessage = 'İşlem tamamlanamadı.') {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new AdminRequestError('Sunucuya bağlanılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
  }

  const data = await readJsonSafely(response);

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/admin/giris?reason=session-expired');
      window.location.reload();
    }
    throw new AdminRequestError('Oturumunuz sona erdi. Yeniden giriş yapmanız gerekiyor.', { status: 401 });
  }

  if (!response.ok) {
    throw new AdminRequestError(data.message || fallbackMessage, {
      status: response.status,
      errors: data.errors || {},
    });
  }

  return data;
}

export async function publicJsonRequest(url, options = {}, fallbackMessage = 'İşlem tamamlanamadı.') {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new AdminRequestError('Sunucuya bağlanılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
  }

  const data = await readJsonSafely(response);
  if (!response.ok) {
    throw new AdminRequestError(data.message || fallbackMessage, {
      status: response.status,
      errors: data.errors || {},
    });
  }

  return data;
}
