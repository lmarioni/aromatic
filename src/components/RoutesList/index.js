import React, { useContext, useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";

const RoutesList = ({ routesList = [] }) => {
  const { token } = useContext(Context);
  const [routes, setRoutes] = useState([]);

  useEffect(
    function () {
      if (routesList) {
        setRoutes(routesList);
      }
    },
    [routesList]
  );

  const redirect = (id = 0) => {
    window.location.href = `./detalles-ruta?i=${id}`;
  };

  const renderRoutes = () => (
    <Card.Group className="routeListContainer">
      {routes.map(({ id, nombre, observacion = "" }) => {
        return (
          <Card inverted="true" key={`route-${id}`}>
            <Card.Content>
              <Card.Header>{nombre}</Card.Header>
              <Card.Meta>{observacion ? observacion : 'Sin observaciones'}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button
                  basic
                  color="blue"
                  onClick={() => {
                    redirect(id);
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

  return <div>{routes.length && renderRoutes()}</div>;
};

export default RoutesList;
