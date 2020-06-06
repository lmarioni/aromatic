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
  Modal,
  Message,
  Checkbox,
} from "semantic-ui-react";
import { useLocation } from "@reach/router";
import { ExcelRenderer } from "react-excel-renderer";
import Cookies from "js-cookie";

let defaultColumns = [
  { display: true, key: "cif", label: "cif" },
  { display: true, key: "cpostal", label: "cpostal" },
  { display: true, key: "nombreFantasia", label: "nombreFantasia" },
  { display: true, key: "localidad", label: "localidad" },
  { display: true, key: "direccion", label: "direccion" },
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
  const [loadingSettingsModal, setLoadingSettingsModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [showAssignModalClients, setShowAssignModalClients] = useState(false);
  const [showTableSettings, setShowTableSettings] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);
  const [showErrorUploading, setShowErrorUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newRoutes, setNewRoutes] = useState([]);
  const [collapsedInfo, setCollapsedInfo] = useState(true);
  const [columns, setColumns] = useState([]);

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
        fetchRoute({ id: routeId, q: query });
      }
    }

    const cachedColumns = Cookies.get("columns");
    if (!cachedColumns) {
      console.log({ defaultColumns });
      setColumns(defaultColumns);
    } else {
      setColumns(JSON.parse(cachedColumns));
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

  const fetchRoute = ({ id = 0, q = "" }) => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };
    let parsedParams = `idruta=${id}`;
    parsedParams = q ? `${parsedParams}&q=${q}` : parsedParams;
    fetch(`${process.env.REACT_APP_BASE_URL}/clientes?${parsedParams}`, data)
      .then((res) => res.json())
      .then((response) => {
        setClients(response);
        setLoading(false);
      });
  };

  const handleSubmitAssignClients = async () => {
    setLoadingButton(true);
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(newRoutes),
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/clientes`,
      requestOptions
    );

    const parsedResponse = await response.json();

    if (parsedResponse.status === "success") {
      setLoadingButton(false);
      setShowAssignModalClients(false);
      const allClients = clients;
      allClients.concat(newRoutes);
      handleCloseAssignClientsModal();
    } else {
      setShowAssignModalClients(false);
      setLoadingButton(false);
    }
  };

  const mergeRoutes = (newRoutes) => {
    const new_clients = clients.concat(newRoutes);
    setNewRoutes(new_clients);
  };

  const handleCloseTableSettings = () => {
    handleUpdateCookieColumns(columns);
    setShowTableSettings(false);
  };

  const handleCloseAssignClientsModal = () => {
    resetForm();
    setCollapsedInfo(true);
    setUploadingFile(false);
    mergeRoutes(newRoutes);
    setNewRoutes([]);
    setShowAssignModalClients(false);
  };

  const handleAssignClientsModal = () => setShowAssignModalClients(true);
  const handleManageTableSettings = () => setShowTableSettings(true);

  const handleSaveChangedColumns = () => {
    handleCloseTableSettings();
  };

  const handleClickFileUpload = () => {
    document.getElementById("uploadXls").click();
  };

  const handleClickResetFile = () => {
    setNewRoutes([]);
  };

  const handleFileUpload = (event) => {
    let fileObj = event.target.files[0];
    setUploadingFile(true);
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        setUploadingFile(false);
        setShowErrorUploading(true);
      } else {
        setUploadingFile(false);
        const header = resp.rows.shift();
        const newRoutesParsed = resp.rows.map((routeRow) => {
          return {
            idruta: id,
            codigo: routeRow[0],
            nombreFantasia: routeRow[1],
            nombre: routeRow[2],
            apellido: routeRow[3],
            cif: routeRow[5],
            direccion: routeRow[6],
            localidad: routeRow[7],
            cpostal: routeRow[8],
            provincia: routeRow[9],
            telefono: routeRow[10],
            telefono2: routeRow[11],
            email: routeRow[12],
          };
        });
        setNewRoutes(newRoutesParsed);
      }
    });
  };

  const resetForm = () => {
    setCollapsedInfo(true);
    setNewRoutes([]);
  };

  const renderNoClients = () => (
    <Segment secondary textAlign="center" style={{ marginTop: "7em" }}>
      <Header icon>
        <Icon name="search" />
        Parece que no hay clientes cargados para esta ruta
      </Header>
      <Segment.Inline>
        <Button primary onClick={handleAssignClientsModal}>
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

  const renderNewRoutes = () => (
    <div>
      <Header content="Vista resumida de los datos" />
      <Table basic="very" celled compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Localidad</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {newRoutes &&
            newRoutes.length &&
            newRoutes.map((newRoute, index) => {
              return (
                <Table.Row
                  key={`rowRoute${newRoute.idruta}-${index}`}
                  hidden={index > 6 && collapsedInfo}
                >
                  <Table.Cell>
                    <Header as="h4">
                      <Header.Content>{newRoute.nombre}</Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{newRoute.localidad}</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
      {collapsedInfo && (
        <Message
          className="pointer"
          color="blue"
          onClick={() => {
            setCollapsedInfo(false);
          }}
        >
          Ver más
        </Message>
      )}
    </div>
  );

  const handleToggleDisplay = (data, index) => {
    console.log({ data, index });
    const newColumns = columns;
    newColumns[index].display = !newColumns[index].display;
    setColumns(newColumns);
    setLoadingSettingsModal(false);

    // console.log(changedIndex);
    // const newColumns = columns;
    // newColumns[changedIndex].display = !newColumns[changedIndex].display;
    // setColumns(newColumns);
    //handleUpdateCookieColumns(columns);
  };

  const renderModalTableSettings = () => (
    <Modal open={showTableSettings} size="tiny" closeOnDocumentClick={true}>
      <Modal.Header>Configuración de tabla</Modal.Header>
      <Modal.Content textAlign="center" scrolling>
        {loadingSettingsModal ? (
          <Dimmer active inverted>
            <Loader inverted>Cargando columnas</Loader>
          </Dimmer>
        ) : (
          <Table basic celled collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Mostrar columna</Table.HeaderCell>
                <Table.HeaderCell>Columna</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {columns.map((column, index) => {
                return (
                  <Table.Row key={`column-[${column.label}]-${index}`}>
                    <Table.Cell>
                      <Checkbox
                        onClick={(event, data) => {
                          setLoadingSettingsModal(true);
                          handleToggleDisplay(data, index);
                        }}
                        disabled={index < 4}
                        defaultChecked={column.display}
                        label="Mostrar columna"
                        slider
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>{column.label}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={handleCloseTableSettings}>
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );

  const renderModalAssignClients = () => (
    <Modal size="small" open={showAssignModalClients}>
      <Header content="Asignar clientes a la ruta" />
      <Modal.Content scrolling>
        <div className="action-container space-between">
          <Button
            icon
            basic
            primary
            labelPosition="left"
            onClick={handleClickFileUpload}
            loading={uploadingFile}
          >
            <Icon name="file excel" />
            Subir archivo xlsx
          </Button>
          <Button
            icon
            basic
            secondary
            labelPosition="left"
            onClick={handleClickResetFile}
            disabled={!newRoutes.length}
          >
            <Icon name="erase" />
            Limpiar archivo
          </Button>
        </div>
        <input
          id="uploadXls"
          type="file"
          accept=".xls,.xlsx"
          hidden
          onChange={handleFileUpload}
          style={{ padding: "10px" }}
        />
        <Segment
          color={showErrorUploading ? "red" : "blue"}
          style={{ marginTop: "2em" }}
          placeholder
          textAlign="center"
        >
          {newRoutes && newRoutes.length ? (
            renderNewRoutes()
          ) : !showErrorUploading ? (
            <Header icon>
              <Icon name="excel file outline" />
              Aqui podrá ver una vista resumida del archivo a subir
            </Header>
          ) : (
            <Header icon>
              <Icon name="excel file outline" />
              Hubo un error al subir el archivo, revise que sea un archivo XLS o
              XLSX e intentelo nuevamente.
            </Header>
          )}
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={handleCloseAssignClientsModal}>
          <Icon name="remove" /> Cancelar
        </Button>
        <Button
          disabled={!newRoutes || !newRoutes.length}
          primary
          onClick={handleSubmitAssignClients}
          loading={loadingButton}
        >
          <Icon name="checkmark" /> Guardar cambios
        </Button>
      </Modal.Actions>
    </Modal>
  );

  const renderClients = () => {
    return (
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
          {clients.map((client) => {
            return (
              <Table.Row key={`client${client.id}row`}>
                {columns.map((column) => {
                  if (column.display) {
                    return (
                      <Table.Cell key={`${client.id}[${column.label}]`}>
                        {client[column.key]}
                      </Table.Cell>
                    );
                  }
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  };

  return (
    <div>
      {renderModalTableSettings()}
      {renderModalAssignClients()}
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
              onClick={handleManageTableSettings}
            >
              <Icon name="setting" />
              Configurar tabla
            </Button>
          </Grid.Column>
          <Grid.Column width={4}>
            <Button primary>Asignar reparto</Button>
          </Grid.Column>
          <Grid.Column floated="right" width={4}>
            <Button primary onClick={handleAssignClientsModal}>
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
