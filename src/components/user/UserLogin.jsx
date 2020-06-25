import React from "react";
import { Field, Form } from "react-final-form";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import * as userApi from "../../api/userApi";
import * as bcrypt from "bcryptjs";
import moment from "moment";

export default function UserLogin() {
  const history = useHistory();

  return (
    <Form
      onSubmit={values => {
        userApi.getUserByName(values.Name).then(user => {
          if (user.value.length > 0) {
            const loggingInUser = user.value[0];
            bcrypt.compare(
              values.Password,
              loggingInUser.Hash,
              async (err, result) => {
                if (result) {
                  await userApi.saveUser({
                    ...loggingInUser,
                    Lastlogindate: parseInt(moment().format("X"))
                  });
                  toast.success("Logged in!");
                  history.push("/");
                } else toast.error("Wrong Name or Password");
              }
            );
          } else toast.error("Wrong Name or Password");
        });
      }}
      validate={values => {
        const errors = {};

        if (!values.Name) errors.Name = <> Required</>;
        if (!values.Password) errors.Password = <> Required</>;

        return Object.keys(errors).length ? errors : undefined;
      }}
      render={({ handleSubmit, form, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="Name">
            {({ input, meta }) => (
              <div>
                <label>Name: </label>
                <input {...input} type="input" placeholder="Name" required />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
          <Field name="Password">
            {({ input, meta }) => (
              <div>
                <label>Password: </label>
                <input
                  {...input}
                  type="password"
                  placeholder="Password"
                  required
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
          <button type="submit" disabled={pristine || submitting}>
            Submit
          </button>{" "}
          <button
            type="button"
            disabled={pristine || submitting}
            onClick={form.reset}
          >
            Reset Form
          </button>
        </form>
      )}
    />
  );
}
