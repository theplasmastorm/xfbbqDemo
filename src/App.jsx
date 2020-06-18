import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";

import Header from "./Header";

import HomePage from "./components/home/HomePage";
import BBQ from "./components/bbq/BBQ"
import Favorite from "./components/favorite/Favorite";
import Order from "./components/order/Order";
import User from "./components/user/User";

import PageNotFound from "./PageNotFound";

export default function App() {
  return (
    <>
      <Header />
      <br />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/BBQ" component={BBQ} />
        <Route path="/Favorite" component={Favorite} />
        <Route path="/Order" component={Order} />
        <Route path="/User" component={User} />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
}