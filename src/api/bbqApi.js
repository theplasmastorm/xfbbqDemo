import { handleResponse, handleError } from "./apiUtils";
import * as tokenApi from "./tokenApi";
const baseUrl = "https://localhost:8086/odata/v1/Bbqs/";

export async function getBBQs() {
  try {
    let response = await fetch(baseUrl, {
      headers: { authorization: `Bearer ${tokenApi.authToken}` },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteBBQ(bbqID) {
  try {
    let response = await fetch(`${baseUrl}/${bbqID}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${tokenApi.authToken}` },
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function saveBBQ(bbq) {
  try {
    let response = await fetch(`${baseUrl}/${bbq.Id || ""}`, {
      method: bbq.Id ? "PUT" : "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${tokenApi.authToken}`,
      },
      body: JSON.stringify(bbq),
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}
