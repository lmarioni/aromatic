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
  Divider,
  Search,
  Transition,
  List,
  Item,
} from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";
import { debounce } from "../../utils";

const emptyNewProduct = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: 0,
  precioCosto: 0,
  iva: null,
};

const SearchProductModal = ({ id, open, onClose }) => {
  const { token } = useContext(Context);
  const [newProduct, setNewProduct] = useState(emptyNewProduct);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [ivaList, setIvaList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  //   const [codigo, setCodigo] = useState("");
  //   const [nombre, setNombre] = useState("");
  //   const [descripcion, setDescripcion] = useState("");
  //   const [precio, setPrecio] = useState(0);
  //   const [precioCosto, setPrecioCosto] = useState(0);
  //   const [iva, setIva] = useState(null);
  //   const [ivaSelected, setIvaSelected] = useState(null);

  useEffect(function () {
    fetchIva();
    resetForm();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoadingSearch(true);
      const prods = await (await fetchProducts(searchValue)).json();
      setFilteredResults(prods);
      setLoadingSearch(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const fetchProducts = async (q = "") => {
    const data = {
      headers: new Headers({ Authorization: "Bearer " + token }),
    };

    return fetch(
      `${process.env.REACT_APP_BASE_URL}/productos${q ? `?q=${q}` : "/"}`,
      data
    );
  };

  const fetchIva = () => {
    setLoading(true);
    const data = {
      headers: new Headers({ Authorization: "Bearer " + token }),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/configuracion/ivas`, data)
      .then((res) => res.json())
      .then((ivaListFetched) => {
        setIvaList(ivaListFetched);
        setLoading(false);
      });
  };

  const resetForm = () => {
    setTimeout(0);
    setLoadingButton(false);
    setNewProduct([]);
  };

  const handleCloseSearchProductModal = (product = {}) => {
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
      body: JSON.stringify({}),
    };

    //const response = await fetch( `${process.env.REACT_APP_BASE_URL}/productos`, requestOptions );

    //const parsedResponse = await response.json();

    // if (parsedResponse.status === "success") {
    //   setLoadingButton(false);
    //   handleCloseSearchProductModal(parsedResponse.producto);
    // } else {
    //   handleCloseSearchProductModal();
    //   setLoadingButton(false);
    // }
  };

  const handleIvaChange = (e, { value }) => {
    setIva(value);
    const ivaFound = ivaList.find((iva) => iva.id === value);
    if (ivaFound) {
      setIvaSelected(ivaFound);
    }
  };
  const handleSelected = (product) => {
    console.log("Seleccionadoo: ", product);
  };

  const handleSearchChange = async (value) => {
    setSearchValue(value);
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
        debounce(handleSearchChange(value), 50);
      }}
      onResultSelect={(e, { result }) => {
        handleSelected(result);
      }}
      placeholder="Agregar productos creados..."
      resultRenderer={resultRenderer}
      value={searchValue}
      showNoResults={false}
      noResultsMessage="Producto no encontrado"
    />
  );
  const renderLoading = () => <Loader inverted />;
  const renderModalContent = () => (
    <Segment placeholder className="modalContent">
      <Grid columns={2} stackable textAlign="center">
        <Divider vertical>O</Divider>
        <Grid.Row verticalAlign="middle">
          <Grid.Column>{renderSearchProduct()}</Grid.Column>
          <Grid.Column>
            <Button primary>Crear uno nuevo</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid stackable>
        <Grid.Row verticalAlign="middle">
          <Transition.Group
            as={List}
            duration={200}
            divided
            size="huge"
            verticalAlign="middle"
          >
            {productList.map((product) => (
              <List.Item key={product}>
                <List.Content header={product.nombre} />
              </List.Item>
            ))}
          </Transition.Group>
        </Grid.Row>
      </Grid>
    </Segment>
  );

  const renderModal = () => (
    <Modal size="small" open={open}>
      <Header content="Búsqueda / Creación de producto" />
      <Modal.Content scrolling>
        {loading ? renderLoading() : renderModalContent()}
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          onClick={() => {
            handleCloseSearchProductModal();
          }}
        >
          <Icon name="remove" /> Cancelar
        </Button>
        <Button primary onClick={handleSubmit} loading={loadingButton}>
          <Icon name="checkmark" /> Guardar cambios
        </Button>
      </Modal.Actions>
    </Modal>
  );

  return <div>{renderModal()}</div>;
};

export default SearchProductModal;
