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
  Item,
  List,
} from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";
import { debounce } from "../../utils";

const SearchProductModal = ({ id, open, onClose, client = {} }) => {
  const { token } = useContext(Context);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [ivaList, setIvaList] = useState([]);
  const [createMode, setCreateMode] = useState(false);
  const [filteredResults, setFilteredResults] = useState([
    { title: "", description: "" },
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [ivaSelected, setIvaSelected] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioCosto, setPrecioCosto] = useState(0);
  const [iva, setIva] = useState(null);

  useEffect(function () {
    fetchIva();
    resetForm();
  }, []);

  useEffect(
    function () {
      if (client && Object.keys(client).length && client.productos && client.productos.length) {
        const prods = client.productos.map(({ producto, cantidad }, index) => {
          return {
            producto: producto,
            cantidad: parseInt(cantidad),
          };
        });
        setProductList(prods);
      }
    },
    [client]
  );

  useEffect(() => {
    if (searchValue) {
      const delayDebounceFn = setTimeout(async () => {
        setLoadingSearch(true);
        const prods = await (await fetchProducts(searchValue)).json();
        setFilteredResults(prods);
        setLoadingSearch(false);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
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
    setSearchValue("");
    setCreateMode(false);
    setLoadingButton(false);
    setCodigo("");
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setPrecioCosto(0);
    setIva(null);
  };

  const handleCloseSearchProductModal = (pList = []) => {
    resetForm();
    onClose(pList);
  };

  const handleIvaChange = (e, { value }) => {
    setIva(value);
    const ivaFound = ivaList.find((iva) => iva.id === value);
    if (ivaFound) {
      setIvaSelected(ivaFound);
    }
  };
  const handleSelected = (product) => {
    const newProductList = !productList.find(
      (prod) => prod.producto.id === product.id
    )
      ? [...productList, ...[{ producto: product, cantidad: 1 }]]
      : productList.map((prod) => {
          if (prod.producto.id === product.id) {
            prod.cantidad = parseInt(prod.cantidad) + 1;
          }
          return prod;
        });
    setProductList(newProductList);
  };

  const handleCreateNewProductSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
      setCreateMode(false);
      const newProduct = parsedResponse.producto;
      newProduct.iva = ivaSelected;
      handleSelected(newProduct);
    } else {
      setLoadingButton(false);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    handleCloseSearchProductModal(productList);
  };

  const handleSearchChange = async (value) => {
    setSearchValue(value);
  };

  const handleAddSameProduct = (prodToRemove) => {
    const productToAddId = prodToRemove.producto.id;
    const newProductList = productList.map((prod) => {
      if (prod.producto.id === productToAddId) {
        prod.cantidad = prod.cantidad + 1;
      }
      return prod;
    });
    setProductList(newProductList);
  };
  const handleRemoveProduct = (prodToRemove) => {
    const productToRemove = prodToRemove.producto;
    const quantity = prodToRemove.cantidad;
    const newProductList =
      quantity > 1
        ? productList.map(({ producto, cantidad }) => {
            if (producto.id === productToRemove.id) {
              cantidad = cantidad - 1;
            }
            return { producto, cantidad };
          })
        : productList.filter((prod) => prod.producto.id !== productToRemove.id);

    setProductList(newProductList);
  };

  const renderSearchResult = ({
    codigo,
    descripcion,
    id,
    nombre,
    precio,
    precioCosto,
    iva,
    userid,
  }) => (
    <div>
      {loadingSearch || !nombre ? (
        <div>Buscando . . . </div>
      ) : (
        <Item>
          <Item.Content>
            <Item.Header as="a">{nombre}</Item.Header>
            <Item.Description>{descripcion}</Item.Description>
            <Item.Extra>Precio ${precio}</Item.Extra>
          </Item.Content>
        </Item>
      )}
    </div>
  );

  const renderSearchProduct = (title = "") => (
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
      placeholder="Buscar productos..."
      resultRenderer={renderSearchResult}
      value={searchValue}
      showNoResults={true}
      noResultsMessage="Producto no encontrado"
    />
  );
  const renderLoading = () => <Loader inverted />;
  const renderModalContent = () => (
    <div>
      <Segment placeholder>
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical>O</Divider>
          <Grid.Row verticalAlign="middle">
            <Grid.Column>{renderSearchProduct()}</Grid.Column>
            <Grid.Column>
              <Button
                primary
                disabled={createMode}
                onClick={() => setCreateMode(true)}
              >
                Crear uno nuevo
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {createMode && (
        <Segment placeholder loading={loading}>
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
                      ? (ivaSelected.porcentaje * parseInt(precio)) / 100 +
                        parseInt(precio)
                      : parseInt(precio)}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Button
                    color="green"
                    floated="right"
                    onClick={handleCreateNewProductSubmit}
                    loading={loadingButton}
                  >
                    <Icon name="checkmark" /> Guardar producto
                  </Button>
                  <Button
                    basic
                    floated="right"
                    onClick={() => {
                      setCreateMode(false);
                    }}
                  >
                    <Icon name="remove" /> Cancelar
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Segment>
      )}
      <Segment placeholder loading={loading}>
        {productList && productList.length ? (
          <List divided verticalAlign="middle" animated className="w-100">
            {productList.map((product) => (
              <List.Item key={product.producto}>
                <List.Content>
                  <List.Header as="h5">{`${product.producto.nombre} x ${product.cantidad}`}</List.Header>
                  <List.Description>
                    {product.producto.descripcion}
                    <List>
                      <List.Item as="h6">
                        <Icon name="euro" />
                        <List.Content>
                          <List.Header>{product.producto.precio}</List.Header>
                          <List.Description>
                            Precio actual del producto
                          </List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item as="h6">
                        <Icon name="euro" />
                        <List.Content>
                          <List.Header>
                            {product.producto.precioCosto}
                          </List.Header>
                          <List.Description>
                            Precio costo del producto
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </List.Description>
                </List.Content>
                <List.Content floated="right">
                  <Button
                    icon
                    labelPosition="left"
                    onClick={() => {
                      handleRemoveProduct(product);
                    }}
                  >
                    <Icon name="minus" />
                    Quitar producto
                  </Button>
                  <Button
                    icon
                    labelPosition="right"
                    onClick={() => {
                      handleAddSameProduct(product);
                    }}
                  >
                    Agregar otro igual
                    <Icon name="plus" />
                  </Button>
                </List.Content>
              </List.Item>
            ))}
          </List>
        ) : (
          <Header icon>
            <Icon name="search" />
            No hay productos, recordá que podés agregarlos desde el buscador o
            desde el botón de crear uno nuevo.
          </Header>
        )}
      </Segment>
    </div>
  );

  const renderModal = () => (
    <Modal size="small" open={open}>
      <Header content="Búsqueda / Creación de producto" />
      <Modal.Content scrolling className="modalContent">
        {loading ? renderLoading() : renderModalContent()}
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          onClick={() => {
            handleCloseSearchProductModal();
          }}
        >
          <Icon name="remove" /> Cerrar
        </Button>
        <Button
          primary
          disabled={createMode}
          onClick={handleSubmit}
          loading={loadingButton}
        >
          <Icon name="checkmark" /> Guardar cambios
        </Button>
      </Modal.Actions>
    </Modal>
  );

  return <div>{renderModal()}</div>;
};

export default SearchProductModal;
