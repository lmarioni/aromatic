import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import faker from "faker";
import { Context } from "../Context";
import {
  Container,
  Header,
  Grid,
  Search,
  Divider,
  Button,
  Dimmer,
  Loader,
  Segment,
  Icon
} from "semantic-ui-react";
import RoutesList from "../components/RoutesList";

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, "$"),
}));

export const Home = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [routesList, setRoutesList] = useState([]);
  const [value, setValue] = useState("");

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
    setLoadingSearch("");
    setSearchResults([]);
    setValue("");
  };

  const handleResultSelect = (e, { result }) => {
    setValue(result.title);
  };

  const handleSearchChange = (e, { value }) => {
    setLoadingSearch(true);
    setValue(value);

    setTimeout(() => {
      if (value.length < 1) return reset();
      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) => re.test(result.title);
      setSearchResults(_.filter(source, isMatch));
      setLoadingSearch(false);
    }, 300);
  };

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

  const renderRoutes = () => (
    <RoutesList routesList={routesList} />
  )

  return (

    <Container style={{ marginTop: "7em" }} textAlign="center">
      <Header as="h1" inverted textAlign="center">
        Selección de rutas
      </Header>
      <Grid>
        <Grid.Column floated="left" width={5}>
          <Button primary>Crear nueva ruta</Button>
        </Grid.Column>
        <Grid.Column floated="right" width={5}>
          <Search
            loading={loadingSearch}
            onResultSelect={handleResultSelect}
            onSearchChange={_.debounce(handleSearchChange, 500, {
              leading: true,
            })}
            results={searchResults}
            value={value}
          />
        </Grid.Column>
      </Grid>
      <Divider />
      {loading
        ? renderLoading()
        : routesList.length
        ? renderRoutes()
        : renderNoRoutes()}
    </Container>
  );
};
