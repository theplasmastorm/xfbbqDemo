import React, { useEffect, useState, useCallback } from "react";
import * as userApi from "../../api/userApi";

export default function User() {
  const [users, setUsers] = useState({ value: [] });

  const getUsers = useCallback(async () => {
    const response = await userApi.getUsers();
    setUsers(response);
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  
  return (
    <code>{JSON.stringify(users.value)}</code>
  );
}