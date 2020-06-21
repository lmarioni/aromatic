import React, { useState, useContext, useEffect } from "react";
import { Context } from "../Context";
import {
  Container,
  Header,
  Grid,
  Divider,
  Button,
  Dimmer,
  Loader,
  Segment,
  Icon,
  Modal,
  Form,
  Message,
} from "semantic-ui-react";
import RoutesList from "../components/RoutesList";

export const Home = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [loadingSubmitButton, setLoadingSubmitButton] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [routesList, setRoutesList] = useState([]);
  const [message, setMessage] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  useEffect(function () {
    fetchRoutes();
  }, []);

  const fetchRoutes = () => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/rutas/`, data)
      .then((res) => res.json())
      .then((response) => {
        setRoutesList(response);
        setLoading(false);
      });
  };

  const reset = () => {
    setRouteName("");
    setRouteDescription("");
  };

  const handleOpenModal = () => setModalShow(true);
  const handleCloseModal = () => {
    reset();
    setModalShow(false);
  };

  const handleSetMessage = (messageStatus) => {
    const newMessage = {
      type: messageStatus,
      title: messageStatus === "success" ? "Perfecto" : "Error",
      content:
        messageStatus === "success"
          ? "La ruta se ha creado satisfactoriamente"
          : "Hubo un error al crear la ruta.",
    };
    setMessage(newMessage);
    setShowMessage(true);
    setTimeout(function () {
      setShowMessage(false);
      setMessage({});
    }, 1500);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLoadingSubmitButton(true);
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        nombre: routeName,
        descripcion: routeDescription
      }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/rutas`,
      requestOptions
    );
    const parsedResponse = await response.json();
    handleSetMessage(parsedResponse.status);
    if (parsedResponse.status === "success") {
      setLoadingSubmitButton(false);
      const newRoutes = routesList;
      newRoutes.push(parsedResponse.ruta);
      setRoutesList(newRoutes);
      handleCloseModal();
    } else {
      setLoadingSubmitButton(false);
    }
  };

  const renderNoRoutes = () => (
    <div className="noRoutes">
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Parece que no hay rutas cargadas
        </Header>
        <Segment.Inline>
          <Button primary onClick={handleOpenModal}>
            Crear ruta
          </Button>
        </Segment.Inline>
      </Segment>
    </div>
  );
  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando datos</Loader>
    </Dimmer>
  );

  const renderRoutes = () => <RoutesList routesList={routesList} />;

  const renderModal = () => (
    <Modal size="small" open={modalShow}>
      <Header content="Crear nueva ruta" />
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Nombre de la ruta</label>
            <input
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              name="routeName"
              type="text"
              placeholder="Ingrese aquí el nombre para la nueva ruta"
            />
          </Form.Field>
          <Form.Field>
            <label>Observación</label>
            <input
              value={routeDescription}
              onChange={(e) => setRouteDescription(e.target.value)}
              name="routeDescription"
              type="text"
              placeholder="Ingrese aquí si la hubiese una observación para la nueva ruta"
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={handleCloseModal}>
          <Icon name="remove" /> Cancelar
        </Button>
        <Button primary onClick={handleSubmit} loading={loadingSubmitButton}>
          <Icon name="checkmark" /> Guardar
        </Button>
      </Modal.Actions>
    </Modal>
  );

  return (
    <div>
      {renderModal()}
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Selección de rutas
        </Header>
        <Grid>
          <Grid.Column floated="left" width={5}>
            <Button primary onClick={handleOpenModal}>
              Crear nueva ruta
            </Button>
          </Grid.Column>
        </Grid>
        <Divider />
        {showMessage && message && (
          <Message
            inverted
            positive={message.type === "success"}
            negative={message.type === "error"}
          >
            <Message.Header>{message.title}</Message.Header>
            <p>{message.content}</p>
          </Message>
        )}
        {loading
          ? renderLoading()
          : routesList.length
          ? renderRoutes()
          : renderNoRoutes()}
      </Container>
    </div>
  );
};
