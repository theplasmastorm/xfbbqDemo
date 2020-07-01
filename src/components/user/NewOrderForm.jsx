import React, { useEffect, useState, useCallback } from "react";
import { Field, Form } from "react-final-form";
import * as orderApi from "../../api/orderApi";
import * as bbqApi from "../../api/bbqApi";
import * as favoriteApi from "../../api/favoriteApi";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { DonenessToNum, NumToDoneness } from "../../scripts/orderTranslate";
import moment from "moment";

export default function NewOrderForm() {
  const login = useSelector((state) => state.login);
  const history = useHistory();
  const [bbqs, setBbqs] = useState({ value: [] });
  const [favorites, setFavorites] = useState({ value: [] });

  const getFavorites = useCallback(() => {
    async function getFavorites() {
      const response = await favoriteApi.getFavorites(`(Userid=${login.Id})`);
      setFavorites(response);
    }
    getFavorites();
  }, [login]);

  useEffect(() => {
    async function getBBQs() {
      const response = await bbqApi.getBBQs();
      setBbqs(response);
    }
    getBBQs();
    getFavorites();
  }, [getFavorites]);

  return (
    <Form
      onSubmit={async (values) => {
        if (values.Action === "Submit") {
          const latestBBQID = bbqs.value[bbqs.value.length - 1].Id;

          let orderArray = [];
          if (values.Hamburger.Enabled) {
            orderArray.push({
              Userid: login.Id,
              Bbqid: latestBBQID,
              Meat: 1,
              Cheese: values.Hamburger.Cheese ? 1 : 0,
              Doneness: DonenessToNum(values.Hamburger.Doneness),
              Spicy: values.Hamburger.Spice ? 1 : 0,
              Orderdate: parseInt(moment().format("X")),
            });
          }
          if (values.TurkeyBurger.Enabled) {
            orderArray.push({
              Userid: login.Id,
              Bbqid: latestBBQID,
              Meat: 2,
              Cheese: values.TurkeyBurger.Cheese ? 1 : 0,
              Spicy: values.TurkeyBurger.Spice ? 1 : 0,
              Orderdate: parseInt(moment().format("X")),
            });
          }
          if (values.VeggieBurger.Enabled) {
            orderArray.push({
              Userid: login.Id,
              Bbqid: latestBBQID,
              Meat: 3,
              Cheese: values.VeggieBurger.Cheese ? 1 : 0,
              Spicy: values.VeggieBurger.Spice ? 1 : 0,
              Orderdate: parseInt(moment().format("X")),
            });
          }
          if (values.Hotdog.Enabled) {
            orderArray.push({
              Userid: login.Id,
              Bbqid: latestBBQID,
              Type: 1,
              Count: values.Hotdog.Count,
              Burnt: values.Hotdog.Burnt ? 1 : 0,
              Orderdate: parseInt(moment().format("X")),
            });
          }
          await orderApi.saveBatchOrders({ Orders: orderArray });
          toast.success("Submitted order");
          history.push("/Order");
        } else {
          await favoriteApi.deleteFavoritesByUserID(login.Id);

          let favoriteArray = [];
          if (values.Hamburger.Enabled) {
            favoriteArray.push({
              Userid: login.Id,
              Meat: 1,
              Cheese: values.Hamburger.Cheese ? 1 : 0,
              Doneness: DonenessToNum(values.Hamburger.Doneness),
              Spicy: values.Hamburger.Spicy ? 1 : 0,
            });
          }
          if (values.TurkeyBurger.Enabled) {
            favoriteArray.push({
              Userid: login.Id,
              Meat: 2,
              Cheese: values.TurkeyBurger.Cheese ? 1 : 0,
              Spicy: values.TurkeyBurger.Spicy ? 1 : 0,
            });
          }
          if (values.VeggieBurger.Enabled) {
            favoriteArray.push({
              Userid: login.Id,
              Meat: 3,
              Cheese: values.VeggieBurger.Cheese ? 1 : 0,
              Spicy: values.VeggieBurger.Spicy ? 1 : 0,
            });
          }
          if (values.Hotdog.Enabled) {
            favoriteArray.push({
              Userid: login.Id,
              Type: 1,
              Count: values.Hotdog.Count,
              Burnt: values.Hotdog.Burnt ? 1 : 0,
            });
          }
          await favoriteApi.saveBatchFavorites({ Favorites: favoriteArray });
          toast.success("Favorites saved");
        }
      }}
      initialValues={() => {
        let Hamburger = {
          Enabled: false,
          Doneness: "Medium Rare",
          Cheese: false,
          Spice: false,
        };
        let TurkeyBurger = { Enabled: false, Cheese: false, Spicy: false };
        let VeggieBurger = { Enabled: false, Cheese: false, Spicy: false };
        let Hotdog = { Enabled: false, Count: "1", Burnt: false };

        if (favorites?.value) {
          favorites.value.forEach((favorite) => {
            switch (favorite.Meat) {
              case 1:
                Hamburger = {
                  Enabled: true,
                  Doneness: NumToDoneness(favorite.Doneness),
                  Cheese: favorite.Cheese === 1,
                  Spicy: favorite.Spicy === 1,
                };
                break;
              case 2:
                TurkeyBurger = {
                  Enabled: true,
                  Cheese: favorite.Cheese === 1,
                  Spicy: favorite.Spicy === 1,
                };
                break;
              case 3:
                VeggieBurger = {
                  Enabled: true,
                  Cheese: favorite.Cheese === 1,
                  Spicy: favorite.Spicy === 1,
                };
                break;
              default:
                break;
            }
            if (favorite.Type >= 1)
              Hotdog = {
                Enabled: true,
                Count: favorite.Count.toString(),
                Burnt: favorite.Burnt === 1,
              };
          });
        }

        return {
          Hamburger,
          TurkeyBurger,
          VeggieBurger,
          Hotdog,
        };
      }}
      render={({ handleSubmit, form, submitting, pristine, values }) =>
        values.Hamburger ? (
          <form onSubmit={handleSubmit}>
            <>
              <label>
                <Field
                  name="Hamburger.Enabled"
                  type="checkbox"
                  component="input"
                />
                Hamburger
              </label>
              <br />
              <label>
                <Field
                  name="Hamburger.Doneness"
                  type="radio"
                  disabled={!values.Hamburger.Enabled}
                  component="input"
                  value="Rare"
                />
                Rare
              </label>
              <label>
                <Field
                  name="Hamburger.Doneness"
                  type="radio"
                  disabled={!values.Hamburger.Enabled}
                  component="input"
                  value="Medium Rare"
                />
                Medium Rare
              </label>
              <label>
                <Field
                  name="Hamburger.Doneness"
                  type="radio"
                  disabled={!values.Hamburger.Enabled}
                  component="input"
                  value="Medium"
                />
                Medium
              </label>
              <label>
                <Field
                  name="Hamburger.Doneness"
                  type="radio"
                  disabled={!values.Hamburger.Enabled}
                  component="input"
                  value="Medium Well"
                />
                Medium Well
              </label>
              <label>
                <Field
                  name="Hamburger.Doneness"
                  type="radio"
                  disabled={!values.Hamburger.Enabled}
                  component="input"
                  value="Well Done"
                />
                Well Done
              </label>
              <br />
              <label>
                <Field
                  name="Hamburger.Cheese"
                  type="checkbox"
                  disabled={!values.Hamburger.Enabled}
                  component="input"
                />
                Cheese
              </label>
              <label>
                <Field
                  name="Hamburger.Spicy"
                  type="checkbox"
                  disabled={!values.Hamburger.Enabled}
                  component="input"
                />
                Spice
              </label>
            </>
            <hr />
            <>
              <label>
                <Field
                  name="TurkeyBurger.Enabled"
                  type="checkbox"
                  component="input"
                />
                Turkey Burger
              </label>
              <br />
              <label>
                <Field
                  name="TurkeyBurger.Cheese"
                  type="checkbox"
                  disabled={!values.TurkeyBurger.Enabled}
                  component="input"
                />
                Cheese
              </label>
              <label>
                <Field
                  name="TurkeyBurger.Spicy"
                  type="checkbox"
                  disabled={!values.TurkeyBurger.Enabled}
                  component="input"
                />
                Spice
              </label>
            </>
            <hr />
            <>
              <label>
                <Field
                  name="VeggieBurger.Enabled"
                  type="checkbox"
                  component="input"
                />
                Veggie Burger
              </label>
              <br />
              <label>
                <Field
                  name="VeggieBurger.Cheese"
                  type="checkbox"
                  disabled={!values.VeggieBurger.Enabled}
                  component="input"
                />
                Cheese
              </label>
              <label>
                <Field
                  name="VeggieBurger.Spicy"
                  type="checkbox"
                  disabled={!values.VeggieBurger.Enabled}
                  component="input"
                />
                Spice
              </label>
            </>
            <hr />
            <>
              <label>
                <Field
                  name="Hotdog.Enabled"
                  type="checkbox"
                  component="input"
                />
                Hotdog
              </label>
              <br />
              <label>
                <Field
                  name="Hotdog.Count"
                  type="radio"
                  disabled={!values.Hotdog.Enabled}
                  component="input"
                  value="1"
                />
                1
              </label>
              <label>
                <Field
                  name="Hotdog.Count"
                  type="radio"
                  disabled={!values.Hotdog.Enabled}
                  component="input"
                  value="2"
                />
                2
              </label>
              <br />
              <label>
                <Field
                  name="Hotdog.Burnt"
                  type="checkbox"
                  disabled={!values.Hotdog.Enabled}
                  component="input"
                />
                Burnt
              </label>
            </>
            <hr />
            <button
              type="submit"
              disabled={
                (!values.Hamburger.Enabled &&
                  !values.TurkeyBurger.Enabled &&
                  !values.VeggieBurger.Enabled &&
                  !values.Hotdog.Enabled) ||
                submitting
              }
              onClick={() => {
                form.change("Action", "Submit");
              }}
            >
              Submit Order
            </button>{" "}
            <button
              type="button"
              disabled={
                (!values.Hamburger.Enabled &&
                  !values.TurkeyBurger.Enabled &&
                  !values.VeggieBurger.Enabled &&
                  !values.Hotdog.Enabled) ||
                submitting
              }
              onClick={form.reset}
            >
              Reset Form
            </button>{" "}
            <button
              type="submit"
              disabled={
                (!values.Hamburger.Enabled &&
                  !values.TurkeyBurger.Enabled &&
                  !values.VeggieBurger.Enabled &&
                  !values.Hotdog.Enabled) ||
                submitting
              }
              onClick={() => {
                form.change("Action", "Favorite");
              }}
            >
              ♥
            </button>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        ) : (
          <></>
        )
      }
    />
  );
}
