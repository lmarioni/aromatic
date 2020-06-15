import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { useLocation } from "@reach/router";
import { Context } from "../../Context";
import Logo from "../../assets/img/logo/isologo.png";

const LoginForm = () => {
  const { activateAuth } = useContext(Context);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrMode, setQrMode] = useState(false);
  const params = useLocation().search.substr(1).split("&");

  useEffect(function () {
    if (params && params.length === 2) {
      const user = params[0].split("=")[1];
      const pswd = params[1].split("=")[1];
      if (user && pswd) {
        setQrMode(true);
        handleSubmit(null, { user, pswd });
      }
    } else {
      resetInputs();
    }
  }, []);

  const resetInputs = () => {
    setUsername("");
    setPassword("");
  };

  const handleUsername = (e, { name, value }) => setUsername(value);
  const handleUPassword = (e, { name, value }) => setPassword(value);

  const handleSubmit = (event, data = {}) => {
    if (event) {
      event.preventDefault();
    }
    setLoading(true);
    const url = `${process.env.REACT_APP_BASE_URL}/login`;
    let body = { email: username, pwd: password };
    if (data && data.user && data.pswd) {
      body.email = data.user;
      body.pwd = data.pswd;
    }
    fetch(url, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(body), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          activateAuth(response.token);
          window.location.href = `./`;
        } else {
          setQrMode(false);
          setLoading(false);
          setError(response.message);
        }
      });
  };
  return (
    <div>
      {qrMode ? (
        <div>
          <Dimmer active inverted>
            <Loader inverted>
              Accediendo al sistema espere un momento por favor
            </Loader>
          </Dimmer>
        </div>
      ) : (
        <Grid
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment>
              <Header as="h2" color="teal" textAlign="center">
                <Image src={Logo} size="large" className="w-100" />
              </Header>
              <Form
                size="large"
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              >
                <Segment>
                  <Form.Input
                    fluid
                    name="username"
                    onChange={handleUsername}
                    value={username}
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail"
                  />
                  <Form.Input
                    fluid
                    name="password"
                    onChange={handleUPassword}
                    value={password}
                    icon="lock"
                    iconPosition="left"
                    placeholder="Contraseña"
                    type="password"
                  />
                  <Button type="submit" color="teal" fluid size="large">
                    Ingresar
                  </Button>
                  {error !== "" && (
                    <Message
                      error
                      header="Error"
                      content={
                        "Hubo un error al querer ingresar al sistema. " + error
                      }
                    />
                  )}
                </Segment>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      )}
    </div>
  );
};

export default LoginForm;
