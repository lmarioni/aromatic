import React, { useState, useContext, useEffect } from "react";
import {
  Segment,
  Header,
  Icon,
  Container,
  Grid,
  Divider,
  Button,
  Search,
  Item,
  List,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import "moment/locale/es";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { Context } from "../Context";
import ReportList from "../components/ReportList";
import { DateRangePicker } from "react-dates";
import { debounce } from "../utils";
import { DateRangePickerPhrases } from "../utils/localeCalendarPhrases";
import moment from "moment";

export const Reports = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [today, setToday] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [client, setClient] = useState(null);
  const [filteredResults, setFilteredResults] = useState([
    { title: "", description: "" },
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(function () {
    resetForm();
  }, []);

  const resetForm = () => {
    setLoading(false);
    setReports([]);
    setToday(new Date());
    setStartDate(null);
    setEndDate(null);
    setFocusedInput(null);
    setFilteredResults(null);
    setSearchValue("");
    setLoadingSearch(false);
  };

  const fetchReports = async () => {
    setLoadingButton(true);
    setLoading(true);

    const requestOptions = {
      method: "GET",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/facturas?desde=${startDate.format(
        "DD-MM-YYYY"
      )}&hasta=${endDate.format("DD-MM-YYYY")}${
        client ? `&idcliente=${client.id}` : ""
      }`,
      requestOptions
    );

    const parsedResponse = await response.json();

    if (parsedResponse && parsedResponse.length) {
      setReports(parsedResponse);
      setLoadingButton(false);
    } else {
      console.log(parsedResponse);
      setLoadingButton(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (searchValue) {
      const delayDebounceFn = setTimeout(async () => {
        setLoadingSearch(true);
        const cli = await (await fetchClients(searchValue)).json();
        const parsedClients = cli.map((client) => {
          client.title = client.nombreFantasia
            ? client.nombreFantasia
            : client.nombre;
          return client;
        });
        setFilteredResults(parsedClients);
        setLoadingSearch(false);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchValue]);

  const fetchClients = async (q = "") => {
    const data = {
      headers: new Headers({ Authorization: "Bearer " + token }),
    };

    return fetch(
      `${process.env.REACT_APP_BASE_URL}/clientes${q ? `?q=${q}` : "/"}`,
      data
    );
  };

  const handleSelected = (clientSelected) => {
    setClient(clientSelected);
  };

  const handleSearchChange = async (value) => {
    setSearchValue(value);
  };

  const renderDataSelected = () => (
    <List>
      <List.Item
        icon="calendar alternate outline"
        content={`Fecha inicio ${moment(startDate).format("DD-MM-YYYY")}`}
      />
      <List.Item
        icon="calendar alternate outline"
        content={`Fecha fin ${moment(endDate).format("DD-MM-YYYY")}`}
      />
      {client && (
        <List.Item
          icon="user"
          content={`Cliente ${
            client.nombreFantasia ? client.nombreFantasia : client.nombre
          }`}
        />
      )}
    </List>
  );

  const renderNoReports = () => (
    <div>
      <Segment placeholder textAlign="center" loading={loading}>
        <Header icon>
          <Icon name="search" />
          Parece que no hay reportes cargados a la fecha
        </Header>
      </Segment>
    </div>
  );

  const renderSearchResult = ({
    direccion = "",
    localidad = "",
    nombre = "",
    nombreFantasia = "",
    provincia = "",
  }) => (
    <div>
      {loadingSearch ? (
        <div>Buscando . . . </div>
      ) : (
        <Item>
          <Item.Content>
            <Item.Header as="h5">
              {nombreFantasia ? `${nombreFantasia}(${nombre})` : `${nombre}`}
            </Item.Header>
            <Item.Description>{`${direccion}-${localidad}`}</Item.Description>
            <Item.Extra>{provincia}</Item.Extra>
          </Item.Content>
        </Item>
      )}
    </div>
  );

  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando reportes</Loader>
    </Dimmer>
  );

  const renderSearchReports = () => (
    <Button
      onClick={fetchReports}
      icon
      loading={loadingButton}
      labelPosition="right"
      disabled={!startDate || !endDate}
    >
      Buscar reportes
      <Icon name="right arrow" />
    </Button>
  );

  const renderDatePicker = () => (
    <DateRangePicker
      isOutsideRange={() => false}
      phrases={DateRangePickerPhrases}
      displayFormat={"DD-MM-YYYY"}
      startDate={startDate} // momentPropTypes.momentObj or null,
      startDateId="billingStartDate" // PropTypes.string.isRequired,
      startDatePlaceholderText="Inicio"
      endDatePlaceholderText="Fin"
      endDate={endDate} // momentPropTypes.momentObj or null,
      endDateId="billingEndDate" // PropTypes.string.isRequired,
      onDatesChange={({ startDate, endDate }) => {
        setClient(null);
        setStartDate(startDate);
        setEndDate(endDate);
      }} // PropTypes.func.isRequired,
      focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
      onFocusChange={(fInput) => setFocusedInput(fInput)} // PropTypes.func.isRequired,
    />
  );

  const renderReports = () => <ReportList reportList={reports} />;
  const renderSearchClient = (title = "") => (
    <Search
      fluid
      loading={loadingSearch}
      results={filteredResults}
      onSearchChange={(e, { value }) => {
        debounce(handleSearchChange(value), 50);
      }}
      onResultSelect={(e, { result }) => {
        handleSelected(result);
      }}
      placeholder="Buscar clientes..."
      resultRenderer={renderSearchResult}
      value={searchValue}
      showNoResults={true}
      noResultsMessage="Cliente no encontrado"
    />
  );
  return (
    <div>
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Reportes
        </Header>
        <Grid>
          <Grid.Column width={5} floated="left">
            {renderDatePicker()}
          </Grid.Column>
          <Grid.Column width={4} floated="left">
            {renderSearchClient()}
          </Grid.Column>
          <Grid.Column width={3} floated="right">
            {renderSearchReports()}
          </Grid.Column>
        </Grid>
        <Divider />
        <div className="separatedSegment">
          <Segment color="blue">
            {startDate === null || endDate === null
              ? `Recuerde completar la fecha de inicio y de fin para la búsqueda. 
        El cliente es opcional.`
              : renderDataSelected()}
          </Segment>
        </div>
        {loading
          ? renderLoading()
          : reports.length
          ? renderReports()
          : renderNoReports()}
      </Container>
    </div>
  );
};
