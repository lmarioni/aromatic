import React, { useState, useContext, useEffect } from "react";
import {
  Segment,
  Header,
  Icon,
  Container,
  Grid,
  Divider,
  Button,
} from "semantic-ui-react";
import { Context } from "../Context";
import ReportList from "../components/ReportList";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";

export const Reports = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [today, setToday] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(function () {
    fetchReports();
  }, []);

  const fetchReports = () => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };
    //https://api-aromatic.azurewebsites.net/facturas?desde=05-06-2020&hasta=15-06-2020&idcliente=22

    // fetch(`${process.env.REACT_APP_BASE_URL}/reports/`, data)
    //   .then((res) => res.json())
    //   .then((response) => {
    //     setReportsList(response);
    //     setLoading(false);
    //   });
    setLoading(false);
  };

  const renderNoReports = () => (
    <div>
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Parece que no hay reportes cargados a la fecha
        </Header>
      </Segment>
    </div>
  );

  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando reportes</Loader>
    </Dimmer>
  );

  const renderReports = () => <ReportList reportList={reports} />;

  return (
    <div>
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Reportes
        </Header>
        <Grid>
          <Grid.Column width={3} floated="left">
            <div>Col 1</div>
          </Grid.Column>
          <Grid.Column width={6} floated="left">
            <DateRangePicker
              startDate={startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              startDatePlaceholderText="Inicio"
              endDatePlaceholderText="Fin"
              endDate={endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => {
                setStartDate(startDate);
                setEndDate(endDate);
              }} // PropTypes.func.isRequired,
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={(fInput) => setFocusedInput(fInput)} // PropTypes.func.isRequired,
            />
          </Grid.Column>
          <Grid.Column width={3} floated="right">
            <div>Col 3</div>
          </Grid.Column>
        </Grid>
        <Divider />

        {loading
          ? renderLoading()
          : reports.length
          ? renderReports()
          : renderNoReports()}
      </Container>
    </div>
  );
};
