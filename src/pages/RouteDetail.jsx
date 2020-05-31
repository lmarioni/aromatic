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
} from "semantic-ui-react";
import { useLocation } from "@reach/router";
import { ExcelRenderer } from "react-excel-renderer";

export const RouteDetail = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [showAssignModalClients, setShowAssignModalClients] = useState(false);
  const [
    loadingSubmitAssignClientsButton,
    setLoadingSubmitAssignClientsButton,
  ] = useState(false);
  const [showErrorUploading, setShowErrorUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newRoutes, setNewRoutes] = useState([]);
  const [collapsedInfo, setCollapsedInfo] = useState(true);

  const params = useLocation().search.substr(1).split("&");

  useEffect(function () {
    if (params && params.length) {
      const routeId = params[0].split("=")[1];
      const query = params.length > 1 ? params[1].split("=")[1] : "";
      if (routeId) {
        fetchRoute({ id: routeId, q: query });
      }
    }
  }, []);

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

  const handleSubmitAssignClients = () => {
    console.log("Submit!");
    setShowAssignModalClients(false);
  };

  const handleCloseAssignClientsModal = () => {
    resetForm();
    setCollapsedInfo(true);
    setUploadingFile(false);
    setNewRoutes([]);
    setShowAssignModalClients(false);
  };

  const handleAssignClientsModal = () => setShowAssignModalClients(true);

  const handleClickFileUpload = () => {
    document.getElementById("uploadXls").click();
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
        console.log(resp.rows);
        console.log(header);
        const newRoutesParsed = resp.rows.map((routeRow) => {
          return {
            idruta: routeRow[0],
            nombreFantasia: routeRow[1],
            nombre: routeRow[2],
            apellido: routeRow[3],
            cif: routeRow[5],
            direccion: routeRow[6],
            localidad: routeRow[7],
            cpostal: routeRow[8],
            telefono: routeRow[10],
            email: routeRow[12],
          };
        });
        setNewRoutes(newRoutesParsed);
      }
    });
  };

  const resetForm = () => {
    console.log("reset");
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
                  key={`rowNewRoute${newRoute.idruta}`}
                  hidden={index > 10 && collapsedInfo}
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
          Ver mas
        </Message>
      )}
    </div>
  );

  const renderModalAssignClients = () => (
    <Modal size="small" open={showAssignModalClients}>
      <Header content="Asignar clientes a la ruta" />
      <Modal.Content>
        <div>
          <Button
            icon
            basic
            color="green"
            labelPosition="left"
            onClick={handleClickFileUpload}
            loading={uploadingFile}
          >
            <Icon name="file excel" />
            Subir archivo xlsx
          </Button>
        </div>
        <input
          id="uploadXls"
          type="file"
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
              Aqui podrá ver una vista resumida de los datos a subir
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
          color="green"
          onClick={handleSubmitAssignClients}
          loading={loadingSubmitAssignClientsButton}
        >
          <Icon name="checkmark" /> Guardar cambios
        </Button>
      </Modal.Actions>
    </Modal>
  );

  const renderClients = () => {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>id</Table.HeaderCell>
            <Table.HeaderCell>cif</Table.HeaderCell>
            <Table.HeaderCell>cpostal</Table.HeaderCell>
            <Table.HeaderCell>nombreFantasia</Table.HeaderCell>
            <Table.HeaderCell>nombre</Table.HeaderCell>
            <Table.HeaderCell>apellido</Table.HeaderCell>
            <Table.HeaderCell>direccion</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>localidad</Table.HeaderCell>
            <Table.HeaderCell>telefono</Table.HeaderCell>
            <Table.HeaderCell>telefono2</Table.HeaderCell>
            <Table.HeaderCell>userid</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {clients.map((client) => {
            return (
              <Table.Row key={`client${client.id}row`}>
                <Table.Cell>{client.id}</Table.Cell>
                <Table.Cell>{client.cif}</Table.Cell>
                <Table.Cell>{client.cpostal}</Table.Cell>
                <Table.Cell>{client.nombreFantasia}</Table.Cell>
                <Table.Cell>{client.nombre}</Table.Cell>
                <Table.Cell>{client.apellido}</Table.Cell>
                <Table.Cell>{client.direccion}</Table.Cell>
                <Table.Cell>{client.email}</Table.Cell>
                <Table.Cell>{client.localidad}</Table.Cell>
                <Table.Cell>{client.telefono}</Table.Cell>
                <Table.Cell>{client.telefono2}</Table.Cell>
                <Table.Cell>{client.userid}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  };

  return (
    <div>
      {renderModalAssignClients()}
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Ruta / Listado de clientes
        </Header>
        <Grid>
          <Grid.Column floated="left" width={4}>
            <Button primary>Imprimir facturas</Button>
          </Grid.Column>
          <Grid.Column floated="center" width={4}>
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
