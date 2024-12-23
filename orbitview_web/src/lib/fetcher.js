export async function fetcher(url, options = {}) {
  const baseURL = "http://localhost:8000/api"; // Replace with your backend URL
  const response = await fetch(`${baseURL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`An error occurred: ${response.statusText}`);
  }

  return response.json();
}
