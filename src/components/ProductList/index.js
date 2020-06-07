import React, { useContext, useState, useEffect } from "react";
import { Table } from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";

const columns = [
  { key: "codigo", label: "Codigo" },
  { key: "nombre", label: "Nombre" },
  { key: "precio", label: "Precio" },
  { key: "precioCosto", label: "Costo" },
  { key: "iva", label: "iva" },
  { key: "descripcion", label: "Descripcion" }
];

const ProductList = ({ productList = [] }) => {
  const { token } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(
    function () {
      if (productList) {
        const parsedProducts = productList.map((prod) => {
          return {
            codigo: prod.codigo,
            descripcion: prod.descripcion,
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            precioCosto: prod.precioCosto,
            userid: prod.userid,
            iva: prod.iva.texto,
          };
        });
        setProducts(parsedProducts);
        setFilteredProducts(parsedProducts);
      }
    },
    [productList]
  );

  const renderProducts = () => {
    return (
      <Table size="small" celled selectable>
        <Table.Header>
          <Table.Row>
            {columns.map((column, index) => {
              return (
                <Table.HeaderCell key={`main-column-${column}-${index}`}>
                  {column.label}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredProducts.map((product) => {
            return (
              <Table.Row key={`product${product.id}row`}>
                {columns.map((column) => {
                  return (
                    <Table.Cell key={`${product.id}[${column.label}]`}>
                      {product[column.key]}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  };

  return <div>{filteredProducts.length && renderProducts()}</div>;
};

export default ProductList;
