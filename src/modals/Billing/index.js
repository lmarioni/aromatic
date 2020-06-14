import React, { useEffect, useState, useContext } from "react";
import { Button, Modal, Segment, Header, Icon, List } from "semantic-ui-react";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";
import { Context } from "../../Context";

const PrintBillingModal = ({ open, onClose, clients = [] }) => {
  const { token } = useContext(Context);
  const [serie, setSerie] = useState(0);
  const [today, setToday] = useState(new Date());
  const [billsToPrint, setBillsToPrint] = useState([]);
  const [showWarningMessage, setShowWarningMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(
    function () {
      if (open && clients.length) {
        fetchBillingInfo();
      }
    },
    [open]
  );

  const fetchBillingInfo = () => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/configuracion/facturas`, data)
      .then((res) => res.json())
      .then(({ fechaMinina, nserie, numeroFactura }) => {
        const splitedDate = fechaMinina.split("-");
        const minDate = new Date(
          splitedDate[2],
          splitedDate[1] - 1,
          splitedDate[0]
        );
        setMinDate(minDate);
        setSerie(nserie);
        setLoading(false);
      });
  };

  const handleReset = () => {
    setSerie(0);
    setToday(new Date());
    setShowWarningMessage(false);
    setLoading(false);
    setMinDate(null);
    setSelectedDate(null);
    setBillsToPrint([]);
    setLoadingButton(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleEmitBill = async () => {
    let fecha = "";
    if (!selectedDate) {
      const parsedToday = today.toLocaleDateString().split("/");
      fecha = `${parseInt(parsedToday[1])}-${parseInt(
        parsedToday[0]
      )}-${parseInt(parsedToday[2])}`;
    } else {
      fecha = selectedDate;
    }

    const filteredClients = clients.filter((client) => client.facturar);

    const requestBody = {
      fecha,
      serie,
      facturas: filteredClients.map((client) => {
        const bill = { to: client.id };
        const items = client.productos.map(({ producto, cantidad }) => {
          return {
            cantidad: cantidad,
            idproducto: producto.id,
          };
        });

        bill.items = items;
        return bill;
      }),
    };
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(requestBody),
    };
    if (requestBody.facturas[0]) {
      setLoading(true);
      setLoadingButton(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/facturar`,
        requestOptions
      );
      const parsedResponse = await response.json();
      const billsArray = parsedResponse.map((bill) => bill.filename);
      setBillsToPrint(billsArray);
      setLoadingButton(false);
      setLoading(false);
    } else {
      setShowWarningMessage(true);
    }
  };

  const renderPrintBills = () => (
    <Segment color="blue" textAlign="center">
      <List divided relaxed>
        {billsToPrint.map((bill, index) => (
          <List.Item key={`bill-${index}`}>
            <List.Icon name="print" size="large" verticalAlign="middle" />
            <List.Content>
              <Header>
                <a href={bill} target="_blank">
                  Imprimir factura
                </a>
              </Header>
              <List.Description as="a">Descripcion de factura</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  );
  const renderWarningMessage = () => (
    <Segment color="blue" textAlign="center">
      <Header icon>
        <Icon name="pdf file outline" />
        Al parecer no hay facturas para emitir, recuerde cambiar la opcion de
        'Facturar' de la tabla.
      </Header>
      <Button primary onClick={handleClose}>
        Volver a la tabla
      </Button>
    </Segment>
  );
  const renderContent = () => (
    <Segment loading={loading}>
      <Header as="h2" dividing>
        Seleccione una fecha para facturar
      </Header>
      <InfiniteCalendar
        displayOptions={{
          showHeader: false,
        }}
        locale={{
          locale: require("date-fns/locale/es"),
          headerFormat: "dddd, D MMM",
          weekdays: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
          blank: "Seleccione una fecha de facturación",
          todayLabel: {
            long: "Hoy",
            short: "Hoy",
          },
        }}
        onSelect={(date) => {
          const newDate = date.toLocaleDateString().split("/");
          const formatedDate = `${newDate[1]}-${newDate[0]}-${newDate[2]}`;
          setSelectedDate(formatedDate);
        }}
        width={"100%"}
        height={350}
        rowHeight={70}
        selected={today}
        minDate={minDate}
      />
    </Segment>
  );
  return (
    <Modal open={open} closeOnDocumentClick={true}>
      <Modal.Header>Imprimir facturas</Modal.Header>
      <Modal.Content scrolling>
        {!showWarningMessage
          ? billsToPrint && billsToPrint.length
            ? renderPrintBills()
            : renderContent()
          : renderWarningMessage()}
      </Modal.Content>
      <Modal.Actions>
        {billsToPrint && billsToPrint.length ? null : (
          <Button
            primary
            onClick={handleEmitBill}
            disabled={showWarningMessage}
            loading={loadingButton}
          >
            Emitir facturas
          </Button>
        )}
        <Button basic onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PrintBillingModal;
