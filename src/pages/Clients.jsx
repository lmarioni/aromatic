import React, { useState, useContext, useEffect } from "react";
import {
  Segment,
  Header,
  Icon,
  Container,
  Grid,
  Divider,
  Button,
} from "semantic-ui-react";
import { Context } from "../Context";
import ClientList from "../components/ClientList";

export const Clients = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(function () {
    fetchClients();
  }, []);

  const fetchClients = () => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };

    // fetch(`${process.env.REACT_APP_BASE_URL}/rutas/`, data)
    //   .then((res) => res.json())
    //   .then((response) => {
    //     setClientsList(response);
    //     setLoading(false);
    //   });
    setLoading(false);
  };

  const renderNoClients = () => (
    <div>
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Parece que no hay clientes cargados
        </Header>
        <Segment.Inline>
          <Button
            primary
            onClick={() => {
              console.log("abrir modal ?");
            }}
          >
            Crear cliente
          </Button>
        </Segment.Inline>
      </Segment>
    </div>
  );

  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando clientes</Loader>
    </Dimmer>
  );

  const renderClients = () => <ClientList clientsList={clients} />;

  return (
    <div>
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Clientes
        </Header>
        <Grid>
          <Grid.Column floated="left" width={5}>
            <Button
              primary
              onClick={() => {
                console.log("abrir modal ?");
              }}
            >
              Crear nuevo cliente
            </Button>
          </Grid.Column>
        </Grid>
        <Divider />

        {loading
          ? renderLoading()
          : clients.length
          ? renderClients()
          : renderNoClients()}
      </Container>
    </div>
  );
};
