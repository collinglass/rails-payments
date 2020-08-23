import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";

const upper = (input) =>
  input && input.replace ? input.replace(/^\w/, (c) => c.toUpperCase()) : "";

// CUSTOM FORM BUILDING
const field = (query, index) => ({
  label: upper(query[`f_${index}_label`]) || "unknown",
  id: query[`f_${index}_id`] || "",
  type: query[`f_${index}_type`] || "text",
  placeholder: upper(query[`f_${index}_placeholder`]) || "",
  required: query[`f_${index}_required`] === "true" || false,
});

class Pay extends React.Component {
  componentWillMount() {
    this.stripePromise = loadStripe(this.props.stripe_pk);
  }

  render() {
    const { query } = this.props;

    // CUSTOM NAME FROM QUERY
    const name = query.name;
    const header = name
      ? `Hey ${upper(name)}! You've been invited to Give Collin Money!`
      : "Give Collin Money";

    // GETS ALL FIELDS FROM QUERY
    // REQUIRED FIELD: label
    const label = new RegExp("f_[0-9]_label", "i");
    const fields = Object.keys(query)
      .filter((key) => label.test(key))
      .reduce((agg, key, index) => agg.concat([field(query, index)]), []);

    return (
      <Elements stripe={this.stripePromise}>
        <p className="top-right">
          <a
            href="https://stripe.com/docs/testing#cards-responses"
            target="_blank"
          >
            Test Cards
          </a>
        </p>
        <main>
          <div className="container">
            <header>
              <h1>{header}</h1>
              <p>
                This will help fund his <code>Quest for Wisdom</code> through
                books and courses on Mental Models, Decision-making and
                Philosophy.
              </p>
            </header>

            <CheckoutForm name={upper(name)} extraFields={fields} />

            <footer>
              <p>Made with ❤️ from Spain</p>
            </footer>
          </div>
        </main>
      </Elements>
    );
  }
}

export default Pay;
