import React, { useState, useContext, useEffect } from "react";
import { Segment, Header, Icon, Container, Grid, Divider, Button } from "semantic-ui-react";
import { Context } from "../Context";
import ProductList from "../components/ProductList";

export const Products = () => {
  const { token } = useContext(Context);
  const [loading, setLoading] = useState(false);
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

    // fetch(`${process.env.REACT_APP_BASE_URL}/rutas/`, data)
    //   .then((res) => res.json())
    //   .then((response) => {
    //     setProductsList(response);
    //     setLoading(false);
    //   });
    setLoading(false);
  };

  const renderNoProducts = () => (
    <div>
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Parece que no hay productos cargados
        </Header>
        <Segment.Inline>
          <Button primary onClick={()=>{console.log('abrir modal ?')}}>Crear producto</Button>
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
      <Container style={{ marginTop: "7em" }} textAlign="center">
        <Header as="h1" inverted textAlign="center">
          Productos
        </Header>
        <Grid>
          <Grid.Column floated="left" width={5}>
            <Button primary onClick={()=>{console.log('abrir modal ?')}}>
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
