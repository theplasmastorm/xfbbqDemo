import React from "react";
import { Field, Form } from "react-final-form";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as userApi from "../../api/userApi";
import * as tokenApi from "../../api/tokenApi";
import { loginUser } from "../../redux/actions/loginActions";
import moment from "moment";
import { getToken } from "../../redux/actions/tokenActions";

import Jumbotron from "react-bootstrap/Jumbotron";
import BootstrapForm from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function UserLogin() {
  document.title = "𝘹𝘧BBQ - Login";

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <Jumbotron>
      <h2>Login</h2>
      <Form
        onSubmit={async (values) => {
          const token = await tokenApi.getToken(values.Name, values.Password);
          if (token) {
            dispatch(getToken({ token }));
            userApi.getUserByName(values.Name).then((user) => {
              const loggingInUser = user.value[0];
              dispatch(
                loginUser({
                  Id: loggingInUser.Id,
                  Name: loggingInUser.Name,
                  Type: loggingInUser.Type,
                })
              );

              userApi.saveUser({
                ...loggingInUser,
                Lastlogindate: parseInt(moment().format("X")),
              });
              toast.success("Logged in!");
              history.push("/");
            });
          } else toast.error("Wrong Name or Password");
        }}
        validate={(values) => {
          const errors = {};
          const requiredMsg = (
            <BootstrapForm.Label className="text-danger">
              Required
            </BootstrapForm.Label>
          );

          if (!values.Name) errors.Name = requiredMsg;
          if (!values.Password) errors.Password = requiredMsg;

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
                      type="input"
                      placeholder="Name"
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
              <Button
                type="submit"
                disabled={pristine || submitting}
                variant="primary"
              >
                Submit
              </Button>{" "}
              <Button
                variant="secondary"
                disabled={pristine || submitting}
                onClick={form.reset}
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
