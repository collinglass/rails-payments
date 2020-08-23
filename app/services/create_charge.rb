# app/services/create_charge.rb

require 'stripe'

class CreateCharge < ApplicationService
  def initialize(params)
    Stripe.api_key = ENV['STRIPE_SECRET_KEY']
    @logger = Logger.new(STDOUT)

    @params = params
  end

  def call
    @logger.info @params

    # Charge the Customer
    charge = Stripe::Charge.create({ amount: 2500, currency: 'usd', source: @params[:token] })

    @logger.info charge

    # Create payment in database
    Payment.create(
      email: @params['email'],
      status: charge['status'],
      stripe_id: charge['id'],
      data: @params['data'],
      raw: charge
    )

    { json: charge, status: :created }
  rescue Stripe::CardError => e
    { json: { message: 'Your card was declined.', reason: e.error.decline_code || e.error.code }, status: :not_acceptable }
  rescue Stripe::RateLimitError => e
    # TO DO: RETRY LOGIC
    @logger.error e
    { json: { message: "Something is not right. We've been notified and will fix it shortly." }, status: :server_error }
  rescue Stripe::InvalidRequestError => e
    # TO DO: Should notify developers of invalid request scenario
    @logger.error e
    { json: { message: "Something is not right. We've been notified and will fix it shortly." }, status: :server_error }
  rescue Stripe::AuthenticationError => e
    # TO DO: Should notify developers of stripe authentication error
    @logger.error e
    { json: { message: "Something is not right. We've been notified and will fix it shortly." }, status: :server_error }
  rescue Stripe::APIConnectionError => e
    # TO DO: Need to investigate how to handle
    @logger.error e
    { json: { message: "Something is not right. We've been notified and will fix it shortly." }, status: :server_error }
  rescue Stripe::StripeError => e
    # TO DO: Need to investigate how to handle
    @logger.error e
    { json: { message: "Something is not right. We've been notified and will fix it shortly." }, status: :server_error }
  rescue StandardError => e
    @logger.error e
    { json: { message: "Something is not right. We've been notified and will fix it shortly." }, status: :not_acceptable }

    # TO DO: are there other exceptions that could be thrown and handled?
  end
end
