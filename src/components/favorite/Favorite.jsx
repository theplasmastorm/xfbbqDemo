import React, { useEffect, useState, useCallback } from "react";
import * as favoriteApi from "../../api/favoriteApi";
import {
  NumToMeat,
  NumToDoneness,
  NumToType,
} from "../../scripts/orderTranslate";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Jumbotron from "react-bootstrap/Jumbotron";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export default function Favorite() {
  document.title = "𝘹𝘧BBQ - Favorites";

  const login = useSelector((state) => state.login);
  const [favorites, setFavorites] = useState({ value: [] });

  const getFavorites = useCallback(() => {
    async function getFavorites() {
      const response = await favoriteApi.getFavorites(`(Userid=${login.Id})`);
      setFavorites(response);
    }
    getFavorites();
  }, [login]);

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  return (
    <Jumbotron>
      <Button
        variant="danger"
        className="float-right"
        onClick={async () => {
          await favoriteApi.deleteFavoritesByUserID(login.Id);
          getFavorites();
          toast.error("Deleted favorites");
        }}
      >
        <span role="img" aria-label="delete">
          🗑️
        </span>
      </Button>
      <h2>Favorites</h2>
      <Table striped className="table-secondary">
        <thead>
          <tr className="table-primary">
            <th>Favorite ID</th>
            <th>User</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          {favorites.value.map((favorite) => {
            return (
              <tr key={favorite.Id}>
                <td>{favorite.Id}</td>
                <td>{favorite.Userid}</td>
                <td>
                  {favorite.Meat > 0 ? (
                    // Burger
                    <div>
                      {NumToMeat(favorite.Meat)}
                      {favorite.Meat === 1 ? (
                        <>
                          <br />
                          {`Doneness: ${NumToDoneness(favorite.Doneness)}`}
                        </>
                      ) : (
                        <></>
                      )}
                      <br />
                      {`Cheese slices: ${favorite.Cheese}`}
                      <br />
                      {`Spice level: ${favorite.Spicy}`}
                      <br />
                    </div>
                  ) : (
                    // Hotdog
                    <div>
                      {"Hotdog"}
                      <br />
                      {`Type: ${NumToType(favorite.Type)}`}
                      <br />
                      {`Number: ${favorite.Count}`}
                      <br />
                      {`Burnt: ${favorite.Burnt === 1}`}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Jumbotron>
  );
}
