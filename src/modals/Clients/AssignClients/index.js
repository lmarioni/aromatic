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
  Form,
  FormGroup,
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [cif, setCif] = useState("");
  const [nombreFantasia, setNombreFantasia] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [cpostal, setCpostal] = useState("");
  const [telefono, setTelefono] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [email, setEmail] = useState("");

  useEffect(function () {
    resetForm();
  }, []);

  const resetForm = () => {
    setCollapsedInfo(true);
    setUploadingFile(false);
    setActiveIndex(0);
    setNewClients([]);
    setCodigo("");
    setCif("");
    setNombreFantasia("");
    setNombre("");
    setApellido("");
    setDireccion("");
    setLocalidad("");
    setProvincia("");
    setCpostal("");
    setTelefono("");
    setTelefono2("");
    setEmail("");
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

    const parsedBody =
      activeIndex === 0
        ? JSON.stringify(newClients)
        : JSON.stringify([
            {
              idruta: id,
              codigo,
              cif,
              nombreFantasia,
              nombre,
              apellido,
              direccion,
              localidad,
              provincia,
              cpostal,
              telefono,
              telefono2,
              email,
            },
          ]);
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: parsedBody,
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
  const renderNew = () => (
    <Form>
      <FormGroup widths="equal">
        <Form.Input
          fluid
          value={codigo}
          onChange={(e, { value }) => {
            setCodigo(value);
          }}
          label="Código"
          placeholder="Código"
        />
        <Form.Input
          fluid
          value={cif}
          onChange={(e, { value }) => {
            setCif(value);
          }}
          label="CIF"
          placeholder="CIF"
        />
      </FormGroup>
      <FormGroup widths="equal">
        <Form.Input
          fluid
          value={nombreFantasia}
          onChange={(e, { value }) => {
            setNombreFantasia(value);
          }}
          required
          label="Nombre Fantasia"
          placeholder="Nombre de fantasía"
        />
        <Form.Input
          fluid
          value={nombre}
          onChange={(e, { value }) => {
            setNombre(value);
          }}
          required
          label="Nombre"
          placeholder="Nombre"
        />
        <Form.Input
          fluid
          value={apellido}
          onChange={(e, { value }) => {
            setApellido(value);
          }}
          label="Apellido"
          placeholder="Apellido"
        />
      </FormGroup>
      <FormGroup widths="equal">
        <Form.Input
          fluid
          value={direccion}
          onChange={(e, { value }) => {
            setDireccion(value);
          }}
          label="Direccion"
          placeholder="Direccion"
        />
        <Form.Input
          fluid
          value={localidad}
          onChange={(e, { value }) => {
            setLocalidad(value);
          }}
          label="Localidad"
          placeholder="Localidad"
        />
        <Form.Input
          fluid
          value={provincia}
          onChange={(e, { value }) => {
            setProvincia(value);
          }}
          label="Provincia"
          placeholder="Provincia"
        />
        <Form.Input
          fluid
          value={cpostal}
          onChange={(e, { value }) => {
            setCpostal(value);
          }}
          label="Código postal"
          placeholder="CPostal"
        />
      </FormGroup>
      <FormGroup widths="equal">
        <Form.Input
          fluid
          value={telefono}
          onChange={(e, { value }) => {
            setTelefono(value);
          }}
          label="Telefono"
          placeholder="Telefono"
        />
        <Form.Input
          fluid
          value={telefono2}
          onChange={(e, { value }) => {
            setTelefono2(value);
          }}
          label="Telefono2"
          placeholder="Telefono alternativo"
        />
        <Form.Input
          fluid
          value={email}
          onChange={(e, { value }) => {
            setEmail(value);
          }}
          label="Email"
          placeholder="Email"
        />
      </FormGroup>
    </Form>
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
    {
      menuItem: "Crear nuevo",
      render: () => <Tab.Pane>{renderNew()}</Tab.Pane>,
    },
  ];

  return (
    <Modal size="small" open={open}>
      <Header content="Asignar clientes a la ruta" />
      <Modal.Content scrolling>
        <Tab
          activeIndex={activeIndex}
          onTabChange={(e, data) => {
            setActiveIndex(data.activeIndex);
          }}
          panes={panes}
        />
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
          disabled={
            activeIndex === 0
              ? !newClients || !newClients.length
              : !nombre && !nombreFantasia
          }
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
