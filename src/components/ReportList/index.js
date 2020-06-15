import React, { useContext, useState, useEffect } from "react";
import { Card, List, Segment } from "semantic-ui-react";
import { Context } from "../../Context";
import "./styles.scss";

const ReportList = ({ reportList = [] }) => {
  const { token } = useContext(Context);
  const [report, setReportList] = useState([]);

  useEffect(
    function () {
      if (reportList) {
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
                  Link al reporte
                </a>{" "}
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
  );

  return <div>{report.length && renderReports()}</div>;
};

export default ReportList;
