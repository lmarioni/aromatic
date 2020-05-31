import React, { useContext, useState, useEffect } from "react";
import {
  Card,
  Image,
  Button,
  Dimmer,
  Loader,
  Header,
  Segment,
  Icon,
} from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";

const RoutesList = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);

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
        setRoutes(response);
        setLoading(false);
      });
  };

  const redirect = (id = 0) => {
    window.location.href = `./route-details?i=${id}`;
  };

  const renderRoutes = () => (
    <Card.Group>
      {routes.map((route) => {
        return (
          <Card inverted>
            <Card.Content>
              <Card.Header>{route.nombre}</Card.Header>
              <Card.Description>
                Ruta re cheta
                <strong>La mas mejor</strong>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button
                  basic
                  color="blue"
                  onClick={() => {
                    redirect(route.id);
                  }}
                >
                  Ver clientes
                </Button>
              </div>
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );

  const renderNoRoutes = () => (
    <div className="noRoutes">
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Parece que no hay rutas cargadas
        </Header>
        <Segment.Inline>
          <Button primary>Crear ruta</Button>
        </Segment.Inline>
      </Segment>
    </div>
  );
  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando datos</Loader>
    </Dimmer>
  );

  return (
    <div>
      {loading
        ? renderLoading()
        : routes.length
        ? renderRoutes()
        : renderNoRoutes()}
    </div>
  );
};

export default RoutesList;
