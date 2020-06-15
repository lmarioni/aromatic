import React, { useContext, useState, useEffect } from "react";
import { Card } from "semantic-ui-react";
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
    <Card.Group className="reportListContainer">
      {report.map((report, index) => {
        return (
          <Card inverted="true" key={`prod-${index}`}>
            <Card.Content>Report!</Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  );

  return <div>{report.length && renderReports()}</div>;
};

export default ReportList;
