require 'stripe'

class StripeEventsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']

    event = VerifyStripeEvent.call(payload, sig_header)
    if event[:error]
      render json: event
      return
    end

    result = HandleChargeEvent.call(event)

    logger.info result.fetch(:json)
    render json: result.fetch(:json)
  end
end
