import React, { useEffect, useState, useContext } from "react";
import {
  Segment,
  Header,
  Icon,
  Container,
  Grid,
  Divider,
  Dimmer,
  Loader,
  Button,
  Confirm,
} from "semantic-ui-react";

import {Link} from '@reach/router'

import { Context } from "../Context";

export const Historic = ({idRuta}) => {
  const [loading, setLoading] = useState(true);
  const [ruta, setRuta] = useState({});
  const [multis, setMultis] = useState([]); //se usa para congelar los datos nada mas

  const { token } = useContext(Context);

  useEffect(function () {
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/facturas/rutas/${idRuta}`, data)
      .then((res) => res.json())
      .then((response) => {
        setMultis(response.multis);
        setRuta(response.ruta);
        setLoading(false);
      });
  }, []);





  if (loading) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Cargando datos</Loader>
      </Dimmer>
    );
  }

  return (
    <Container style={{ marginTop: "7em" }}>
      <Grid columns="equal">
        <Grid.Column></Grid.Column>
        <Grid.Column width={12}>
        <Link class="ui primary button" to={`/detalles-ruta?i=${idRuta}`}>
        {`< `} Volver
        </Link>
          <Segment>
            <Header as="h1" textAlign="center">
              Ruta {ruta.nombre}
              <p style={{fontSize: 15}} >En esta pantalla podrás encontrar todas las facturas realizadas para la ruta {ruta.nombre}, puedes imprimirlas.</p>
            </Header>
            {
                multis.length === 0 ?
                <p> <b>No encontramos ninguna facturación para esta ruta</b></p>
                :
                <table class="ui celled table">
                <thead>
                    <tr>
                        <th>Fecha de facturación</th>
                        <th>Facturas</th>
                    </tr>
                    </thead>
                <tbody>
                    {
                        multis.map(multi => {
                            return(
                                <tr>
                                    <td>{multi.fecha}</td>
                                    <td> <a href={multi.invoices} target="_blank"> ver facturas </a> </td>
                                </tr>
                            )
                        })
                    }
                
                </tbody>
                </table>
            }
            
          </Segment>
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
    </Container>
  );
};
