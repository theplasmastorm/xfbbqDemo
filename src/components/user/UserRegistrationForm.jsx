import React from "react";
import { Field, Form } from "react-final-form";
import * as bcrypt from "bcryptjs";
import { useHistory } from "react-router-dom";
import * as userApi from "../../api/userApi";

import { toast } from "react-toastify";

export default function UserRegistrationForm() {
  const history = useHistory();

  return (
    <Form
      onSubmit={(values) => {
        bcrypt.genSalt(13, (err, salt) => {
          bcrypt.hash(values.Password, salt, async (err, Hash) => {
              await userApi.saveUser
              ({
                  Name: values.Name,
                  Email: values.Email,
                  Type: values.Type,
                  Hash
              })
          });
          toast.success("Added a new user");
          history.push("/User")
        });
      }}
      validate={(values) => {
        const errors = {};

        if (!values.Name) errors.Name = <> Required</>;
        if (!values.Email) errors.Email = <> Required</>;
        if (!values.Password) errors.Password = <> Required</>;
        if (!values.PasswordConfirm) errors.PasswordConfirm = <> Required</>;
        else if (values.Password !== values.PasswordConfirm)
          errors.PasswordConfirm = <> Passwords do not match</>;
        if (!values.Type) errors.Type = <> Required</>;

        return Object.keys(errors).length ? errors : undefined;
      }}
      render={({ handleSubmit, form, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="Name">
            {({ input, meta }) => (
              <div>
                <label>Name: </label>
                <input {...input} type="text" placeholder="Name" required />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
          <Field name="Email">
            {({ input, meta }) => (
              <div>
                <label>Email: </label>
                <input {...input} type="email" placeholder="Email" required />
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
          <Field name="PasswordConfirm">
            {({ input, meta }) => (
              <div>
                <label>Confirm Password: </label>
                <input
                  {...input}
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
          <Field name="Type">
            {({ input, meta }) => (
              <div>
                <label>Type: </label>
                <select {...input} type="select" required>
                  <option value="" disabled>
                    Pick an Account Type
                  </option>
                  <option value="1">Administrator</option>
                  <option value="2">Host</option>
                  <option value="3">Attendee</option>
                </select>
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
