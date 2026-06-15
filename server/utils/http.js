const FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}`);
  }
  return response.json();
}

export function postForm(url, params) {
  return fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': FORM_URL_ENCODED },
    body: params,
  });
}

export function getJson(url, headers = {}) {
  return fetchJson(url, { method: 'GET', headers });
}
