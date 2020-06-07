import React from "react";
import { Segment, Header, Icon, Container } from "semantic-ui-react";

export const NotFound = () => {
  return (
    <Container style={{ marginTop: "7em" }} textAlign="center">
      <Segment inverted>
        <Header icon>
          <Icon name="find" />
          Oops, la página solicitada no se encuentra
        </Header>
      </Segment>
    </Container>
  );
};
