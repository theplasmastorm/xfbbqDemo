import React, { useEffect, useState, useCallback } from "react";
import * as userApi from "../../api/userApi";
import moment from "moment";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function User() {
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
    <div>
      <table>
        <thead>
          <tr>
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
                      <button type="button">
                        <span role="img" aria-label="delete">
                          📝
                        </span>
                      </button>
                    </Link>
                    {(adminCount <= 1 && user.Type === 1) ||
                    user.Id === login.Id ? (
                      <></>
                    ) : (
                      <button type="button">
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
                      </button>
                    )}
                  </>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
