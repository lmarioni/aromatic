import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import faker from "faker";
import { Context } from "../Context";
import { Container, Header, Grid, Search } from "semantic-ui-react";
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
  const [loadingSearch, setLoadingSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [value, setValue] = useState("");

  useEffect(function () {
    
  }, []);

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

  return (
    <div>
      <Container style={{ marginTop: "7em" }}>
        <Header as="h1">Selección de rutas</Header>
        <Grid columns={6}>
          <Grid.Row>
            <Grid.Column>
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
          </Grid.Row>
        </Grid>
        <RoutesList />
      </Container>
    </div>
  );
};
