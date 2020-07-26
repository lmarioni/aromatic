import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import { Context } from "../Context";
import {
  Container,
  Header,
  Button,
  Segment,
  Icon,
  Dimmer,
  Loader,
  Divider,
  Grid,
  Label,
  Input,
  Checkbox,
  Confirm,
  Message,
} from "semantic-ui-react";
import { useLocation, Link } from "@reach/router";
import Cookies from "js-cookie";
import "moment/locale/es";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { SingleDatePicker } from "react-dates";

import AssignClientsModal from "../modals/Clients/AssignClients";
import TableSettingsModal from "../modals/Clients/TableSettings";
import { searchInArr } from "../utils";
import PrintBillingModal from "../modals/Billing";
import SearchProductModal from "../modals/SearchProducts";

import { defaultColumns } from "../utils/initColumns";
import { SingleDatePickerPhrases } from "../utils/localeCalendarPhrases";
import EditClientModal from "../modals/Clients/EditClient";
import { Clients } from "../components/Clients";

export const RouteDetail = () => {
  const [id, setId] = useState(0);
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [date, setDate] = useState(null);
  const [dateFocused, setDateFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showAssignModalClients, setShowAssignModalClients] = useState(false);
  const [showPrintBillingModal, setShowPrintBillingModal] = useState(false);
  const [showTableSettings, setShowTableSettings] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [columns, setColumns] = useState([]);
  const [clientToAddProduct, setClientToAddProduct] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const params = useLocation().search.substr(1).split("&");
  const [minDate, setMinDate] = useState(null);
  const [serie, setSerie] = useState(0);
  const [printBilling, setPrintBilling] = useState(true);
  const [realColumnCount, setRealColumnCount] = useState(0);
  const [clientToDelete, setClientToDelete] = useState({});
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorHeader, setErrorHeader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(function () {
    if (params && params.length) {
      const routeId = params[0].split("=")[1];
      const query = params.length > 1 ? params[1].split("=")[1] : "";
      if (routeId) {
        setId(parseInt(routeId));
        fetchBillingInfo();
        fetchData({ id: routeId, q: query });
      }
    }

    const cachedColumns = Cookies.get("columns");

    if (!cachedColumns) {
      setColumns(defaultColumns);
      handleRealColumnCount(defaultColumns);
    } else {
      const parsedCachedColumns = JSON.parse(cachedColumns);
      const newColumns = defaultColumns.map((col, index) => {
        if (
          parsedCachedColumns[index] &&
          parsedCachedColumns[index].key === col.key &&
          parsedCachedColumns[index].label === col.label
        ) {
          col.display = parsedCachedColumns[index].display;
        }
        return col;
      });
      setColumns(newColumns);
      handleRealColumnCount(newColumns);
    }
  }, []);

  useEffect(() => {
    if (columns.length) {
      handleUpdateCookieColumns(columns);
    }
  }, [columns]);

  const handleUpdateCookieColumns = (newValue) => {
    Cookies.set("columns", newValue);
  };

  const handleRealColumnCount = (cols = columns) => {
    const count = cols.reduce((sum, col) => sum + (col.display ? 1 : 0), 0);
    setRealColumnCount(count);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const reOrderer_clients = Object.assign([], filteredClients);
    const reOrderer_client = filteredClients[source.index];
    reOrderer_clients.splice(source.index, 1);
    reOrderer_clients.splice(destination.index, 0, reOrderer_client);
    handleUpdateClientsOrder(reOrderer_clients);
  };

  const fetchBillingInfo = () => {
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
      });
  };

  const fetchData = async ({ id = 0, q = "" }) => {
    setLoading(true);
    const data = {
      headers: new Headers({ Authorization: "Bearer " + token }),
    };
    const prodArr = await (await fetchProducts(data)).json();
    setProducts(prodArr);
    if (prodArr.length) {
      const clientsArr = await (await fetchClients({ data, id, q })).json();
      const parsedClients = clientsArr.map((client) => {
        client.productos = [{ producto: prodArr[0], cantidad: 1 }];
        client.idproducto = [prodArr[0].id];
        client.nombreproducto = prodArr[0].nombre;
        client.precio = prodArr[0].precio;
        client.precioCosto = prodArr[0].precioCosto;
        client.facturar = true;
        return client;
      });
      setClients(parsedClients);
      setFilteredClients(parsedClients);
    }
    setLoading(false);
  };

  const fetchProducts = async (data = null) => {
    if (!data) {
      data = {
        headers: new Headers({ Authorization: "Bearer " + token }),
      };
    }
    return fetch(`${process.env.REACT_APP_BASE_URL}/productos/`, data);
  };

  const fetchClients = async ({ data = null, id, q }) => {
    if (!data) {
      data = {
        headers: new Headers({ Authorization: "Bearer " + token }),
      };
    }

    let parsedParams = `idruta=${id}`;
    parsedParams = q ? `${parsedParams}&q=${q}` : parsedParams;
    return fetch(
      `${process.env.REACT_APP_BASE_URL}/clientes?${parsedParams}`,
      data
    );
  };

  const mergeRoutes = (newRoutes = []) => {
    const new_clients = clients.concat(newRoutes);
    const parsedClients = new_clients.map((client) => {
      if (products.length) {
        client.productos = [{ producto: products[0], cantidad: 1 }];
        client.idproducto = [products[0].id];
        client.nombreproducto = products[0].nombre;
        client.precio = products[0].precio;
        client.precioCosto = products[0].precioCosto;
        client.facturar = true;
      }
      return client;
    });
    setClients(parsedClients);
    setFilteredClients(parsedClients);
  };

  const handleSearchValue = ({ value }) => {
    setLoading(true);
    setSearchValue(value);
    const searchedClients = searchInArr(clients, value);
    if (searchedClients.length) {
      setFilteredClients(searchedClients);
      setLoading(false);
    } else {
      setFilteredClients(clients);
      setLoading(false);
    }
  };

  const handleClosePrintBilling = () => {
    setShowPrintBillingModal(false);
  };

  const handleCloseTableSettings = (newColumns = []) => {
    if (newColumns && newColumns.length) {
      setColumns(newColumns);
      handleRealColumnCount(newColumns);
      handleUpdateCookieColumns(newColumns);
    }
    setShowTableSettings(false);
  };

  const handleCloseAssignClientsModal = (newRoutes = []) => {
    mergeRoutes(newRoutes);
    setShowAssignModalClients(false);
  };

  const handleCloseEditClientsModal = (editedClient = {}) => {
    setShowEditClientModal(false);
    setClientToEdit({});

    if (editedClient && Object.keys(editedClient).length) {
      const mappedClients = clients.map((client) => {
        if (client.id === editedClient.id) {
          client.idruta = editedClient.idruta;
          client.codigo = editedClient.codigo;
          client.cif = editedClient.cif;
          client.nombreFantasia = editedClient.nombreFantasia;
          client.nombre = editedClient.nombre;
          client.apellido = editedClient.apellido;
          client.direccion = editedClient.direccion;
          client.localidad = editedClient.localidad;
          client.provincia = editedClient.provincia;
          client.cpostal = editedClient.cpostal;
          client.telefono = editedClient.telefono;
          client.telefono2 = editedClient.telefono2;
          client.email = editedClient.email;
        }
        return client;
      });
      setClients(mappedClients);
      setFilteredClients(mappedClients);
    }
  };

  const handleCloseProductModal = (newProductList = []) => {
    if (newProductList.length && Object.keys(clientToAddProduct).length) {
      const newClients = clients.map((client) => {
        if (client.id === clientToAddProduct.id) {
          client.productos = [...newProductList];
          client.nombreproducto = newProductList.reduce(
            (nombre, { producto, cantidad }) =>
              nombre + `${producto.nombre}(x${cantidad}) - `,
            ""
          );
          if (
            client.nombreproducto.charAt(
              client.nombreproducto.trim().length - 1
            ) === "-"
          ) {
            client.nombreproducto = client.nombreproducto.trim().slice(0, -1);
          }

          client.precio = newProductList.reduce(
            (sum, { producto, cantidad }) =>
              sum + parseInt(producto.precio * cantidad),
            0
          );
          client.precioCosto = newProductList.reduce(
            (sum, { producto, cantidad }) =>
              sum + parseInt(producto.precioCosto * cantidad),
            0
          );
          client.facturar = true;
        }
        return client;
      });
      const newFilteredClients = filteredClients.map((client) => {
        if (client.id === clientToAddProduct.id) {
          client.productos = [...newProductList];
          client.nombreproducto = newProductList.reduce(
            (nombre, { producto, cantidad }) =>
              nombre + `${producto.nombre}(x${cantidad}) - `,
            ""
          );
          if (
            client.nombreproducto.charAt(
              client.nombreproducto.trim().length - 1
            ) === "-"
          ) {
            client.nombreproducto = client.nombreproducto.trim().slice(0, -1);
          }

          client.precio = newProductList.reduce(
            (sum, { producto, cantidad }) =>
              sum + parseInt(producto.precio * cantidad),
            0
          );
          client.precioCosto = newProductList.reduce(
            (sum, { producto, cantidad }) =>
              sum + parseInt(producto.precioCosto * cantidad),
            0
          );
          client.facturar = true;
        }
        return client;
      });
      setClients(newClients);
      setFilteredClients(newFilteredClients);
    }
    setShowProductModal(false);
  };

  const handleToggleBilling = (client = {}) => {
    setLoading(true);
    const newFilteredClients = filteredClients.map((filteredClient) => {
      if (filteredClient.id === client.id) {
        const newFacturar = filteredClient.facturar ? false : true;
        filteredClient.facturar = newFacturar;
      }
      return filteredClient;
    });
    setFilteredClients(newFilteredClients);
    setLoading(false);
  };

  const handleTogglePrintBilling = (action) => {
    setPrintBilling(action);
    const parsedFilteredClients = filteredClients.map((client) => {
      client.facturar = action;
      return client;
    });
    setFilteredClients(parsedFilteredClients);
  };

  const handleRemoveClient = async () => {
    const clientId = clientToDelete.id;
    setLoading(true);
    const requestOptions = {
      method: "DELETE",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    };
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/clientes/${clientId}`,
      requestOptions
    );

    const parsedResponse = await response.json();

    if (parsedResponse.status === "success") {
      setLoading(false);
      const filClients = clients.filter((client) => client.id !== clientId);
      setClients(filClients);
      setFilteredClients(filClients);
      setShowConfirmationDelete(false);
    } else {
      setShowConfirmationDelete(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirmation = () => {
    setShowPrintBillingModal(true);
  };
  const handleCancelDelete = () => {
    setClientToDelete({});
    setShowConfirmationDelete(false);
  };

  const handleConfirmationDelete = () => {
    handleRemoveClient();
  };

  const handleUpdateClientsOrder = (reOrderer_clients) => {
    const oldOrder = filteredClients;
    setFilteredClients(reOrderer_clients);
    const reOrderer_ids = reOrderer_clients.map((client) => ({
      idCliente: client.id,
    }));

    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      }),
      method: "POST",
      body: JSON.stringify(reOrderer_ids),
    };
    fetch(`${process.env.REACT_APP_BASE_URL}/clientes/${id}/ordenar`, data)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "error") {
          setErrorHeader("Error al reordenar las filas");
          setErrorMessage(response.message);
          setShowError(true);
          setFilteredClients(oldOrder);
          setTimeout(() => {
            setErrorHeader("");
            setErrorMessage("");
            setShowError(false);
          }, 2000);
        }
      });
  };

  const renderDatePicker = () => (
    <SingleDatePicker
      dayAriaLabelFormat="ES"
      block
      placeholder="Fecha de facturación"
      phrases={SingleDatePickerPhrases}
      displayFormat={"DD-MM-YYYY"}
      orientation="vertical"
      verticalHeight={568}
      date={date} // momentPropTypes.momentObj or null
      onDateChange={(newDate) => setDate(newDate)} // PropTypes.func.isRequired
      focused={dateFocused} // PropTypes.bool
      onFocusChange={({ focused }) => setDateFocused(focused)} // PropTypes.func.isRequired
      id="billingSingleDatePicker" // PropTypes.string.isRequired,
      isOutsideRange={(day) => day.isBefore(minDate)}
    />
  );

  const renderBillCheckbox = (client = {}) => (
    <Checkbox
      checked={client.facturar}
      onClick={() => {
        handleToggleBilling(client);
      }}
      label={client.facturar ? "Facturar" : "No facturar"}
      slider
    />
  );

  const renderActions = (client = {}) => (
    <div>
      <Icon
        name="trash"
        style={{ color: "red", cursor: "pointer", marginRight: 20 }}
        onClick={() => {
          setClientToDelete(client);
          setShowConfirmationDelete(true);
        }}
      />
      <Icon
        name="edit"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setClientToEdit(client);
          setShowEditClientModal(true);
        }}
      />
    </div>
  );

  const renderProductInTable = (client = {}, productName = "") => (
    <Button as="div" labelPosition="left">
      <Label as="a" basic>
        {productName}
      </Label>
      <Button
        icon
        onClick={() => {
          setClientToAddProduct(client);
          setShowProductModal(true);
        }}
      >
        <Icon name="edit" />
      </Button>
    </Button>
  );

  const renderNoClients = () => (
    <Segment secondary textAlign="center" style={{ marginTop: "7em" }}>
      <Header icon>
        <Icon name="search" />
        Parece que no hay clientes cargados para esta ruta
      </Header>
      <Segment.Inline>
        <Button
          primary
          onClick={() => {
            setShowAssignModalClients(true);
          }}
        >
          Asignar clientes
        </Button>
      </Segment.Inline>
    </Segment>
  );
  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando clientes</Loader>
    </Dimmer>
  );

  const renderClients = () => {
    return (
      <div>
        <Grid>
          <Grid.Column mobile={16} computer={4} floated="left">
            <Input
              icon="search"
              placeholder="Filtrado de clientes"
              value={searchValue}
              onChange={(e, data) => {
                handleSearchValue(data);
              }}
            />
          </Grid.Column>
          <Grid.Column mobile={16} computer={5} floated="left">
            {renderDatePicker()}
          </Grid.Column>
          <Grid.Column mobile={16} computer={3} floated="right">
            <Button
              primary
              disabled={!clients || !clients.length || !id || !date}
              onClick={() => {
                setShowConfirmation(true);
              }}
            >
              Imprimir facturas
            </Button>
          </Grid.Column>
        </Grid>
        <Container fluid textAlign="center" className="mh-vh-100 mt-2">
          {showError ? (
            <Message negative>
              <Message.Header>{errorHeader}</Message.Header>
              <p>{errorMessage}</p>
            </Message>
          ) : null}
          <Clients
            columns={columns}
            clients={filteredClients}
            handleTogglePrintBilling={handleTogglePrintBilling}
            renderActions={renderActions}
            renderProductInTable={renderProductInTable}
            renderBillCheckbox={renderBillCheckbox}
            onDragEnd={onDragEnd}
          />
        </Container>
      </div>
    );
  };

  return (
    <div>
      <Confirm
        open={showConfirmationDelete}
        header="Eliminar cliente"
        content="Esta acción eliminará al cliente"
        confirmButton="Si, eliminar"
        cancelButton="No, volver"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmationDelete}
      />
      <Confirm
        open={showConfirmation}
        header="Imprimir facturas"
        content="Esta acción enviará a generar las facturas"
        confirmButton="Generar las facturas"
        cancelButton="Volver"
        onCancel={handleCancel}
        onConfirm={handleConfirmation}
      />
      <SearchProductModal
        client={clientToAddProduct}
        open={showProductModal}
        onClose={handleCloseProductModal}
      />
      <PrintBillingModal
        id={id}
        date={date}
        open={showPrintBillingModal}
        clients={filteredClients}
        onClose={handleClosePrintBilling}
      />
      <TableSettingsModal
        columns={columns}
        open={showTableSettings}
        onClose={handleCloseTableSettings}
      />
      <AssignClientsModal
        id={id}
        open={showAssignModalClients}
        onClose={handleCloseAssignClientsModal}
      />
      <EditClientModal
        id={id}
        open={showEditClientModal}
        client={clientToEdit}
        onClose={handleCloseEditClientsModal}
      />
      <Container
        style={{ marginTop: "7em", width: realColumnCount > 9 ? "90%" : "" }}
        textAlign="center"
        minheight="100%"
      >
        <Header as="h1" inverted textAlign="center">
          Listado de clientes
        </Header>
        <Grid>
          <Grid.Column floated="left" width={3}>
            <Button
              icon
              labelPosition="left"
              primary
              disabled={!clients || !clients.length}
              onClick={() => {
                setShowTableSettings(true);
              }}
            >
              <Icon name="setting" />
              Configurar tabla
            </Button>
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <Link className="ui primary button" to={`/facturas/rutas/${id}`}>
              Ver Historial
            </Link>
            <Button
              primary
              onClick={() => {
                setShowAssignModalClients(true);
              }}
            >
              Asignar clientes
            </Button>
          </Grid.Column>
        </Grid>
        <Divider />
        {loading
          ? renderLoading()
          : clients.length
          ? renderClients()
          : renderNoClients()}
      </Container>
    </div>
  );
};
