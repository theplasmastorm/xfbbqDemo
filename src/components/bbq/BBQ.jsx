import React, { useEffect, useState, useCallback } from "react";
import * as bbqApi from "../../api/bbqApi";

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
    <code>{JSON.stringify(bbqs.value)}</code>
  );
}