import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Modal,
  Segment,
  Header,
  Icon,
  List,
  Grid,
  Divider,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import "react-infinite-calendar/styles.css";
import { Context } from "../../Context";
import { parse } from "semver";

const PrintBillingModal = ({
  id = null,
  open,
  nserie = 0,
  onClose,
  clients = [],
  date = null,
}) => {
  const { token } = useContext(Context);
  const [billsToPrint, setBillsToPrint] = useState([]);
  const [multiPrint, setMultiPrint] = useState("");
  const [showWarningMessage, setShowWarningMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [createdBills, setCreatedBills] = useState([]);
  const [alreadyCreated, setAlreadyCreated] = useState(false);

  useEffect(
    function () {
      if (open && clients.length && date && id) {
        fetchRepeatedBills();
        //fetchBillingInfo();
      }
    },
    [open]
  );

  const fetchRepeatedBills = async () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        fecha: date.format("DD-MM-YYYY"),
        idruta: id,
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/facturas/rutas`,
      requestOptions
    );

    const parsedResponse = await response.json();
    if (!parsedResponse.length) {
      setLoading(false);
      handleEmitBill();
    } else {
      setLoading(false);
      const createdInvoices = parsedResponse.map((invoice, index) => {
        let client = clients.find((client) => client.id === invoice.idcliente);
        if (client === undefined) {
          client = clients[index];
        }
        invoice.client = client;
        return invoice;
      });
      setCreatedBills(createdInvoices);
    }
  };

  const handleReset = () => {
    setBillsToPrint([]);
    setMultiPrint("");
    setShowWarningMessage(false);
    setLoading(false);
    setLoadingButton(false);
    setCreatedBills([]);
    setAlreadyCreated(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleEmitBill = async () => {
    const filteredClients = clients.filter((client) => client.facturar);
    const requestBody = {
      idruta: id,
      fecha: date.format("DD-MM-YYYY"),
      nserie,
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
      setAlreadyCreated(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/facturar`,
        requestOptions
      );
      const parsedResponse = await response.json();
      setMultiPrint(parsedResponse.multi);
      const billsArray = parsedResponse.invoices.map((invoice) => {
        invoice.client = clients.find(
          (client) => client.id === invoice.idcliente
        );
        return invoice;
      });
      setBillsToPrint(billsArray);
      setLoadingButton(false);
      setLoading(false);
    } else {
      setShowWarningMessage(true);
    }
  };

  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando facturas</Loader>
    </Dimmer>
  );

  const renderCreatedBills = () => (
    <div>
      <Segment placeholder textAlign="center">
        <Header as="h2" textAlign="center">
          Parece que estas facturas ya se encuentran emitidas.
        </Header>
        <p> Esta ruta para esta fecha ya fue facturada </p>
      </Segment>
      <Segment placeholder textAlign="center">
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical>O</Divider>

          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              <Header as="h2" icon>
                <Icon name="search" />
                Puede descargarlas nuevamente
                <Header.Subheader>
                  No se generarán nuevas facturas. solo las imprimirás. <br />
                  Haz click en el siguiente link:
                </Header.Subheader>
              </Header>
              <List divided link>
                {createdBills.map(({ invoices, id, idruta, client = {} }) => (
                  <List.Item
                    as="a"
                    style={{ color: "blue" }}
                    href={invoices}
                    key={`createdBill${id}`}
                  >
                    {Object.keys(client).length
                      ? `${
                          client.nombreFantasia
                            ? client.nombreFantasia
                            : client.nombre
                        }
                      ${
                        client.productos.length
                          ? client.productos.map(
                              ({ producto, cantidad }) =>
                                `${producto.nombre} x ${cantidad}`
                            )
                          : ""
                      }`
                      : `Factura - Ruta ${idruta}`}
                  </List.Item>
                ))}
              </List>
            </Grid.Column>
            <Grid.Column className="flex-column">
              <Header icon>
                <Icon name="repeat" />
                Emitirlas nuevamente
                <Header.Subheader>
                  Esto generará nuevos numeros de factura
                </Header.Subheader>
              </Header>
              <Button
                primary
                onClick={handleEmitBill}
                disabled={alreadyCreated}
              >
                Re-emitir facturas
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
  const renderPrintBills = () => (
    <React.Fragment>
      {billsToPrint && billsToPrint.length > 1 && (
        <Segment>
          <a href={multiPrint}>Descargar todas las facturas</a>
        </Segment>
      )}
      <Segment color="blue" textAlign="center">
        <List divided relaxed>
          {billsToPrint.map(({ filename, idfactura, client }, index) => (
            <List.Item key={`bill-${index}`}>
              <List.Icon name="print" size="large" verticalAlign="middle" />
              <List.Content>
                <Header>
                  <a href={filename}>
                    {Object.keys(client).length
                      ? `${
                          client.nombreFantasia
                            ? client.nombreFantasia
                            : client.nombre
                        }
                        ${client.productos.map(
                          ({ producto, cantidad }) =>
                            `${producto.nombre} x ${cantidad}`
                        )} 
                        `
                      : `Factura`}
                  </a>
                </Header>
                <List.Description as="a">
                  Factura número {idfactura}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </React.Fragment>
  );
  const renderWarningMessage = () => (
    <Segment color="blue" textAlign="center">
      <Header icon>
        <Icon name="pdf file outline" />
        Al parecer no hay facturas para emitir, recuerde cambiar la opcion de
        'Facturar' para cada cliente la tabla.
      </Header>
      <Button primary onClick={handleClose}>
        Volver a la tabla
      </Button>
    </Segment>
  );
  const renderContent = () => (
    <div>
      {loading ? (
        renderLoading()
      ) : (
        <div>
          {createdBills.length > 0 && renderCreatedBills()}
          {billsToPrint
            ? billsToPrint.length
              ? renderPrintBills()
              : null
            : null}
        </div>
      )}
    </div>
  );
  return (
    <Modal open={open} closeOnDocumentClick={true}>
      <Modal.Header>Imprimir facturas</Modal.Header>
      <Modal.Content scrolling>
        {!showWarningMessage ? renderContent() : renderWarningMessage()}
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PrintBillingModal;
