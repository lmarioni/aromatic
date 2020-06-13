import React, { useEffect, useContext, useState } from "react";
import {
  Header,
  Button,
  Segment,
  Icon,
  Modal,
  Form,
  Grid,
  Loader,
  Tab,
  Search,
  Item,
} from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";
import { debounce } from "../../utils";

const ProductCreationModal = ({ id, open, onClose, search = false }) => {
  const { token } = useContext(Context);
  const [newProduct, setNewProduct] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioCosto, setPrecioCosto] = useState(0);
  const [iva, setIva] = useState(null);
  const [ivaSelected, setIvaSelected] = useState(null);
  const [ivaList, setIvaList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(function () {
    fetchIva();
    resetForm();
  }, []);

  const fetchIva = () => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/configuracion/ivas`, data)
      .then((res) => res.json())
      .then((response) => {
        setIvaList(response);
        setLoading(false);
      });
  };

  const fetchProducts = async (q = "") => {
    const data = {
      headers: new Headers({ Authorization: "Bearer " + token }),
    };

    return fetch(
      `${process.env.REACT_APP_BASE_URL}/productos${q ? `?q=${q}` : "/"}`,
      data
    );
  };

  const resetForm = () => {
    setCodigo("");
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setPrecioCosto(0);
    setIva(null);
    setIvaSelected(null);
    setLoadingButton(false);
    setNewProduct([]);
    setFilteredResults([]);
    setSearchValue("");
    setLoadingSearch(false);
  };

  const handleCloseProductCreationModal = (product = {}) => {
    resetForm();
    onClose(product);
  };

  const handleSubmit = async (event) => {
    setLoadingButton(true);
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        codigo: codigo,
        precioCosto: precioCosto,
        descripcion: descripcion,
        nombre: nombre,
        precio: precio,
        iva: iva,
      }),
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/productos`,
      requestOptions
    );

    const parsedResponse = await response.json();

    if (parsedResponse.status === "success") {
      setLoadingButton(false);
      handleCloseProductCreationModal(parsedResponse.producto);
    } else {
      handleCloseProductCreationModal();
      setLoadingButton(false);
    }
  };

  const handleIvaChange = (e, { value }) => {
    setIva(value);
    const ivaFound = ivaList.find((iva) => iva.id === value);
    if (ivaFound) {
      setIvaSelected(ivaFound);
    }
  };

  const handleSelected = (product) => {
    handleCloseProductCreationModal(product);
  };

  const handleSearchChange = async (value) => {
    setLoadingSearch(true);
    setSearchValue(value);
    const prods = await (await fetchProducts(value)).json();
    setFilteredResults(prods);
    setLoadingSearch(false);
  };

  const resultRenderer = ({
    codigo,
    descripcion,
    id,
    nombre,
    precio,
    precioCosto,
    iva,
    userid,
  }) => (
    <Item>
      <Item.Content>
        <Item.Header as="a">{nombre}</Item.Header>
        <Item.Description>{descripcion}</Item.Description>
        <Item.Extra>Precio ${precio}</Item.Extra>
      </Item.Content>
    </Item>
  );

  const renderSearchProduct = () => (
    <Search
      fluid
      loading={loadingSearch}
      results={filteredResults}
      onSearchChange={(e, { value }) => {
        debounce(handleSearchChange(value), 200);
      }}
      onResultSelect={(e, { result }) => {
        handleSelected(result);
      }}
      resultRenderer={resultRenderer}
      value={searchValue}
      showNoResults={false}
      noResultsMessage="Producto no encontrado"
    />
  );

  const renderNewProduct = () => (
    <Form>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Group inline>
              <Form.Field>
                <label>Código</label>
                <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  name="codigo"
                  type="text"
                  placeholder="Código para el producto"
                />
              </Form.Field>
            </Form.Group>
          </Grid.Column>
          <Grid.Column width={8}>
            <Form.Group inline>
              <Form.Field>
                <label>Nombre</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  name="nombre"
                  type="text"
                  placeholder="Nombre para el producto"
                />
              </Form.Field>
            </Form.Group>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Group inline>
              <Form.Field>
                <label>Precio</label>
                <input
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  name="precio"
                  type="number"
                  min="0"
                  placeholder="Ingrese aquí el precio para el nuevo producto"
                />
              </Form.Field>
            </Form.Group>
          </Grid.Column>
          <Grid.Column width={8}>
            <Form.Group inline>
              <Form.Field>
                <label>Costo</label>
                <input
                  value={precioCosto}
                  onChange={(e) => setPrecioCosto(e.target.value)}
                  name="precioCosto"
                  type="number"
                  min="0"
                  placeholder="Ingrese aquí el precio costo para el nuevo producto"
                />
              </Form.Field>
            </Form.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Group inline>
              <label>Iva</label>
              {loading ? (
                <Loader inverted />
              ) : (
                ivaList.map((eachIva, index) => {
                  return (
                    <div key={`iva-${index}`}>
                      <Form.Radio
                        label={eachIva.texto}
                        value={eachIva.id}
                        checked={iva === eachIva.id}
                        onChange={handleIvaChange}
                      />
                    </div>
                  );
                })
              )}
            </Form.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.TextArea
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del producto"
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Segment
              placeholder
              textAlign="center"
              style={{ marginTop: "1.5em" }}
            >
              Precio total percibido por los clientes: $
              {ivaSelected !== null && ivaSelected.porcentaje
                ? ivaSelected.porcentaje * precio
                : precio}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );

  const handleTabChange = (e, { activeIndex }) => {
    setActiveIndex(activeIndex);
  };

  const panes = [
    {
      menuItem: "Buscar producto",
      render: () => (
        <Tab.Pane className="customPane">{renderSearchProduct()}</Tab.Pane>
      ),
    },
    {
      menuItem: "Crear producto",
      render: () => (
        <Tab.Pane className="customPane">{renderNewProduct()}</Tab.Pane>
      ),
    },
  ];

  const renderSearchTab = () => (
    <Tab
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
      panes={panes}
    />
  );

  const renderModal = () => (
    <Modal size="small" open={open}>
      <Header
        content={
          search ? "Búsqueda / Creación de producto" : "Creación de producto"
        }
      />
      <Modal.Content scrolling>
        {search ? renderSearchTab() : renderNewProduct()}
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          onClick={() => {
            handleCloseProductCreationModal();
          }}
        >
          <Icon name="remove" /> Cancelar
        </Button>
        {(!search || activeIndex === 1) && (
          <Button
            primary
            onClick={handleSubmit}
            loading={loadingButton}
            disabled={
              !search || activeIndex === 1
                ? !precioCosto || !nombre || !precio || !iva
                : true
            }
          >
            <Icon name="checkmark" /> Guardar producto
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );

  return <div>{renderModal()}</div>;
};

export default ProductCreationModal;
