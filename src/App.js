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
import { Products } from "./pages/Products";
import { Clients } from "./pages/Clients";
import { Configuraciones } from "./pages/Configuraciones";
import Logout from "./pages/Logout";

const App = () => {
  const { isAuth } = useContext(Context);

  return (
    <Suspense fallback={<div />}>
      {isAuth && <NavBar />}
      <Router>
        <NotFound path="404" />
        <NotRegister path="/no-registrado" />
        <Login path="/auth" />

        {!isAuth && <Redirect noThrow from="/" to="/no-registrado" />}
        {!isAuth && <Redirect noThrow from="/inicio" to="/no-registrado" />}
        {!isAuth && <Redirect noThrow from="/clientes" to="/no-registrado" />}
        {!isAuth && <Redirect noThrow from="/configuraciones" to="/no-registrado" />}
        <Logout path='/logout' />
        <Home path="/inicio" default  />
        <Products path="/productos" />
        <Clients path="/clientes" />
        <Configuraciones path="/configuraciones" />
        <RouteDetail path="/detalles-ruta" />
      </Router>
    </Suspense>
  );
};

export default App;
