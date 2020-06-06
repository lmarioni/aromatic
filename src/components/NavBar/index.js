import React, { useContext, useEffect, useState } from "react";
import { Container, Menu } from "semantic-ui-react";

export const NavBar = () => {
  const [currentRoute, setCurrentRoute] = useState("");

  const fixed = true;
  const params = window.location.href.split("/");

  useEffect(function () {
    const route =
      params && params.length ? params[params.length - 1].split("?")[0] : "";
    setCurrentRoute(route);
  }, []);

  const handleRedirect = () => {
    if (currentRoute !== "") {
      window.location.href = `./`;
    }
  };

  return (
    <Menu fixed={fixed ? "top" : null} inverted  primary size="large">
      <Container>
        <Menu.Item
          as="a"
          active
          onClick={() => {
            handleRedirect();
          }}
        >
          Inicio
        </Menu.Item>
      </Container>
    </Menu>
  );
};
