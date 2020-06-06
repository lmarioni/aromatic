import React, { useEffect, useState } from "react";
import { Button, Modal, Grid, Segment, Header } from "semantic-ui-react";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";

const PrintBillingModal = ({ open, onClose, clients = [] }) => {
  const [today, setToday] = useState(new Date());
  const [lastWeek, setLastWeek] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
  );
  useEffect(
    function () {
      if (open && clients.length) {
        console.log(clients);
      }
    },
    [open]
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} closeOnDocumentClick={true}>
      <Modal.Header>Imprimir facturas</Modal.Header>
      <Modal.Content scrolling>
        <Segment>
          <Header as="h2" dividing>
            Seleccione una fecha para facturar
          </Header>
          <InfiniteCalendar
            displayOptions={{
              showHeader: false,
            }}
            locale={{
              locale: require("date-fns/locale/es"),
              headerFormat: "dddd, D MMM",
              weekdays: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
              blank: "Seleccione una fecha de facturación",
              todayLabel: {
                long: "Hoy",
                short: "Hoy",
              },
            }}
            width={"100%"}
            height={350}
            rowHeight={70}
            selected={today}
            minDate={lastWeek}
          />
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PrintBillingModal;
