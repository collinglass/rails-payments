import React from "react";
import PropTypes from "prop-types";

class Payments extends React.Component {
  render() {
    return (
      <main>
        <div className="container">
          <header>
            <h1>People who have gave Collin money</h1>
          </header>

          <section className="form-container">
            <div className="payment-group">
              {this.props.payments.map((payment) => (
                <div key={payment.id}>
                  <label className="payment-label">
                    <span>{payment.stripe_id}</span>
                    <span>{payment.email}</span>
                    <span>{payment.status}</span>
                  </label>
                  {!!payment.data && (
                    <label>
                      <pre>{JSON.stringify(payment.data)}</pre>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>

          <footer>
            <p>Made with ❤️ from Spain</p>
          </footer>
        </div>
      </main>
    );
  }
}

Payments.propTypes = {
  payments: PropTypes.array,
};
export default Payments;
