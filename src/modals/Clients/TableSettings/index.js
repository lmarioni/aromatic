import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Table,
  Modal,
  Grid,
} from "semantic-ui-react";

const TableSettingsModal = ({ open, onClose, columns }) => {
  const [newColumns, setNewColumns] = useState([]);

  useEffect(function () {}, []);
  useEffect(
    function () {
      setNewColumns(columns);
    },
    [columns]
  );

  const handleToggleDisplay = (data, index) => {
    const cols = newColumns;
    cols[index].display = !cols[index].display;
    setNewColumns(cols);
  };

  const handleCloseTableSettings = () => {
    onClose(newColumns);
  };

  return (
    <Modal open={open} size="tiny" closeOnDocumentClick={true}>
      <Modal.Header>Configuración de tabla</Modal.Header>
      <Modal.Content scrolling>
        <Grid centered columns={1}>
          <Table basic celled collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Mostrar columna</Table.HeaderCell>
                <Table.HeaderCell>Columna</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {newColumns.map((column, index) => {
                return (
                  <Table.Row key={`column-[${column.label}]-${index}`}>
                    <Table.Cell>
                      <Checkbox
                        onClick={(event, data) => {
                          if (index > 1) {
                          handleToggleDisplay(data, index);
                          }
                        }}
                        disabled={index < 2}
                        defaultChecked={column.display}
                        label="Mostrar columna"
                        slider
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>{column.label}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={handleCloseTableSettings}>
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default TableSettingsModal;
