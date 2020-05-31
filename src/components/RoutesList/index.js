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

const RoutesList = ({routesList = []}) => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);

  useEffect(function () {
    if(routesList){
      setRoutes(routesList);
    }
  }, [routesList]);

  const redirect = (id = 0) => {
    window.location.href = `./route-details?i=${id}`;
  };

  const renderRoutes = () => (
    <Card.Group>
      {routes.map((route) => {
        return (
          <Card inverted="true" key={`route-${route.id}`}>
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

  return (
    <div>
      {routes.length && renderRoutes()}
    </div>
  );
};

export default RoutesList;
