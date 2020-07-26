import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Table,
  Grid,
  Button,
  Ref,
  Card,
  Icon,
  Responsive,
  Segment,
  Item,
  Label,
} from "semantic-ui-react";

const getItemStyle = (isDragging, draggableStyle) => ({
  display: isDragging ? "table" : "",
  ...draggableStyle,
});

export const Clients = ({
  columns = [],
  clients = [],
  handleTogglePrintBilling = () => {},
  renderActions = () => {},
  renderProductInTable = () => {},
  renderBillCheckbox = () => {},
  onDragEnd = () => {},
}) => {
  useEffect(() => {}, []);

  const renderTable = () => (
    <Table
      size="small"
      celled
      selectable
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        marginBottom: 30,
      }}
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing key={`main-column-handle`}>
            {""}
          </Table.HeaderCell>
          {columns.map((column, index) => {
            if (column.display) {
              return (
                <Table.HeaderCell
                  collapsing
                  key={`main-column-${column}-${index}`}
                >
                  {column.key === "facturar" ? (
                    <Button.Group>
                      <Button
                        positive
                        onClick={() => {
                          handleTogglePrintBilling(true);
                        }}
                      >
                        Facturar
                      </Button>
                      <Button.Or text="o" />
                      <Button
                        onClick={() => {
                          handleTogglePrintBilling(false);
                        }}
                      >
                        No facturar
                      </Button>
                    </Button.Group>
                  ) : (
                    column.label
                  )}
                </Table.HeaderCell>
              );
            }
          })}
        </Table.Row>
      </Table.Header>

      <Droppable droppableId="tableBody">
        {(provided, snapshot) => (
          <Ref innerRef={provided.innerRef}>
            <Table.Body {...provided.droppableProps}>
              {clients.map((client, index) => (
                <Draggable
                  draggableId={`${client.id}-${client.codigo}`}
                  index={index}
                  key={client.id}
                >
                  {(provided, snapshot) => (
                    <Ref innerRef={provided.innerRef}>
                      <Table.Row
                        key={`client${client.id}row`}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Table.Cell>
                          <Icon name="grab" {...provided.dragHandleProps} />
                        </Table.Cell>
                        {columns.map((column, index) => {
                          if (column.display) {
                            return (
                              <Table.Cell
                                key={`row-${client.id}[${column.label}]- ${index}`}
                              >
                                {column.key === "acciones"
                                  ? renderActions(client)
                                  : column.key === "nombreproducto"
                                  ? renderProductInTable(
                                      client,
                                      client[column.key]
                                    )
                                  : column.key === "facturar"
                                  ? renderBillCheckbox(client)
                                  : client[column.key]}
                              </Table.Cell>
                            );
                          }
                        })}
                      </Table.Row>
                    </Ref>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Table.Body>
          </Ref>
        )}
      </Droppable>
    </Table>
  );

  const renderMobile = () => (
    <Droppable droppableId="listViewBody">
      {(provided, snapshot) => (
        <Ref innerRef={provided.innerRef}>
          <Card.Group divided="true" {...provided.droppableProps} className="justify-content-center">
            {clients.map((client, index) => (
              <Draggable
                draggableId={`${client.id}-${client.codigo}`}
                index={index}
                key={client.id}
              >
                {(provided, snapshot) => (
                  <Ref innerRef={provided.innerRef}>
                    <Card
                      key={`client${client.id}row`}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Card.Content>
                        <Card.Content extra>
                          <Icon name="grab" {...provided.dragHandleProps} />
                        </Card.Content>
                        <Card.Header>
                          {client["nombreFantasia"]
                            ? client["nombreFantasia"]
                            : client["nombre"] && client["apellido"]
                            ? `${client["nombre"]} ${client["apellido"]}`
                            : client["cif"]
                            ? client["cif"]
                            : ""}
                        </Card.Header>
                        <Card.Meta>
                          {`${client["direccion"]}, ${client["localidad"]}`}
                        </Card.Meta>
                        <Card.Description>
                          {columns.map((column, index) => {
                            if (column.display) {
                              return <div key={`col-${index}`}>{client[column.key]}</div>;
                            }
                          })}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>{renderActions(client)}</Card.Content>
                    </Card>
                  </Ref>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Card.Group>
        </Ref>
      )}
    </Droppable>
  );

  return (
    <Grid
      className=" justify-content-center "
      style={{ overflowX: "auto", overflowY: "hidden" }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Responsive as={Segment} {...Responsive.onlyMobile}>
          {renderMobile()}
        </Responsive>
        <Responsive as={Segment} minWidth={Responsive.onlyTablet.minWidth}>
          {renderTable()}
        </Responsive>
      </DragDropContext>
    </Grid>
  );
};
