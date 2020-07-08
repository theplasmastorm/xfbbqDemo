import React, { useEffect, useState, useCallback } from "react";
import * as orderApi from "../../api/orderApi";
import {
  NumToMeat,
  NumToDoneness,
  NumToType,
} from "../../scripts/orderTranslate";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";

import Jumbotron from "react-bootstrap/Jumbotron";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export default function Order() {
  document.title = "𝘹𝘧BBQ - Orders";

  const login = useSelector((state) => state.login);
  const [orders, setOrders] = useState([]);

  const getOrders = useCallback(async () => {
    const response = await orderApi.getOrders(
      `?$expand=REL_Bbq($select=Helddate)${
        login.Type === 3 ? `&$filter=Userid eq ${login.Id}` : ""
      }`
    );
    setOrders(_.sortBy(response.value, ["Bbqid", "Userid", "Id"]));
  }, [login]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // Turn individual orders into an array of orders
  let groupedOrders = orders.map((order) => {
    return {
      ...order,
      theirOrders: [
        {
          ...order,
        },
      ],
    };
  });

  // Combine orders together
  for (let index = groupedOrders.length - 1; index >= 0; index--) {
    const prevIndex = index - 1;
    if (
      prevIndex >= 0 &&
      groupedOrders[index].Bbqid === groupedOrders[prevIndex].Bbqid &&
      groupedOrders[index].Userid === groupedOrders[prevIndex].Userid
    ) {
      groupedOrders[prevIndex].theirOrders = groupedOrders[
        prevIndex
      ].theirOrders.concat(groupedOrders[index].theirOrders);
      groupedOrders.splice(index, 1);
    }
  }

  return (
    <Jumbotron>
      <Link to="/NewOrderForm">
        <Button variant="primary" className="float-right">
          New Order
        </Button>
      </Link>
      <h2>Orders</h2>
      <Table striped className="table-secondary">
        <thead>
          <tr className="table-primary">
            <th>Order ID</th>
            <th>User ID</th>
            <th>BBQ ID</th>
            <th>Order Date</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupedOrders.map((order) => {
            return (
              <tr key={order.Id}>
                <td>{order.Id}</td>
                <td>{order.Userid}</td>
                <td>{order.Bbqid}</td>
                <td>{moment.unix(order.Orderdate).format("MM/DD/YYYY")}</td>
                <td>
                  {order.theirOrders.map((theirOrder) => {
                    return theirOrder.Meat > 0 ? (
                      // Burger
                      <div key={theirOrder.Id}>
                        {"====="}
                        <br />
                        {NumToMeat(theirOrder.Meat)}
                        {theirOrder.Meat === 1 ? (
                          <>
                            <br />
                            {`Doneness: ${NumToDoneness(theirOrder.Doneness)}`}
                          </>
                        ) : (
                          <></>
                        )}
                        <br />
                        {`Cheese slices: ${theirOrder.Cheese}`}
                        <br />
                        {`Spice level: ${theirOrder.Spicy}`}
                        <br />
                      </div>
                    ) : (
                      // Hotdog
                      <div key={theirOrder.Id}>
                        {"====="}
                        <br />
                        {"Hotdog"}
                        <br />
                        {`Type: ${NumToType(theirOrder.Type)}`}
                        <br />
                        {`Number: ${theirOrder.Count}`}
                        <br />
                        {`Burnt: ${theirOrder.Burnt === 1}`}
                        <br />
                      </div>
                    );
                  })}
                </td>
                <td>
                  {moment.unix(order.REL_Bbq.Helddate).isAfter(moment()) ? (
                    <>
                      <Link
                        to={{
                          pathname: "/NewOrderForm",
                          state: order.theirOrders,
                        }}
                      >
                        <Button variant="primary" size="sm">
                          <span role="img" aria-label="delete">
                            📝
                          </span>
                        </Button>
                      </Link>{" "}
                      <Button
                        variant="danger"
                        onClick={() => {
                          order.theirOrders.forEach(async (theirOrder) => {
                            await orderApi.deleteOrder(theirOrder.Id);
                          });
                          getOrders();
                          toast.error("Deleted orders");
                        }}
                      >
                        <span role="img" aria-label="delete">
                          🗑️
                        </span>
                      </Button>
                    </>
                  ) : (
                    <i>No actions available</i>
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
