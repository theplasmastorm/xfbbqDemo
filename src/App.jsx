import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header";

import HomePage from "./components/home/HomePage";
import BBQ from "./components/bbq/BBQ";
import Favorite from "./components/favorite/Favorite";
import Order from "./components/order/Order";
import User from "./components/user/User";
import UserRegistrationForm from "./components/user/UserRegistrationForm";
import UserLogin from "./components/user/UserLogin";
import UserLogout from "./components/user/UserLogout";

import PageNotFound from "./PageNotFound";
import NewOrderForm from "./components/order/NewOrderForm";
import NewBBQForm from "./components/bbq/NewBBQForm";

import "bootswatch/dist/darkly/bootstrap.min.css";
import Container from "react-bootstrap/Container";

export default function App() {
  const login = useSelector((state) => state.login);

  return (
    <Container>
      <Header />
      <br />
      {login.Type <= 1 ? (
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/BBQ" component={BBQ} />
          <Route path="/NewBBQForm" component={NewBBQForm} />
          <Route path="/Favorite" component={Favorite} />
          <Route path="/Order" component={Order} />
          <Route path="/NewOrderForm" component={NewOrderForm} />
          <Route path="/User" component={User} />
          <Route
            path="/UserRegistrationForm"
            component={UserRegistrationForm}
          />
          <Route path="/UserLogout" component={UserLogout} />
          <Route component={PageNotFound} />
        </Switch>
      ) : login.Type <= 2 ? (
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/BBQ" component={BBQ} />
          <Route path="/NewBBQForm" component={NewBBQForm} />
          <Route path="/Favorite" component={Favorite} />
          <Route path="/Order" component={Order} />
          <Route path="/NewOrderForm" component={NewOrderForm} />
          <Route
            path="/UserRegistrationForm"
            component={UserRegistrationForm}
          />
          <Route path="/UserLogout" component={UserLogout} />
          <Route component={PageNotFound} />
        </Switch>
      ) : login.Type <= 3 ? (
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/Favorite" component={Favorite} />
          <Route path="/Order" component={Order} />
          <Route path="/NewOrderForm" component={NewOrderForm} />
          <Route
            path="/UserRegistrationForm"
            component={UserRegistrationForm}
          />
          <Route path="/UserLogout" component={UserLogout} />
          <Route component={PageNotFound} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            path="/UserRegistrationForm"
            component={UserRegistrationForm}
          />
          <Route path="/UserLogin" component={UserLogin} />
          <Route component={PageNotFound} />
        </Switch>
      )}
      <ToastContainer hideProgressBar />
    </Container>
  );
}
