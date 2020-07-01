import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import * as bcrypt from "bcryptjs";
import moment from "moment";
import * as userApi from "../../api/userApi";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserRegistrationForm({ ...props }) {
  const history = useHistory();
  const login = useSelector((state) => state.login);
  const [captchaValue, setCaptchaValue] = useState(null);
  const state = props?.location?.state;

  return (
    <Form
      initialValues={
        state
          ? { Name: state.Name, Email: state.Email, Type: state.Type }
          : { Type: login.Type === 1 ? undefined : 3 }
      }
      onSubmit={(values) => {
        bcrypt.genSalt(13, (err, salt) => {
          bcrypt.hash(values.Password, salt, async (err, Hash) => {
            await userApi.saveUser(
              {
                Id: state ? state.Id : undefined,
                Name: values.Name,
                Email: values.Email,
                Type: values.Type,
                Joindate: state
                  ? state.Joindate
                  : parseInt(moment().format("X")),
                Hash,
              },
              captchaValue
            );
            toast.success(
              `${state ? "Edited" : "Added new user"} ${values.Name}`
            );
            history.push("/User");
          });
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
          {login.Type === 1 ? (
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
          ) : (
            <></>
          )}
          <ReCAPTCHA
            sitekey="6LfJ6dsUAAAAAFwaXDIGHHhwiFe7oNhLBP-S66OQ"
            onChange={(value) => setCaptchaValue(value)}
          />
          <button
            type="submit"
            disabled={pristine || submitting || !captchaValue}
          >
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
