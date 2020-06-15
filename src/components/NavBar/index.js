import React, { useContext, useEffect, useState } from "react";
import {Link} from '@reach/router'
import { Container, Menu } from "semantic-ui-react";
import './styles.scss';
export const NavBar = () => {
  const [currentRoute, setCurrentRoute] = useState("");

  const fixed = true;
  const params = window.location.href.split("/");

  useEffect(function () {
    const route =
      params && params.length ? params[params.length - 1].split("?")[0] : "";
    setCurrentRoute(route);
  }, []);

  const handleRedirect = (path = "") => {
    if (currentRoute !== path) {
      window.location.href = `./${path}`;
    }
  };

  return (
    <Menu className="topNavbar" fixed={fixed ? "top" : null} pointing inverted size="large">
      <Container>
        <Menu.Item
          as="a"
          active={currentRoute === "inicio"}
          onClick={() => {
            handleRedirect("inicio");
          }}
        >
          Inicio
        </Menu.Item>
        <Menu.Item
          as="a"
          active={currentRoute === "productos"}
          onClick={() => {
            handleRedirect("productos");
          }}
        >
          Productos
        </Menu.Item>
        <Menu.Item
          as="a"
          active={currentRoute === "clientes"}
          onClick={() => {
            handleRedirect("clientes");
          }}
        >
          Clientes
        </Menu.Item>
        <Menu.Item
          as="a"
          active={currentRoute === "configuraciones"}
          onClick={() => {
            setCurrentRoute("configuraciones");
          }}
        >
          <Link to="/configuraciones"> Configuraciones </Link>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item
            as="a"
            name='Salir'
            onClick={() => {
              handleRedirect("logout");
            }}
          />
        </Menu.Menu>
      </Container>
    </Menu>
  );
};
