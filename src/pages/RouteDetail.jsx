import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import { Context } from "../Context";
import {
  Container,
  Header,
  Button,
  Segment,
  Icon,
  Dimmer,
  Loader,
  Table,
} from "semantic-ui-react";
import { useLocation } from "@reach/router";

export const RouteDetail = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const params = useLocation().search.substr(1).split("&");

  useEffect(function () {
    if (params && params.length) {
      const routeId = params[0].split("=")[1];
      const query = params.length > 1 ? params[1].split("=")[1] : "";
      if (routeId) {
        fetchRoute({ id: routeId, q: query });
      }
    }
  }, []);

  const fetchRoute = ({ id = 0, q = "" }) => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };
    let parsedParams = `idruta=${id}`;
    parsedParams = q ? `${parsedParams}&q=${q}` : parsedParams;
    fetch(`${process.env.REACT_APP_BASE_URL}/clientes?${parsedParams}`, data)
      .then((res) => res.json())
      .then((response) => {
        setClients(response);
        setLoading(false);
      });
  };

  const renderNoClients = () => (
    <Segment placeholder textAlign="center" style={{ marginTop: "7em" }}>
      <Header icon>
        <Icon name="search" />
        Parece que no hay usuarios cargados
      </Header>
      <Segment.Inline>
        <Button primary>Cargar usuarios</Button>
      </Segment.Inline>
    </Segment>
  );
  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando datos</Loader>
    </Dimmer>
  );

  const renderClients = () => {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>id</Table.HeaderCell>
            <Table.HeaderCell>cif</Table.HeaderCell>
            <Table.HeaderCell>cpostal</Table.HeaderCell>
            <Table.HeaderCell>nombreFantasia</Table.HeaderCell>
            <Table.HeaderCell>nombre</Table.HeaderCell>
            <Table.HeaderCell>apellido</Table.HeaderCell>
            <Table.HeaderCell>direccion</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>localidad</Table.HeaderCell>
            <Table.HeaderCell>telefono</Table.HeaderCell>
            <Table.HeaderCell>telefono2</Table.HeaderCell>
            <Table.HeaderCell>userid</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {clients.map((client) => {
            return (
              <Table.Row>
                <Table.Cell>{client.id}</Table.Cell>
                <Table.Cell>{client.cif}</Table.Cell>
                <Table.Cell>{client.cpostal}</Table.Cell>
                <Table.Cell>{client.nombreFantasia}</Table.Cell>
                <Table.Cell>{client.nombre}</Table.Cell>
                <Table.Cell>{client.apellido}</Table.Cell>
                <Table.Cell>{client.direccion}</Table.Cell>
                <Table.Cell>{client.email}</Table.Cell>
                <Table.Cell>{client.localidad}</Table.Cell>
                <Table.Cell>{client.telefono}</Table.Cell>
                <Table.Cell>{client.telefono2}</Table.Cell>
                <Table.Cell>{client.userid}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  };

  return (
    <Container style={{ marginTop: "7em" }}>
      <Header as="h1">Ruta / Listado de clientes</Header>
      {loading
        ? renderLoading()
        : clients.length
        ? renderClients()
        : renderNoClients()}
    </Container>
  );
};
