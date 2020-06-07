import React, { useContext, Suspense } from "react";
import { Router, Redirect } from "@reach/router";
import "./styles/GlobalStyles.scss";
import { Context } from "./Context";
import { NotFound } from "./pages/NotFound";
import { NotRegister } from "./pages/NotRegister";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { NavBar } from "./components/NavBar";
import { RouteDetail } from "./pages/RouteDetail";

const App = () => {
  const { isAuth } = useContext(Context);

  return (
    <Suspense fallback={<div />}>
      <NavBar />
      <Router>
        <NotFound default />
        <NotRegister path="/not-register" />
        <Login path="/auth" />
        {!isAuth && <Redirect noThrow from="/" to="/not-register" />}
        {!isAuth && <NotRegister default path="/not-register" />}
        <Home path="/inicio" />
        <RouteDetail path="/route-details" />
      </Router>
    </Suspense>
  );
};

export default App;
