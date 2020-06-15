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

import { Context } from "../Context";

export const Configuraciones = () => {
  const [loading, setLoading] = useState(true);
  const [configuracion, setConfiguracion] = useState(true); //se usa para congelar los datos nada mas
  const [input, setInput] = useState(true);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [respuesta, setRespuesta] = useState({});
  const { token } = useContext(Context);

  const show = () => setShowConfirm(true);
  const handleCancel = () => setShowConfirm(false);

  useEffect(function () {
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/configuracion/facturas`, data)
      .then((res) => res.json())
      .then((response) => {
        setConfiguracion(response);
        setInput(response);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (event) => {
    event.persist();
    setInput((input) => ({
      ...input,
      [event.target.name]: event.target.value,
    }));
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (input.nserie !== configuracion.nserie) {
        setSending(true)
      var opts = {
        nserie: input.nserie,
      };
      const data = {
        headers: new Headers({
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        }),
        method: "PUT",
        body: JSON.stringify(opts),
      };

      fetch(`${process.env.REACT_APP_BASE_URL}/configuracion/facturas`, data)
        .then((res) => res.json())
        .then((response) => {
        setSending(false)
            if(response.status === 'success'){
                setRespuesta({class: 'positive', message: "Numero de serie ediato correctamente"})
            }else{
                setRespuesta({class: 'error', message: response.message})
            }
        });
    }
  };

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
          <Segment>
            <Header as="h1" textAlign="center">
              Configuracion de facturación
            </Header>
            <form className={ sending ? ' ui form loading' : 'ui form'}>
              <div className="field">
                <label>Número de serie actual</label>
                <input
                  name="nserie"
                  onChange={handleInputChange}
                  value={input.nserie}
                  type="number"
                  step="1"
                  placeholder="Número de serie actual"
                />
                <small>
                  Si cambia el numero de serie, sus próximas facturas sandrán
                  con este numero de seria
                </small>
              </div>
              {
                  respuesta.message &&
                  <div class={`ui ${respuesta.class} message`}>
                  {respuesta.message}
              </div>
              }
              
              <div className="ui clearing">
                <button
                  onClick={show}
                  type="button"
                  className="ui right floated primary button"
                >
                  Guardar
                </button>
              </div>
              <br />
              <br />
            </form>
          </Segment>
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>
      <Confirm
        open={showConfirm}
        content="Esto hará que las próximas facturas tengan este nuevo numero de serie y distintos numeros de factura. Estas seguro?"
        header="Cambiaste el numero de serie"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Container>
  );
};
