import React, { useEffect, useState, useCallback } from "react";
import * as bbqApi from "../../api/bbqApi";
import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function BBQ() {
  const [bbqs, setBbqs] = useState({ value: [] });

  const getBBQs = useCallback(async () => {
    const response = await bbqApi.getBBQs();
    setBbqs(response);
  }, []);

  useEffect(() => {
    getBBQs();
  }, [getBBQs]);

  return (
    <div>
      <table>
        <thead>
          <tr>
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
                        <button type="button">
                          <span role="img" aria-label="delete">
                            📝
                          </span>
                        </button>
                      </Link>
                      <button type="button">
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
                      </button>
                    </>
                  ) : (
                    <i>No actions available</i>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
