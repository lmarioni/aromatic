import React, { useState, useContext, useEffect } from "react";
import {
  Segment,
  Header,
  Icon,
  Container,
  Grid,
  Divider,
  Button,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { Context } from "../Context";
import ProductList from "../components/ProductList";
import ProductCreationModal from "../modals/Products";

export const Products = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [showProductCreationModal, setShowProductCreationModal] = useState(
    false
  );
  const [products, setProducts] = useState([]);

  useEffect(function () {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    const data = {
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
    };

    fetch(`${process.env.REACT_APP_BASE_URL}/productos/`, data)
      .then((res) => res.json())
      .then((response) => {
        setProducts(response);
        setLoading(false);
      });
  };

  const mergeProducts = (newProduct = {}) => {
    const new_products = products.concat(newProduct);
    setProducts(new_products);
  };

  const handleCloseProductCreationModal = (newProduct = {}) => {
    if (Object.keys(newProduct).length) {
      mergeProducts(newProduct);
    }
    setShowProductCreationModal(false);
  };
  const renderNoProducts = () => (
    <div>
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Parece que no hay productos cargados
        </Header>
        <Segment.Inline>
          <Button
            primary
            onClick={() => {
              console.log("abrir modal ?");
            }}
          >
            Crear producto
          </Button>
        </Segment.Inline>
      </Segment>
    </div>
  );

  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Cargando productos</Loader>
    </Dimmer>
  );

  const renderProducts = () => <ProductList productList={products} />;

  return (
    <div>
      <ProductCreationModal
        open={showProductCreationModal}
        onClose={handleCloseProductCreationModal}
      />
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Productos
        </Header>
        <Grid>
          <Grid.Column floated="left" width={5}>
            <Button
              primary
              onClick={() => {
                setShowProductCreationModal(true);
              }}
            >
              Crear nuevo producto
            </Button>
          </Grid.Column>
        </Grid>
        <Divider />

        {loading
          ? renderLoading()
          : products.length
          ? renderProducts()
          : renderNoProducts()}
      </Container>
    </div>
  );
};
