# app/services/handle_charge_event.rb

require 'stripe'

class HandleChargeEvent < ApplicationService
  def initialize(event)
    Stripe.api_key = ENV['STRIPE_SECRET_KEY']
    @logger = Logger.new(STDOUT)

    @event = event
  end

  def call
    @logger.info @event

    type = @event['type'].split('.')
    charge = @event['data']['object']

    # Create payment in database
    StripeEvent.create(
      stripe_id: charge['id'],
      data: @event
    )

    if type[0] != 'charge'
      { json: { message: 'Unhandled event type', data: type } }
      return
    end

    charge = @event['data']['object']
    @logger.info charge

    @logger.info 'Updating charge status...'
    payment = Payment.find_by(stripe_id: charge['id'])

    payment.update(status: type[1])
    @logger.info payment

    { json: { status: type[1], data: charge, payment: payment } }
  rescue StandardError => e
    @logger.error e
    { json: { message: "Something is not right. We've been notified and will fix it shortly." } }
  end
end
