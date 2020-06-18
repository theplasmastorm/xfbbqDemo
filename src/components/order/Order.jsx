import React, { useEffect, useState, useCallback } from "react";
import * as orderApi from "../../api/orderApi";

export default function Order() {
  const [orders, setOrders] = useState({ value: [] });

  const getOrders = useCallback(async () => {
    const response = await orderApi.getOrders();
    setOrders(response);
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);
  
  return (
    <code>{JSON.stringify(orders.value)}</code>
  );
}