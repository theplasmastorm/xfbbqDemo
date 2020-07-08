import React, { useState, useEffect, useCallback } from "react";
import "./orders.css";
import { Form } from "react-final-form";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import * as favoriteApi from "../../api/favoriteApi";
import * as orderApi from "../../api/orderApi";
import * as bbqApi from "../../api/bbqApi";

let counter = 0;
export default function NewOrderForm({ ...props }) {
  document.title = "𝘹𝘧BBQ - Place an Order";

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

  const ordersToEdit = props.location.state;
  const [orderCardArray, setOrderCardArray] = useState(
    ordersToEdit
      ? ordersToEdit.map((order) => {
          if (order.Meat === 0) {
            return {
              key: Math.random() * 1000000000000000000,
              id: 1,
              foodFlavor: "",
              foodCategory: "Hotdog",
              foodAttributes: {
                burnt: order.Burnt ? true : false,
                quantity: order.Count,
              },
              orderID: order.Id,
              userID: order.Userid,
            };
          } else {
            return {
              key: Math.random() * 1000000000000000000,
              foodFlavor:
                order.Meat === 1
                  ? "Beef"
                  : order.Meat === 2
                  ? "Turkey"
                  : "Veggie",
              foodCategory: "Burger",
              foodAttributes: {
                cheese: order.Cheese >= 1 ? true : false,
                spice: order.Spicy >= 1 ? true : false,
                doneness:
                  order.Doneness === undefined
                    ? ""
                    : numberToDoneness(order.Doneness),
              },
              orderID: order.Id,
              userID: order.Userid,
            };
          }
        })
      : []
  );
  useEffect(() => {
    if (favorites.value && !ordersToEdit) {
      setOrderCardArray(
        favorites.value.map((favorite) => {
          if (favorite.Meat === 0) {
            return {
              key: Math.random() * 1000000000000000000,
              id: 1,
              foodFlavor: "",
              foodCategory: "Hotdog",
              foodAttributes: {
                burnt: favorite.Burnt ? true : false,
                quantity: favorite.Count,
              },
              userID: favorite.Userid,
              favoriteID: favorite.Id,
            };
          } else {
            return {
              key: Math.random() * 1000000000000000000,
              foodFlavor:
                favorite.Meat === 1
                  ? "Beef"
                  : favorite.Meat === 2
                  ? "Turkey"
                  : "Veggie",
              foodCategory: "Burger",
              foodAttributes: {
                cheese: favorite.Cheese >= 1 ? true : false,
                spice: favorite.Spicy >= 1 ? true : false,
                doneness:
                  favorite.Doneness === undefined
                    ? ""
                    : numberToDoneness(favorite.Doneness),
              },
              userID: favorite.Userid,
              favoriteID: favorite.Id,
            };
          }
        })
      );
    }
  }, [favorites, ordersToEdit]);

  function beefDoneness(doneness) {
    switch (doneness) {
      case "Rare":
        return 1;
      case "MedRare":
        return 2;
      case "Med":
        return 3;
      case "MedWell":
        return 4;
      case "Well":
        return 5;
      default:
        return 6;
    }
  }
  function numberToDoneness(number) {
    switch (number) {
      case 1:
        return "Rare";
      case 2:
        return "MedRare";
      case 3:
        return "Med";
      case 4:
        return "MedWell";
      case 5:
        return "Well";
      default:
        return "";
    }
  }

  function drawCard(myArray, item) {
    //See if it is a burger or something else and call accordingly
    let cardData;
    let duplicateButton = "";
    switch (item.foodCategory) {
      case "Burger":
        cardData = addBurger(item);
        duplicateButton = (
          <button
            type="button"
            className="close pr-2 pl-2"
            title="Add a copy of this order"
            id={item.foodItem + item.foodValue + "DuplicateOrderButton"}
            onClick={() => {
              duplicateCard(myArray, item);
            }}
          >
            <img src={require("./images/icon-duplicateBurger.png")} alt="D" />
          </button>
        );
        break;
      case "Hotdog":
        cardData = addHotDog(item);
        break;
      default:
        alert("making an undefined food item in drawCard()");
        break;
    }

    return (
      <div
        className={
          "card bg-secondary mt-2 mb-2 pt-2 pb-2" +
          (item.delete === undefined ? "" : " d-none")
        }
        id={item.foodFlavor + item.id}
        key={item.key}
      >
        <div className="row">
          <div className="col">
            <h4 className="pl-2">
              {item.foodFlavor + " " + item.foodCategory}
            </h4>
          </div>
          <div className="col-2">
            <button
              type="button"
              className="close pr-2 pl-2"
              aria-label="Close"
              title="Remove from your order"
              onClick={() => {
                removeFood(myArray, item);
              }}
            >
              <img src={require("./images/icon-removeBurger.png")} alt="R" />
            </button>
            {duplicateButton}
          </div>
        </div>
        {cardData}
      </div>
    );
  }

  function duplicateCard(myArray, item) {
    counter++;
    var idCounter = 1;
    for (var i = 0; i < myArray.length; ++i) {
      if (
        myArray[i].foodFlavor + myArray[i].foodCategory ===
        item.foodFlavor + item.foodCategory
      )
        idCounter++;
    }
    myArray.splice(
      myArray
        .map(function (e) {
          return e.key;
        })
        .indexOf(item.key),
      0,
      {
        key: counter,
        id: idCounter,
        foodFlavor: item.foodFlavor,
        foodCategory: item.foodCategory,
        foodAttributes: { ...item.foodAttributes },
      }
    );
    setOrderCardArray([...myArray]);
  }

  function addFood(myArray, foodFlavor, foodCategory) {
    //More or less, this should probably be a helper function to call duplicate Card or something like that.
    counter++;
    let foodAttributes;
    if (foodCategory === "Burger") {
      foodAttributes = { cheese: false, spice: false };
      if (foodFlavor === "Beef") foodAttributes.doneness = "Med";
    }
    if (foodCategory === "Hotdog") {
      foodAttributes = { burnt: false, quantity: 1 };
    }

    var idCounter = 1;
    for (var i = 0; i < myArray.length; ++i) {
      if (
        myArray[i].foodFlavor + myArray[i].foodCategory ===
        foodFlavor + foodCategory
      )
        idCounter++;
    }

    setOrderCardArray([
      {
        key: counter,
        id: idCounter,
        foodFlavor: foodFlavor,
        foodCategory: foodCategory,
        foodAttributes: foodAttributes,
      },
      ...myArray,
    ]);
  }

  function removeFood(myArray, item) {
    for (let index = 0; index < myArray.length; index++) {
      if (
        myArray[index].foodFlavor + myArray[index].foodCategory ===
          item.foodFlavor + item.foodCategory &&
        myArray[index].id > item.id
      )
        myArray[index].id--;
    }

    const arrayIndex = myArray.findIndex((k) => k.key === item.key);
    if (myArray[arrayIndex].orderID === undefined)
      myArray.splice(arrayIndex, 1);
    else myArray[arrayIndex].delete = true;

    setOrderCardArray([...myArray]);
  }

  function addHotDog(item) {
    return (
      <>
        <div className="col-12">
          How would you like your Hotdog?
          <div
            className="btn-group btn-vertical btn-group-toggle pt-2 pb-2"
            data-toggle="buttons"
          >
            <div
              className={
                item.foodAttributes.burnt === false
                  ? "btn btn-primary"
                  : "btn btn-dark"
              }
              onClick={() => {
                item.foodAttributes.burnt = false;
                orderCardArray[
                  orderCardArray.findIndex((k) => k.key === item.key)
                ].foodAttributes.burnt = item.foodAttributes.burnt;
                setOrderCardArray([...orderCardArray]);
              }}
            >
              Normal
            </div>
            <div
              className={
                item.foodAttributes.burnt === true
                  ? "btn btn-primary"
                  : "btn btn-dark"
              }
              onClick={() => {
                item.foodAttributes.burnt = true;
                orderCardArray[
                  orderCardArray.findIndex((k) => k.key === item.key)
                ].foodAttributes.burnt = item.foodAttributes.burnt;
                setOrderCardArray([...orderCardArray]);
              }}
            >
              Burnt
            </div>
          </div>
          How many would you like?
          <div
            className="btn-group btn-vertical btn-group-toggle pt-2 pb-2"
            data-toggle="buttons"
          >
            <div
              className={
                item.foodAttributes.quantity === 1
                  ? "btn btn-primary"
                  : "btn btn-dark"
              }
              onClick={() => {
                item.foodAttributes.quantity = 1;
                orderCardArray[
                  orderCardArray.findIndex((k) => k.key === item.key)
                ].foodAttributes.quantity = item.foodAttributes.quantity;
                setOrderCardArray([...orderCardArray]);
              }}
            >
              1
            </div>
            <div
              className={
                item.foodAttributes.quantity === 2
                  ? "btn btn-primary"
                  : "btn btn-dark"
              }
              onClick={() => {
                item.foodAttributes.quantity = 2;
                orderCardArray[
                  orderCardArray.findIndex((k) => k.key === item.key)
                ].foodAttributes.quantity = item.foodAttributes.quantity;
                setOrderCardArray([...orderCardArray]);
              }}
            >
              2
            </div>
          </div>
        </div>
      </>
    );
  }

  function addBurger(item) {
    let donenessQuestion = "";
    if (item.foodFlavor === "Beef") {
      donenessQuestion = (
        <>
          How would you like your burger cooked?
          <div className="row pt-3 pb-3">
            <div
              className="btn-group btn-vertical btn-group-toggle col-12"
              data-toggle="buttons"
            >
              <div
                className={
                  item.foodAttributes.doneness === "Rare"
                    ? "btn btn-primary"
                    : "btn btn-dark"
                }
                onClick={() => {
                  item.foodAttributes.doneness = "Rare";
                  orderCardArray[
                    orderCardArray.findIndex((k) => k.key === item.key)
                  ].foodAttributes.doneness = item.foodAttributes.doneness;
                  setOrderCardArray([...orderCardArray]);
                }}
              >
                Rare
              </div>
              <div
                className={
                  item.foodAttributes.doneness === "MedRare"
                    ? "btn btn-primary"
                    : "btn btn-dark"
                }
                onClick={() => {
                  item.foodAttributes.doneness = "MedRare";
                  orderCardArray[
                    orderCardArray.findIndex((k) => k.key === item.key)
                  ].foodAttributes.doneness = item.foodAttributes.doneness;
                  setOrderCardArray([...orderCardArray]);
                }}
              >
                Medium Rare
              </div>
              <div
                className={
                  item.foodAttributes.doneness === "Med"
                    ? "btn btn-primary"
                    : "btn btn-dark"
                }
                onClick={() => {
                  item.foodAttributes.doneness = "Med";
                  orderCardArray[
                    orderCardArray.findIndex((k) => k.key === item.key)
                  ].foodAttributes.doneness = item.foodAttributes.doneness;
                  setOrderCardArray([...orderCardArray]);
                }}
              >
                Medium
              </div>
              <div
                className={
                  item.foodAttributes.doneness === "MedWell"
                    ? "btn btn-primary"
                    : "btn btn-dark"
                }
                onClick={() => {
                  item.foodAttributes.doneness = "MedWell";
                  orderCardArray[
                    orderCardArray.findIndex((k) => k.key === item.key)
                  ].foodAttributes.doneness = item.foodAttributes.doneness;
                  setOrderCardArray([...orderCardArray]);
                }}
              >
                Medium Well
              </div>
              <div
                className={
                  item.foodAttributes.doneness === "Well"
                    ? "btn btn-primary"
                    : "btn btn-dark"
                }
                onClick={() => {
                  item.foodAttributes.doneness = "Well";
                  orderCardArray[
                    orderCardArray.findIndex((k) => k.key === item.key)
                  ].foodAttributes.doneness = item.foodAttributes.doneness;
                  setOrderCardArray([...orderCardArray]);
                }}
              >
                Well Done
              </div>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="col-12">
          What would you like added to your burger?
          <div className="row pt-3 pb-3">
            <div className="yellowtoggleButton checkboxButton col-sm-6 col-12">
              <input
                className=""
                type="checkbox"
                onClick={() => {
                  item.foodAttributes.cheese = !item.foodAttributes.cheese;
                  orderCardArray[
                    orderCardArray.findIndex((k) => k.key === item.key)
                  ].foodAttributes.cheese = item.foodAttributes.cheese;
                  setOrderCardArray([...orderCardArray]);
                }}
                id={item.foodFlavor + item.id + "Cheese"}
                value="Cheese"
                defaultChecked={item.foodAttributes.cheese}
              />
              <label
                className="form-check-label btn btn-block btn-dark btn-lg"
                htmlFor={item.foodFlavor + item.id + "Cheese"}
              >
                Cheese
              </label>
            </div>
            <div className="redToggleButton checkboxButton col-sm-6 col-12">
              <input
                className=""
                type="checkbox"
                onClick={() => {
                  item.foodAttributes.spice = !item.foodAttributes.spice;
                  orderCardArray[
                    orderCardArray.findIndex((k) => k.key === item.key)
                  ].foodAttributes.spice = item.foodAttributes.spice;
                  setOrderCardArray([...orderCardArray]);
                }}
                id={item.foodFlavor + item.id + "Spice"}
                value="Spice"
                defaultChecked={item.foodAttributes.spice}
              />
              <label
                className="form-check-label btn btn btn-block btn-dark btn-lg"
                htmlFor={item.foodFlavor + item.id + "Spice"}
              >
                Spice
              </label>
            </div>
          </div>
          {donenessQuestion}
        </div>
      </>
    );
  }

  async function onSubmit() {
    let orders = [];
    const orderDate = parseInt(moment().format("X"));
    const userID =
      ordersToEdit === null || ordersToEdit === undefined
        ? login.Id
        : ordersToEdit[0].Userid;
    const bbqID =
      bbqs.value.length === 0 ? 0 : bbqs.value[bbqs.value.length - 1].Id;

    if (
      window.confirm(
        "Make sure your order is correct before submitting.\r\nIs this what you want to order?\r\n" +
          orderCardArray
            .map((item) => {
              if (item.foodCategory === "Burger") {
                switch (item.foodFlavor) {
                  case "Beef":
                    orders.push({
                      orderDate,
                      userID,
                      bbqID,
                      meat: 1,
                      doneness: beefDoneness(item.foodAttributes.doneness),
                      cheese: item.foodAttributes.cheese ? 1 : 0,
                      spicy: item.foodAttributes.spice ? 1 : 0,
                      id: item.orderID,
                      delete: item.delete ? true : "",
                    });

                    return (
                      "\r\n• " +
                      (item.delete ? "REMOVE " : "") +
                      "Beef Burger:\r\n  - Cheese: " +
                      (item.foodAttributes.cheese ? "Yes" : "No") +
                      "\r\n  - Spice: " +
                      (item.foodAttributes.spice ? "Yes" : "No") +
                      "\r\n  - Doneness: " +
                      item.foodAttributes.doneness
                    );
                  case "Turkey":
                    orders.push({
                      orderDate,
                      userID,
                      bbqID,
                      meat: 2,
                      cheese: item.foodAttributes.cheese ? 1 : 0,
                      spicy: item.foodAttributes.spice ? 1 : 0,
                      id: item.orderID,
                      delete: item.delete ? true : "",
                    });

                    return (
                      "\r\n• " +
                      (item.delete ? "REMOVE " : "") +
                      "Turkey Burger:\r\n  - Cheese: " +
                      (item.foodAttributes.cheese ? "Yes" : "No") +
                      "\r\n  - Spice: " +
                      (item.foodAttributes.spice ? "Yes" : "No")
                    );
                  case "Veggie":
                    orders.push({
                      orderDate,
                      userID,
                      bbqID,
                      meat: 3,
                      cheese: item.foodAttributes.cheese ? 1 : 0,
                      spicy: item.foodAttributes.spice ? 1 : 0,
                      id: item.orderID,
                      delete: item.delete ? true : "",
                    });

                    return (
                      "\r\n• " +
                      (item.delete ? "REMOVE " : "") +
                      "Veggie Burger:\r\n  - Cheese: " +
                      (item.foodAttributes.cheese ? "Yes" : "No") +
                      "\r\n  - Spice: " +
                      (item.foodAttributes.spice ? "Yes" : "No")
                    );
                  default:
                    return "";
                }
              } else {
                orders.push({
                  orderDate,
                  userID,
                  bbqID,
                  type: 1,
                  count: item.foodAttributes.quantity,
                  burnt: item.foodAttributes.burnt ? 1 : 0,
                  id: item.orderID,
                  delete: item.delete ? true : "",
                });

                return (
                  "\r\n• " +
                  (item.delete ? "REMOVE " : "") +
                  "Hotdogs:\r\n  - Burnt: " +
                  (item.foodAttributes.burnt ? "Yes" : "No") +
                  "\r\n  - Amount: " +
                  item.foodAttributes.quantity
                );
              }
            })
            .join("")
      )
    ) {
      toast.info(
        (ordersToEdit ? "Editing " : "Creating ") +
          "order" +
          (orders.length > 1 ? "s" : "") +
          " ..."
      );
      let orderArray = [];
      orders.forEach((order) => {
        if (order.delete) orderApi.deleteOrder(order.id);
        else
          orderArray.push({
            Meat: order.meat ? order.meat : 0,
            Cheese: order.cheese ? order.cheese : 0,
            Doneness: order.doneness ? order.doneness : 0,
            Spicy: order.spicy ? order.spicy : 0,
            Type: order.type ? order.type : 0,
            Count: order.count ? order.count : 0,
            Burnt: order.burnt ? order.burnt : 0,
            Orderdate: order.orderDate,
            Userid: order.userID,
            Bbqid: order.bbqID,
            Id: order.id,
          });
      });
      orderApi.saveBatchOrders({ Orders: orderArray });
      history.push("/Order");
    }
  }

  return (
    <div className="jumbotron">
      <h2>Place an Order</h2>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <button
                  className="btn"
                  id="addBeefButton"
                  onClick={() => addFood(orderCardArray, "Beef", "Burger")}
                  type="button"
                >
                  Beef Burger
                </button>
                <button
                  className="btn"
                  id="addTurkeyButton"
                  onClick={() => addFood(orderCardArray, "Turkey", "Burger")}
                  type="button"
                >
                  Turkey Burger
                </button>
                <button
                  className="btn"
                  id="addVeggieButton"
                  onClick={() => addFood(orderCardArray, "Veggie", "Burger")}
                  type="button"
                >
                  Veggie Burger
                </button>
                <div className="dropdown-divider" />
                <button
                  className="btn"
                  id="addHotdogButton"
                  onClick={() => addFood(orderCardArray, "", "Hotdog")}
                  type="button"
                >
                  Hotdog
                </button>
              </div>
              <div className="col-6 text-right">
                <button
                  type="button"
                  disabled={orderCardArray.length === 0}
                  title="Save favorite"
                  className="btn btn-lg btn-danger"
                  onClick={() => {
                    let favorites = [];
                    const userID =
                      ordersToEdit === null || ordersToEdit === undefined
                        ? login.Id
                        : ordersToEdit[0].Userid;

                    if (
                      window.confirm(
                        "Are you sure you want to save this order as your favorite?\r\n" +
                          orderCardArray
                            .map((item) => {
                              if (item.foodCategory === "Burger") {
                                switch (item.foodFlavor) {
                                  case "Beef":
                                    favorites.push({
                                      userID,
                                      meat: 1,
                                      doneness: beefDoneness(
                                        item.foodAttributes.doneness
                                      ),
                                      cheese: item.foodAttributes.cheese
                                        ? 1
                                        : 0,
                                      spicy: item.foodAttributes.spice ? 1 : 0,
                                      id: item.favoriteID,
                                      delete: item.delete ? true : "",
                                    });

                                    return (
                                      "\r\n• " +
                                      (item.delete ? "REMOVE " : "") +
                                      "Beef Burger:\r\n  - Cheese: " +
                                      (item.foodAttributes.cheese
                                        ? "Yes"
                                        : "No") +
                                      "\r\n  - Spice: " +
                                      (item.foodAttributes.spice
                                        ? "Yes"
                                        : "No") +
                                      "\r\n  - Doneness: " +
                                      item.foodAttributes.doneness
                                    );
                                  case "Turkey":
                                    favorites.push({
                                      userID,
                                      meat: 2,
                                      cheese: item.foodAttributes.cheese
                                        ? 1
                                        : 0,
                                      spicy: item.foodAttributes.spice ? 1 : 0,
                                      id: item.favoriteID,
                                      delete: item.delete ? true : "",
                                    });

                                    return (
                                      "\r\n• " +
                                      (item.delete ? "REMOVE " : "") +
                                      "Turkey Burger:\r\n  - Cheese: " +
                                      (item.foodAttributes.cheese
                                        ? "Yes"
                                        : "No") +
                                      "\r\n  - Spice: " +
                                      (item.foodAttributes.spice ? "Yes" : "No")
                                    );
                                  case "Veggie":
                                    favorites.push({
                                      userID,
                                      meat: 3,
                                      cheese: item.foodAttributes.cheese
                                        ? 1
                                        : 0,
                                      spicy: item.foodAttributes.spice ? 1 : 0,
                                      id: item.favoriteID,
                                      delete: item.delete ? true : "",
                                    });

                                    return (
                                      "\r\n• " +
                                      (item.delete ? "REMOVE " : "") +
                                      "Veggie Burger:\r\n  - Cheese: " +
                                      (item.foodAttributes.cheese
                                        ? "Yes"
                                        : "No") +
                                      "\r\n  - Spice: " +
                                      (item.foodAttributes.spice ? "Yes" : "No")
                                    );
                                  default:
                                    return "";
                                }
                              } else {
                                favorites.push({
                                  userID,
                                  type: 1,
                                  count: item.foodAttributes.quantity,
                                  burnt: item.foodAttributes.burnt ? 1 : 0,
                                  id: item.favoriteID,
                                  delete: item.delete ? true : "",
                                });

                                return (
                                  "\r\n• " +
                                  (item.delete ? "REMOVE " : "") +
                                  "Hotdogs:\r\n  - Burnt: " +
                                  (item.foodAttributes.burnt ? "Yes" : "No") +
                                  "\r\n  - Amount: " +
                                  item.foodAttributes.quantity
                                );
                              }
                            })
                            .join("")
                      )
                    ) {
                      toast.info(
                        (ordersToEdit ? "Editing " : "Creating ") +
                          "favorite" +
                          (favorites.length > 1 ? "s" : "") +
                          " ..."
                      );
                      let favoritesArray = [];
                      favorites.forEach((favorite) => {
                        if (favorite.delete)
                          favoriteApi.deleteFavorites(favorite.id);
                        else
                          favoritesArray.push({
                            Meat: favorite.meat ? favorite.meat : 0,
                            Cheese: favorite.cheese ? favorite.cheese : 0,
                            Doneness: favorite.doneness ? favorite.doneness : 0,
                            Spicy: favorite.spicy ? favorite.spicy : 0,
                            Type: favorite.type ? favorite.type : 0,
                            Count: favorite.count ? favorite.count : 0,
                            Burnt: favorite.burnt ? favorite.burnt : 0,
                            Userid: favorite.userID,
                            Id: favorite.id,
                          });
                      });

                      favoriteApi.deleteFavoritesByUserID(userID).then(
                        favoriteApi.saveBatchFavorites({
                          Favorites: favoritesArray,
                        })
                      );
                    }
                  }}
                >
                  <span role="img" aria-label="favorite">
                    💖
                  </span>
                </button>{" "}
                <button
                  className={
                    orderCardArray.length === 0
                      ? "btn btn-lg btn-secondary"
                      : "btn btn-lg btn-success"
                  }
                  disabled={orderCardArray.length === 0}
                  type="submit"
                  id="submitOrderButton"
                >
                  Submit Order
                </button>
              </div>
            </div>
          </form>
        )}
      />
      {orderCardArray.map((item) => (
        <div key={item.key}>
          {drawCard(orderCardArray, item)}
          <p />
        </div>
      ))}
    </div>
  );
}

NewOrderForm.propTypes = {
  location: PropTypes.object.isRequired,
};
