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
  Table,
  Divider,
  Grid,
  Label,
  Input,
  Checkbox,
} from "semantic-ui-react";
import { useLocation } from "@reach/router";
import Cookies from "js-cookie";
import AssignClientsModal from "../modals/Clients/AssignClients";
import TableSettingsModal from "../modals/Clients/TableSettings";
import { searchInArr } from "../utils";
import PrintBillingModal from "../modals/Billing";
import SearchProductModal from "../modals/SearchProducts";

let defaultColumns = [
  { display: true, key: "cif", label: "cif" },
  { display: true, key: "nombreFantasia", label: "nombreFantasia" },
  { display: true, key: "direccion", label: "direccion" },
  { display: true, key: "localidad", label: "localidad" },
  { display: true, key: "nombreproducto", label: "producto" },
  { display: true, key: "precio", label: "precio" },
  { display: true, key: "precioCosto", label: "precio costo" },
  { display: true, key: "facturar", label: "facturar" },
  { display: true, key: "cpostal", label: "cpostal" },
  { display: false, key: "idruta", label: "idruta" },
  { display: false, key: "codigo", label: "codigo" },
  { display: false, key: "nombre", label: "nombre" },
  { display: false, key: "apellido", label: "apellido" },
  { display: false, key: "cpostal", label: "cpostal" },
  { display: false, key: "provincia", label: "provincia" },
  { display: false, key: "telefono", label: "telefono" },
  { display: false, key: "telefono2", label: "telefono2" },
  { display: false, key: "email", label: "email" },
];

export const RouteDetail = () => {
  const [id, setId] = useState(0);
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showAssignModalClients, setShowAssignModalClients] = useState(false);
  const [showPrintBillingModal, setShowPrintBillingModal] = useState(false);
  const [showTableSettings, setShowTableSettings] = useState(false);
  const [columns, setColumns] = useState([]);
  const [clientToAddProduct, setClientToAddProduct] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const params = useLocation().search.substr(1).split("&");

  const handleUpdateCookieColumns = (newValue) => {
    Cookies.set("columns", newValue);
  };

  useEffect(function () {
    if (params && params.length) {
      const routeId = params[0].split("=")[1];
      const query = params.length > 1 ? params[1].split("=")[1] : "";
      if (routeId) {
        setId(parseInt(routeId));
        fetchData({ id: routeId, q: query });
      }
    }

    const cachedColumns = Cookies.get("columns");

    if (!cachedColumns) {
      setColumns(defaultColumns);
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
    }
  }, []);

  useEffect(
    function () {
      if (columns.length) {
        handleUpdateCookieColumns(columns);
      }
    },
    [columns]
  );

  const fetchData = async ({ id = 0, q = "" }) => {
    setLoading(true);
    const data = {
      headers: new Headers({ Authorization: "Bearer " + token }),
    };
    const prodArr = await (await fetchProducts(data)).json();
    setProducts(prodArr);
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

  const mergeRoutes = (newRoutes = []) => {
    const new_clients = clients.concat(newRoutes);
    setClients(new_clients);
    setFilteredClients(new_clients);
  };

  const handleClosePrintBilling = () => {
    setShowPrintBillingModal(false);
  };

  const handleCloseTableSettings = (newColumns = []) => {
    if (newColumns && newColumns.length) {
      setColumns(newColumns);
      handleUpdateCookieColumns(newColumns);
    }
    setShowTableSettings(false);
  };

  const handleCloseAssignClientsModal = (newRoutes = []) => {
    mergeRoutes(newRoutes);
    setShowAssignModalClients(false);
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
            (sum, { producto, cantidad }) => sum + producto.precio,
            0
          );
          client.precioCosto = newProductList.reduce(
            (sum, { producto, cantidad }) => sum + producto.precioCosto,
            0
          );
          client.facturar = true;
        }
        return client;
      });
      setClients(newClients);
      setFilteredClients(newClients);
    }
    setSearchValue("");
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

  const renderBillCheckbox = (client = {}) => (
    <Checkbox
      defaultChecked={true}
      onClick={() => {
        handleToggleBilling(client);
      }}
      label={client.facturar ? "Facturar" : "No facturar"}
      slider
    />
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
      <Loader inverted>Cargando datos</Loader>
    </Dimmer>
  );

  const renderClients = () => {
    return (
      <Container textAlign="center">
        <Grid>
          <Grid.Column width={4} floated="left">
            <Input
              icon="search"
              placeholder="Filtrado de clientes"
              value={searchValue}
              onChange={(e, data) => {
                handleSearchValue(data);
              }}
            />
          </Grid.Column>
          <Grid.Column width={4} floated="right">
            <Button
              primary
              disabled={!clients || !clients.length}
              onClick={() => {
                setShowPrintBillingModal(true);
              }}
            >
              Imprimir facturas
            </Button>
          </Grid.Column>
        </Grid>

        <Table size="small" celled selectable>
          <Table.Header>
            <Table.Row>
              {columns.map((column, index) => {
                if (column.display) {
                  return (
                    <Table.HeaderCell key={`main-column-${column}-${index}`}>
                      {column.label}
                    </Table.HeaderCell>
                  );
                }
              })}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredClients.map((client) => {
              return (
                <Table.Row key={`client${client.id}row`}>
                  {columns.map((column) => {
                    if (column.display) {
                      return (
                        <Table.Cell
                          key={`row-${client.id}[${column.label}]`}
                          className={`${column.key}`}
                        >
                          {column.key === "nombreproducto"
                            ? renderProductInTable(client, client[column.key])
                            : column.key === "facturar"
                            ? renderBillCheckbox(client)
                            : client[column.key]}
                        </Table.Cell>
                      );
                    }
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Container>
    );
  };

  return (
    <div>
      <SearchProductModal
        client={clientToAddProduct}
        open={showProductModal}
        onClose={handleCloseProductModal}
      />
      <PrintBillingModal
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
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Ruta / Listado de clientes
        </Header>
        <Grid>
          <Grid.Column floated="left" width={4}>
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
          <Grid.Column width={4}>
            {/* <Button primary>Asignar reparto</Button> */}
          </Grid.Column>
          <Grid.Column floated="right" width={4}>
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
