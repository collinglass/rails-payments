import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import Card from "./Card";

const stripeTokenHandler = async (token, formData) => {
  const paymentData = {
    email: formData.email,
    data: formData,
    token: token.id,
  };

  // MAKE PAYMENT TO BACKEND
  const response = await fetch("/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  console.log("CHARGE RESPONSE", response);
  const data = await response.json();
  console.log("CHARGE DATA", data);

  return data;
};

const errorMessageBuilder = (error) => {
  if (!error) {
    return "";
  }

  switch (error.reason) {
    case "expired_card":
      return "Your card was declined. Looks like it's expired.";
    case "incorrect_cvc":
      return "Your card was declined. Looks like your CVC didn't match up.";
    case "processing_error":
      return "Your card was declined due to a processing error.";
    case "incorrect_number":
      return "Your card was declined. Looks like the data you entered had an issue.";
    case "insufficient_funds":
      return "Your card was declined. Looks like your broke and still trying to give money to Collin. He's humbled.";
    case "lost_card":
      return "Your card was declined. Looks like your bank has flagged this as a stolen or lost card, you should contact them.";
    case "stolen_card":
      return "Your card was declined. Looks like your bank has flagged this as a stolen or lost card, you should contact them.";
    case "fraudulent":
      return "Looks like you've been up to some fraudulent activity. Collin is not impressed.";
    default:
      return "Your card was declined.";
  }
};

const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  formState,
  setFormState,
}) => {
  const name = id || label.trim().replace(/\s/g, "_").toLowerCase();

  if (type === "textarea") {
    return (
      <label>
        <span>{label}</span>
        <textarea
          id={name}
          name={name}
          className="field"
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          value={formState[name] || ""}
          onChange={(event) =>
            setFormState({ ...formState, [name]: event.target.value })
          }
        />
      </label>
    );
  }
  return (
    <label>
      <span>{label}</span>
      <input
        id={name}
        name={name}
        className="field"
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        value={formState[name] || ""}
        onChange={(event) =>
          setFormState({ ...formState, [name]: event.target.value })
        }
      />
    </label>
  );
};

export default function CheckoutForm(props) {
  const [charge, setCharge] = useState(null);
  const [formState, setFormState] = useState({});
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // PREVENT DEFAULT FORM SUBMISSION
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const card = elements.getElement(CardElement);

    // NOTE: COULD MODIFY TO `createPaymentMethod` and send additional metadata
    // https://stripe.com/docs/api/payment_methods/object
    const result = await stripe.createToken(card);

    if (result.error) {
      // TO DO: Show error to USER
      console.log(result.error.message);
    } else {
      // SEND A STRIPE TOKEN TO SERVER
      const data = await stripeTokenHandler(result.token, formState);
      setCharge(data);
    }
  };

  return (
    <form id="card-form" className="form-container" onSubmit={handleSubmit}>
      <div className="group">
        <Field
          label="Name"
          type="text"
          name="name"
          placeholder="Jane Doe"
          formState={formState}
          setFormState={setFormState}
        />
        <Field
          label="Email"
          type="email"
          name="email"
          placeholder="youremail@domain.com"
          formState={formState}
          setFormState={setFormState}
        />
      </div>

      {!!(props.extraFields && props.extraFields.length) && (
        <div className="group">
          {props.extraFields.map((field) => (
            <Field
              key={field.label}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              formState={formState}
              setFormState={setFormState}
            />
          ))}
        </div>
      )}

      <div className="group">
        <Card />
      </div>

      <button type="submit">Give $25</button>
      <div className="outcome">
        <div className={`error ${charge && !charge.paid ? "" : "hide"}`}>
          {errorMessageBuilder(charge)}
        </div>
        <div className={`success ${charge && charge.paid ? "" : "hide"}`}>
          Thanks{props.name ? ` ${props.name}` : ""}! You gave Collin{" "}
          <span className="token">$25</span>. He thinks very highly of you.
        </div>
      </div>
    </form>
  );
}
