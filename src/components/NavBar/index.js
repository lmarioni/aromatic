import React, { useContext, useEffect, useState } from "react";
import { Container, Menu } from "semantic-ui-react";

export const NavBar = () => {
  const [currentRoute, setCurrentRoute] = useState("");

  const fixed = true;
  const params = window.location.href.split("/");

  useEffect(function () {
    const route =
      params && params.length ? params[params.length - 1].split("?")[0] : "";
      console.log(route);
    setCurrentRoute(route);
  }, []);

  const handleRedirect = (path = "") => {
    if (currentRoute !== "") {
      window.location.href = `./${path}`;
    }
  };

  return (
    <Menu fixed={fixed ? "top" : null} pointing inverted secondary size="large">
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
      </Container>
    </Menu>
  );
};
