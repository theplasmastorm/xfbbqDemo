import { handleResponse, handleError } from "./apiUtils";
const baseUrl = "https://localhost:8086/odata/v1/Bbqs/";

export async function getBBQs() {
  try {
    let response = await fetch(baseUrl);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}