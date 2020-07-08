import React from "react";
import { Field, Form } from "react-final-form";
import * as bbqApi from "../../api/bbqApi";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

import Jumbotron from "react-bootstrap/Jumbotron";
import BootstrapForm from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function NewBBQForm({ ...props }) {
  const history = useHistory();
  const state = props?.location?.state;

  document.title = `𝘹𝘧BBQ - ${state ? "Edit" : "New"} BBQ`;

  return (
    <Jumbotron>
      <h2>{`${state ? "Edit" : "New"} BBQ`}</h2>
      <Form
        initialValues={
          state
            ? { Helddate: moment.unix(state.Helddate).format("YYYY-MM-DD") }
            : {}
        }
        onSubmit={async (values) => {
          await bbqApi.saveBBQ({
            Creationdate: state
              ? state.Creationdate
              : parseInt(moment().format("X")),
            Helddate: parseInt(moment(values.Helddate).format("X")),
            Id: state ? state.Id : undefined,
          });
          toast.success(state ? "Edited BBQ" : "Added new BBQ");
          history.push("/BBQ");
        }}
        validate={(values) => {
          const errors = {};

          if (!values.Helddate)
            errors.Helddate = (
              <BootstrapForm.Label className="text-danger">
                Required
              </BootstrapForm.Label>
            );

          return Object.keys(errors).length ? errors : undefined;
        }}
        render={({ handleSubmit, form, submitting, pristine }) => (
          <BootstrapForm onSubmit={handleSubmit}>
            <BootstrapForm.Group>
              <Field name="Helddate">
                {({ input, meta }) => (
                  <>
                    <BootstrapForm.Label>Date to be held:</BootstrapForm.Label>
                    <BootstrapForm.Control
                      {...input}
                      type="date"
                      min={moment().add(1, "days").format("YYYY-MM-DD")}
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
