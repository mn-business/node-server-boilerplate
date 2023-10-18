export async function fetchGet(url, params) {
  const urlWithParams = params ? `${url}?${params}` : url;
  return fetch(urlWithParams, {
    method: 'GET',
  });
}

export async function fetchPost(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content'),
    },
    body: JSON.stringify(data),
  });
}

export async function fetchDelete(url) {
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content'),
    },
  });
}

export function formatDate(date, delemeter) {
  const result =
    date.getFullYear() +
    delemeter +
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    delemeter +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  return result;
}
