export const fetchAPI = async (
  url,
  method = 'GET',
  body = null,
  token = null
) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = {
    method,
    headers
  };

  if (body && !(body instanceof FormData)) {
    options.body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  } else if (body) {
    options.body = body;
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }
    return await res.json();
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    throw error;
  }
};
