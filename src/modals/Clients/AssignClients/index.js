import React, { useEffect, useContext, useState } from "react";
import {
  Header,
  Button,
  Segment,
  Icon,
  Table,
  Modal,
  Message,
  Tab,
} from "semantic-ui-react";
import { ExcelRenderer } from "react-excel-renderer";
import { Context } from "../../../Context";

const AssignClientsModal = ({ id, open, onClose }) => {
  const { token } = useContext(Context);
  const [newClients, setNewClients] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [showErrorUploading, setShowErrorUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [collapsedInfo, setCollapsedInfo] = useState(true);
  const [uploaderMode, setUploaderMode] = useState(true);

  useEffect(function () {
    resetForm();
  }, []);

  const resetForm = () => {
    setCollapsedInfo(true);
    setUploadingFile(false);
    setNewClients([]);
  };

  const handleRemoveRow = (row, index) => {
    const newClientsFiltered = newClients.filter((client) => client !== row);
    if (newClientsFiltered) {
      setNewClients(newClientsFiltered);
    }
  };

  const handleClickFileUpload = () => {
    resetForm();
    document.getElementById("uploadXls").value = "";
    document.getElementById("uploadXls").click();
  };

  const handleCloseAssignClientsModal = (clients = []) => {
    resetForm();
    onClose(clients);
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
        resp.rows.shift();
        const newClientsParsed = resp.rows
          .filter((row) => row.length)
          .map((routeRow) => {
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
        setNewClients(newClientsParsed);
      }
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
      body: JSON.stringify(newClients),
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/clientes`,
      requestOptions
    );

    const parsedResponse = await response.json();

    if (parsedResponse.status === "success") {
      setLoadingButton(false);
      handleCloseAssignClientsModal(parsedResponse.clientes);
    } else {
      handleCloseAssignClientsModal();
      setLoadingButton(false);
    }
  };
  const renderNewClients = () => (
    <div>
      <Header content="Vista resumida de los datos" />
      <Table basic="very" celled compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Localidad</Table.HeaderCell>
            <Table.HeaderCell>Quitar</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {newClients &&
            newClients.length &&
            newClients.map((newRoute, index) => {
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
                  <Table.Cell>
                    <Icon
                      onClick={() => {
                        handleRemoveRow(newRoute, index);
                      }}
                      className="pointer"
                      name="remove"
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
      {collapsedInfo && newClients.length > 6 && (
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

  const renderUploader = () => (
    <div>
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
          onClick={resetForm}
          disabled={!newClients.length}
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
        {newClients && newClients.length ? (
          renderNewClients()
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
    </div>
  );

  const renderCreateNew = () => <h2>Work in progress</h2>;

  const panes = [
    {
      menuItem: "Importador",
      render: () => <Tab.Pane>{renderUploader()}</Tab.Pane>,
    },
  ];

  return (
    <Modal size="small" open={open}>
      <Header content="Asignar clientes a la ruta" />
      <Modal.Content scrolling>
        <Tab panes={panes} />
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          onClick={() => {
            handleCloseAssignClientsModal();
          }}
        >
          <Icon name="remove" /> Cancelar
        </Button>
        <Button
          disabled={!newClients || !newClients.length}
          primary
          onClick={handleSubmitAssignClients}
          loading={loadingButton}
        >
          <Icon name="checkmark" /> Guardar cambios
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AssignClientsModal;
