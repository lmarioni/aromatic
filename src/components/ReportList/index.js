import React, { useContext, useState, useEffect } from "react";
import { Card, List, Table } from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";

const ReportList = ({ reportList = [] }) => {
  const { token } = useContext(Context);
  const [report, setReportList] = useState([]);

  useEffect(
    function () {
      if (reportList) {
        console.log('reportList', reportList)
        setReportList(reportList);
      }
    },
    [reportList]
  );

  const renderReports = () => (
    <Card.Group itemsPerRow={4}>
      {report.map((report, index) => {
        return (
          <Card key={`report-${index}-${report.id}`}>
            <Card.Content>
              <Card.Header>{`Factura número: ${report.id}`}</Card.Header>
              <Card.Meta>{` Número de serie: ${report.nserie}`}</Card.Meta>
              <Card.Description>
                <div className="descriptionList">
                  <span>
                    Nombre: {" "}
                    {report.nombreFantasia
                      ? `${report.nombreFantasia}(${report.nombre})`
                      : `${report.nombre} ${report.apellido}`}{" "}
                  </span>
                  <span>
                    Numero: {`${report.numero}`} Total: {`${report.total}`}{" "}
                  </span>
                  <span>TotalNeto: {`${report.totalNeto}`} </span>
                </div>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a href={report.url} target="_blank">
                Ver factura
                </a>{" "}
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );

  const renderReports2 = () => {
    var total = 0
    var totalNeto = 0
    var i = 0

    return (
      <>
        <Table celled style={{ marginBottom: 40 }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell> Serie/Factura</Table.HeaderCell>
              <Table.HeaderCell>Cliente</Table.HeaderCell>
              <Table.HeaderCell>Total Neto</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Factura</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              report.map(factura => {
                i++;
                total = total + factura.total;
                totalNeto = totalNeto + factura.totalNeto;
                return (
                  <Table.Row>
                    <Table.Cell>{factura.nserie} / {factura.numero}</Table.Cell>
                    <Table.Cell>
                      {report.nombreFantasia ? `${factura.nombreFantasia}(${factura.nombre})` : `${factura.nombre} ${factura.apellido}`}{" "}
                    </Table.Cell>
                    <Table.Cell> {factura.totalNeto} </Table.Cell>
                    <Table.Cell> {factura.total} </Table.Cell>
                    <Table.Cell>  <a href={factura.url} target="_blank">Ver factura</a> </Table.Cell>
                  </Table.Row>
                )
              })
            }

          </Table.Body>
        </Table>

        <Card.Group itemsPerRow={4}>
          <Card>
              <Card.Content>
                <Card.Header> Cantidad </Card.Header>
                <Card.Description> {i} </Card.Description>
              </Card.Content>
          </Card>

          <Card>
              <Card.Content>
                <Card.Header> Total neto </Card.Header>
                <Card.Description> {Number.parseFloat(totalNeto).toFixed(2)} </Card.Description>
              </Card.Content>
          </Card>

          <Card>
              <Card.Content>
                <Card.Header> Total </Card.Header>
                <Card.Description> {Number.parseFloat(total).toFixed(2)} </Card.Description>
              </Card.Content>
          </Card>
        </Card.Group>
      </>
    )
  }

  return <div>{report.length && renderReports2()}</div>;
};

export default ReportList;
