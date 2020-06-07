import React, { useContext, useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";

const ProductList = ({ productList = [] }) => {
  const { token } = useContext(Context);
  const [products, setProducts] = useState([]);

  useEffect(
    function () {
      if (productList) {
        setProducts(productList);
      }
    },
    [productList]
  );

  const renderProducts = () => (
    <Card.Group className="productListContainer">
      {products.map((product, index) => {
        return (
          <Card inverted="true" key={`prod-${index}`}>
            <Card.Content>
            Product!
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );

  return <div>{products.length && renderProducts()}</div>;
};

export default ProductList;
