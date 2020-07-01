import { handleResponse, handleError } from "./apiUtils";
const baseUrl = "https://localhost:8086/odata/v1/Favorites";

export async function getFavorites(opts = "") {
  try {
    let response = await fetch(baseUrl + opts);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteFavorites(favoriteId) {
  try {
    let response = await fetch(`${baseUrl}/${favoriteId}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function saveFavorites(favorite) {
  try {
    let response = await fetch(`${baseUrl}/${favorite.Id || ""}`, {
      method: favorite.Id ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(favorite),
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteFavoritesByUserID(userID) {
  try {
    let response = await fetch(`${baseUrl}(Userid=${userID})`, {
      method: "DELETE",
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

export async function saveBatchFavorites(favorites) {
  try {
    let response = await fetch(`${baseUrl}/PostFavorites`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(favorites),
    });

    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}
