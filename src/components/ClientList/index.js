import React, { useContext, useState, useEffect } from "react";
import { Card } from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";

const ClientList = ({ clientList = [] }) => {
  const { token } = useContext(Context);
  const [clients, setClients] = useState([]);

  useEffect(
    function () {
      if (clientList) {
        setClients(clientList);
      }
    },
    [clientList]
  );

  const renderClients = () => (
    <Card.Group className="clientListContainer">
      {clients.map((client, index) => {
        return (
          <Card inverted="true" key={`prod-${index}`}>
            <Card.Content>Client!</Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );

  return <div>{clients.length && renderClients()}</div>;
};

export default ClientList;
