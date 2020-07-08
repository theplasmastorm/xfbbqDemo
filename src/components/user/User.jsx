import React, { useEffect, useState, useCallback } from "react";
import * as userApi from "../../api/userApi";
import moment from "moment";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import Jumbotron from "react-bootstrap/Jumbotron";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

export default function User() {
  document.title = "𝘹𝘧BBQ - Users";

  const [users, setUsers] = useState({ value: [] });
  const [adminCount, setAdminCount] = useState(0);
  const login = useSelector((state) => state.login);

  const getUsers = useCallback(async () => {
    const response = await userApi.getUsers();
    setUsers(response);
    setAdminCount(response.value.filter((user) => user.Type === 1).length);
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Jumbotron>
      <Link to="/UserRegistrationForm">
        <Button variant="primary" className="float-right">
          New User
        </Button>
      </Link>
      <h2>Users</h2>
      <Table striped className="table-secondary">
        <thead>
          <tr className="table-primary">
            <th>User ID</th>
            <th>Name</th>
            <th>Join Date</th>
            <th>Last Login Date</th>
            <th>User type</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.value.map((user) => {
            return (
              <tr key={user.Id}>
                <td>{user.Id}</td>
                <td>{user.Name}</td>
                <td>{moment.unix(user.Joindate).format("MM/DD/YYYY")}</td>
                <td>{moment.unix(user.Lastlogindate).format("MM/DD/YYYY")}</td>
                <td>
                  {user.Type === 1
                    ? "Administrator"
                    : user.Type === 2
                    ? "Host"
                    : "Attendee"}
                </td>
                <td>{user.Email}</td>
                <td>
                  <>
                    <Link
                      to={{ pathname: "/UserRegistrationForm", state: user }}
                    >
                      <Button>
                        <span role="img" aria-label="delete">
                          📝
                        </span>
                      </Button>
                    </Link>{" "}
                    {(adminCount <= 1 && user.Type === 1) ||
                    user.Id === login.Id ? (
                      <></>
                    ) : (
                      <Button variant="danger">
                        <span
                          role="img"
                          aria-label="delete"
                          onClick={async () => {
                            await userApi.deleteUser(user.Id);
                            getUsers();
                            toast.error(
                              `Deleted user ${user.Id} and associated favorites and orders`
                            );
                          }}
                        >
                          🗑️
                        </span>
                      </Button>
                    )}
                  </>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Jumbotron>
  );
}
