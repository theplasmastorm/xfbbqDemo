import React from "react";
import { Field, Form } from "react-final-form";
import * as bbqApi from "../../api/bbqApi";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

export default function NewBBQForm({ ...props }) {
  const history = useHistory();
  const state = props?.location?.state;

  return (
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

        if (!values.Helddate) errors.Helddate = <> Required</>;

        return Object.keys(errors).length ? errors : undefined;
      }}
      render={({ handleSubmit, form, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="Helddate">
            {({ input, meta }) => (
              <div>
                <label>Date to be held:</label>
                <input
                  {...input}
                  type="date"
                  min={moment().add(1, "days").format("YYYY-MM-DD")}
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
