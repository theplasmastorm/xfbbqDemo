import { handleResponse, handleError } from "./apiUtils";
const baseUrl = "https://localhost:8086/odata/v1/Users";

export async function getUsers() {
  try {
    let response = await fetch(baseUrl);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function getUserByName(username) {
  try {
    let response = await fetch(`${baseUrl}?$filter=Name eq '${username}'`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteUser(userId) {
  try {
    let response = await fetch(`${baseUrl}/${userId}`, { method: "DELETE" });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function saveUser(user, captchaValue) {
  try {
    let response = await fetch(`${baseUrl}/${user.Id || ""}`, {
      method: user.Id ? "PUT" : "POST",
      headers: {
        "content-type": "application/json",
        "x-response": captchaValue,
      },
      body: JSON.stringify(user),
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
}
