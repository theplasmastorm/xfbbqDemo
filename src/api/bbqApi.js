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

export async function deleteBBQ(bbqID) {
  try {
    let response = await fetch(`${baseUrl}/${bbqID}`, { method: "DELETE" });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function saveBBQ(bbq) {
  try {
    let response = await fetch(`${baseUrl}/${bbq.Id || ""}`, {
      method: bbq.Id ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(bbq),
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}
