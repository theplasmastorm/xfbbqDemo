import { handleError } from "./apiUtils";
const baseUrl = "https://localhost:8086/Authentication/GetToken";

export let authToken;
export function setToken(token) {
  authToken = token;
}

export async function getToken(username, password) {
  try {
    let response = await fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ Username: username, Password: password }),
    });
    // Return 401 as a failure (Unauthorized)
    return response.status === 401 ? "" : await response.text();
  } catch (error) {
    return handleError(error);
  }
}
