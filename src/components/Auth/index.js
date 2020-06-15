import React from "react";
import "./styles.scss";
import { Container } from "semantic-ui-react";
import LoginForm from "../LoginForm";

export const Auth = () => {
  return (
    <React.Fragment>
      <Container>
        <LoginForm />
      </Container>
    </React.Fragment>
  );
};
