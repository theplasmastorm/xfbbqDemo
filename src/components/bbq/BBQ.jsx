import React, { useEffect, useState, useCallback } from "react";
import * as bbqApi from "../../api/bbqApi";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export default function BBQ() {
  document.title = "𝘹𝘧BBQ - BBQs";

  const [bbqs, setBbqs] = useState({ value: [] });

  const getBBQs = useCallback(async () => {
    const response = await bbqApi.getBBQs();
    setBbqs(response);
  }, []);

  useEffect(() => {
    getBBQs();
  }, [getBBQs]);

  return (
    <Jumbotron>
      <Link to="/NewBBQForm">
        <Button variant="primary" className="float-right">
          New BBQ
        </Button>
      </Link>
      <h2>BBQs</h2>
      <Table striped className="table-secondary">
        <thead>
          <tr className="table-primary">
            <th>BBQ ID</th>
            <th>Date Created</th>
            <th>Date Held On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bbqs.value.map((bbq) => {
            return (
              <tr key={bbq.Id}>
                <td>{bbq.Id}</td>
                <td>{moment.unix(bbq.Creationdate).format("MM/DD/YYYY")}</td>
                <td>{moment.unix(bbq.Helddate).format("MM/DD/YYYY")}</td>
                <td>
                  {moment.unix(bbq.Helddate).isAfter(moment()) ? (
                    <>
                      <Link to={{ pathname: "/NewBBQForm", state: bbq }}>
                        <Button variant="primary" size="sm">
                          <span role="img" aria-label="delete">
                            📝
                          </span>
                        </Button>
                      </Link>{" "}
                      <Button variant="danger" size="sm">
                        <span
                          role="img"
                          aria-label="delete"
                          onClick={async () => {
                            await bbqApi.deleteBBQ(bbq.Id);
                            getBBQs();
                            toast.error(
                              `Deleted BBQ ${bbq.Id} and associated orders`
                            );
                          }}
                        >
                          🗑️
                        </span>
                      </Button>
                    </>
                  ) : (
                    <i>No actions available</i>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Jumbotron>
  );
}
