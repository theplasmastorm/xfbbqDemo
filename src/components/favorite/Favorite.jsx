import React, { useEffect, useState, useCallback } from "react";
import * as favoriteApi from "../../api/favoriteApi";

export default function Favorite() {
  const [favorites, setFavorites] = useState({ value: [] });

  const getFavorites = useCallback(async () => {
    const response = await favoriteApi.getFavorites();
    setFavorites(response);
  }, []);

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);
  
  return (
    <code>{JSON.stringify(favorites.value)}</code>
  );
}