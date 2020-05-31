import React from "react";
import "./styles.scss";
import { Container } from "semantic-ui-react";
import LoginForm from "../LoginForm";

export const Auth = ({ idCurso = "" }) => {
  return (
    <React.Fragment>
      <Container>
        <LoginForm idCurso={idCurso} />
      </Container>
    </React.Fragment>
  );
};
