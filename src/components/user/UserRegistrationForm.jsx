import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import * as bcrypt from "bcryptjs";
import moment from "moment";
import * as userApi from "../../api/userApi";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Jumbotron from "react-bootstrap/Jumbotron";
import BootstrapForm from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function UserRegistrationForm({ ...props }) {
  const history = useHistory();
  const login = useSelector((state) => state.login);
  const [captchaValue, setCaptchaValue] = useState(null);
  const state = props?.location?.state;

  document.title = `𝘹𝘧BBQ - ${state ? "Edit" : "New"} User Registration`;

  return (
    <Jumbotron>
      <h2>User Registration</h2>
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
              history.push(`/${login.Type === 1 ? "User" : ""}`);
            });
          });
        }}
        validate={(values) => {
          const errors = {};
          const requiredMsg = (
            <BootstrapForm.Label className="text-danger">
              Required
            </BootstrapForm.Label>
          );

          if (!values.Name) errors.Name = requiredMsg;
          if (!values.Email) errors.Email = requiredMsg;
          if (!values.Password) errors.Password = requiredMsg;
          if (!values.PasswordConfirm) errors.PasswordConfirm = requiredMsg;
          else if (values.Password !== values.PasswordConfirm)
            errors.PasswordConfirm = (
              <BootstrapForm.Label className="text-danger">
                Passwords do not match
              </BootstrapForm.Label>
            );
          if (!values.Type) errors.Type = requiredMsg;

          return Object.keys(errors).length ? errors : undefined;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <BootstrapForm onSubmit={handleSubmit}>
            <BootstrapForm.Group>
              <Field name="Name">
                {({ input, meta }) => (
                  <>
                    <BootstrapForm.Label>Name: </BootstrapForm.Label>
                    <BootstrapForm.Control
                      {...input}
                      type="text"
                      placeholder="Name"
                      required
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </>
                )}
              </Field>
            </BootstrapForm.Group>
            <BootstrapForm.Group>
              <Field name="Email">
                {({ input, meta }) => (
                  <>
                    <BootstrapForm.Label>Email: </BootstrapForm.Label>
                    <BootstrapForm.Control
                      {...input}
                      type="email"
                      placeholder="Email"
                      required
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </>
                )}
              </Field>
            </BootstrapForm.Group>
            <BootstrapForm.Group>
              <Field name="Password">
                {({ input, meta }) => (
                  <>
                    <BootstrapForm.Label>Password: </BootstrapForm.Label>
                    <BootstrapForm.Control
                      {...input}
                      type="password"
                      placeholder="Password"
                      required
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </>
                )}
              </Field>
            </BootstrapForm.Group>
            <BootstrapForm.Group>
              <Field name="PasswordConfirm">
                {({ input, meta }) => (
                  <>
                    <BootstrapForm.Label>
                      Confirm Password:{" "}
                    </BootstrapForm.Label>
                    <BootstrapForm.Control
                      {...input}
                      type="password"
                      placeholder="Confirm Password"
                      required
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </>
                )}
              </Field>
            </BootstrapForm.Group>
            {login.Type === 1 ? (
              <BootstrapForm.Group>
                <Field name="Type">
                  {({ input, meta }) => (
                    <div>
                      <BootstrapForm.Label>Type: </BootstrapForm.Label>
                      <BootstrapForm.Control as="select" {...input} required>
                        <option value="" disabled>
                          Pick an Account Type
                        </option>
                        <option value="1">Administrator</option>
                        <option value="2">Host</option>
                        <option value="3">Attendee</option>
                      </BootstrapForm.Control>
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </BootstrapForm.Group>
            ) : (
              <></>
            )}
            <BootstrapForm.Group>
              <ReCAPTCHA
                theme="dark"
                sitekey="6LfJ6dsUAAAAAFwaXDIGHHhwiFe7oNhLBP-S66OQ"
                onChange={(value) => setCaptchaValue(value)}
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group>
              <Button
                type="submit"
                disabled={pristine || submitting || !captchaValue}
                variant="primary"
              >
                Submit
              </Button>{" "}
              <Button
                disabled={pristine || submitting}
                onClick={form.reset}
                variant="secondary"
              >
                Reset Form
              </Button>
            </BootstrapForm.Group>
          </BootstrapForm>
        )}
      />
    </Jumbotron>
  );
}
