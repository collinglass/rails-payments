# Rails Payments: Give Collin Money

A simple payment form made with react and rails.

Demo available at https://give-collin-money.herokuapp.com/.

Ready-to-deploy to heroku.

## Routes

- `/` payment form
- `/payments` list of payments in the database

## Configurable Form

The payment page is configurable through query parameters.

`name=collin` will add a personalized feel to the page by adding the person's name.

_Fields:_

You can add additional fields to the form via query params.

`f_{index}_label` will create a new simple field at the specified index. Note: This is the index of the extra fields and there must be exact ordering starting from 0.

Label is the minimum required parameter to create a field, some properties of the field can be overridden from the default values.

- `f_{index}_id`: specifies the fieldName to be saved in the database
- `f_{index}_type`: specifies the type of the field, current implementation only supports types on html `<input />` and `<textarea />`.
- `f_{index}_placeholder`: specifies the placeholder on the field
- `f_{index}_required`: sets if the field is required

## Installation

1. Install dependencies

```
$ bundle install
```

Install JS dependencies:

```
$ yarn
```

2. Set up database

```
$ rake db:setup
```

3. Run server

```
$ rails s
```

## Deployment

The demo application uses Github and heroku integration. Every commit on master branch gets deployed.

Alternatively, you can set it up manually from the command line.

1. Create app with heroku

```
$ heroku create
```

2. Deploy code

```
$ git push heroku master
```

## Helpful Resources

- [Project set up](https://medium.com/swlh/getting-started-with-rails-6-and-react-afac8255aecd)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Copied Styling from here](https://medium.com/hackernoon/accept-payments-on-your-site-with-nextjs-stripe-and-micro-371de95b22d5)
- [Stripe Webhooks](https://stripe.com/docs/payments/payment-intents/verifying-status)
- [Deployment](https://devcenter.heroku.com/articles/getting-started-with-rails6)

## Improvements

- Use stripe restricted keys
- More responsive forms and responsiveness of configurable field label sizes
- Better error handling
