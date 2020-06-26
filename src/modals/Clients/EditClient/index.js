import React, { useEffect, useContext, useState } from "react";
import {
  Header,
  Button,
  Icon,
  Modal,
  Form,
  FormGroup,
} from "semantic-ui-react";
import { Context } from "../../../Context";

const EditClientModal = ({ id, open, onClose, client = {} }) => {
  const { token } = useContext(Context);
  const [loadingButton, setLoadingButton] = useState(false);
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

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    if (client && Object.keys(client).length) {
      setCodigo(client.codigo);
      setCif(client.cif);
      setNombreFantasia(client.nombreFantasia);
      setNombre(client.nombre);
      setApellido(client.apellido);
      setDireccion(client.direccion);
      setLocalidad(client.localidad);
      setProvincia(client.provincia);
      setCpostal(client.cpostal);
      setTelefono(client.telefono);
      setTelefono2(client.telefono2);
      setEmail(client.email);
    }
  }, [client]);

  const resetForm = () => {
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

  const handleCloseEditClient = (client = {}) => {
    resetForm();
    onClose(client);
  };

  const handleSubmitEditClient = async () => {
    setLoadingButton(true);

    const parsedBody = JSON.stringify({
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
    });
    const requestOptions = {
      method: "PUT",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: parsedBody,
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/clientes/${client.id}`,
      requestOptions
    );

    const parsedResponse = await response.json();

    if (parsedResponse.status === "success") {
      setLoadingButton(false);

      const editedClient = {
        ...parsedResponse.cliente
      };
      handleCloseEditClient(editedClient);
    } else {
      handleCloseEditClient();
      setLoadingButton(false);
    }
  };

  const renderEdit = () => (
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

  return (
    <Modal size="small" open={open}>
      <Header content="Editar cliente" />
      <Modal.Content scrolling>{renderEdit()}</Modal.Content>
      <Modal.Actions>
        <Button
          basic
          onClick={() => {
            handleCloseEditClient();
          }}
        >
          <Icon name="remove" /> Cancelar
        </Button>
        <Button
          disabled={!nombre && !nombreFantasia}
          primary
          onClick={handleSubmitEditClient}
          loading={loadingButton}
        >
          <Icon name="checkmark" /> Guardar cambios
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default EditClientModal;
