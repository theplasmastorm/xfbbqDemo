import { handleResponse, handleError } from "./apiUtils";
const baseUrl = "https://localhost:8086/odata/v1/Orders";

export async function getOrders(opts = "") {
  try {
    let response = await fetch(baseUrl + opts);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteOrder(orderID) {
  try {
    let response = await fetch(`${baseUrl}/${orderID}`, { method: "DELETE" });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function saveOrder(order) {
  try {
    let response = await fetch(`${baseUrl}/${order.Id || ""}`, {
      method: order.Id ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(order),
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function saveBatchOrders(orders) {
  try {
    let response = await fetch(`${baseUrl}/PostOrders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(orders),
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}
