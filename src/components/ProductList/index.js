import React, { useContext, useState, useEffect } from "react";
import { Table, Icon, Dimmer, Loader } from "semantic-ui-react";
import "./styles.scss";

const columns = [
  { key: "codigo", label: "Codigo" },
  { key: "nombre", label: "Nombre" },
  { key: "precio", label: "Precio" },
  { key: "precioCosto", label: "Costo" },
  { key: "iva", label: "iva" },
  { key: "descripcion", label: "Descripcion" },
  { key: "acciones", label: "Acciones" },
];

const ProductList = ({ productList = [], handleDelete = null }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
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
          iva: prod.iva?.texto,
        };
      });
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    }
  }, [productList]);

  const renderActions = (prodId) => (
    <Icon
      name="trash"
      style={{cursor: 'pointer', color: 'red'}}
      onClick={() => {
        handleDelete(prodId);
      }}
    />
  );

  const renderProducts = () => {
    return (
      <Table size="small" celled selectable style={{marginBottom: 40}}>
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
                    <Table.Cell style={{textAlign: 'center'}} key={`${product.id}[${column.label}]`}>
                      {column.key !== "acciones"
                        ? product[column.key]
                        : renderActions(product.id)}
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

  return <div>{filteredProducts.length ? renderProducts() : null}</div>;
};

export default ProductList;
