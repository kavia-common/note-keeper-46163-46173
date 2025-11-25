/**
 * Resolve the backend base URL.
 * Priority: REACT_APP_API_BASE env -> fallback to local dev http://localhost:3001
 * Note: Ensure the backend CORS allows http://localhost:3000 in dev.
 */
const getBaseUrl = () => {
  const envBase = process.env.REACT_APP_API_BASE;
  return envBase && envBase.trim().length > 0 ? envBase : 'http://localhost:3001';
};

const handleResponse = async (res) => {
  if (!res.ok) {
    // Attempt to parse error detail if available
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data && (data.detail || data.message)) {
        message = data.detail || data.message;
      }
    } catch {
      // ignore parse errors
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  // Some endpoints (DELETE 204) have no content
  if (res.status === 204) return null;
  return res.json();
};

// PUBLIC_INTERFACE
export async function fetchNotes(query = '') {
  /** Fetch a list of notes, optionally filtered by query. */
  const base = getBaseUrl();
  const url = new URL('/notes', base);
  if (query && query.trim().length > 0) {
    url.searchParams.set('query', query.trim());
  }
  const res = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Retrieve a single note by id. */
  const base = getBaseUrl();
  const res = await fetch(`${base}/notes/${id}`, { headers: { 'Accept': 'application/json' } });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a new note. */
  const base = getBaseUrl();
  const res = await fetch(`${base}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update an existing note by id. */
  const base = getBaseUrl();
  const res = await fetch(`${base}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  const base = getBaseUrl();
  const res = await fetch(`${base}/notes/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
