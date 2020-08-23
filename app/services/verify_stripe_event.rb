# app/services/verify_stripe_event.rb

require 'stripe'

class VerifyStripeEvent < ApplicationService
  def initialize(payload, sig_header)
    Stripe.api_key = ENV['STRIPE_SECRET_KEY']
    @stripe_secret = ENV['STRIPE_ENDPOINT_SECRET']
    @logger = Logger.new(STDOUT)

    @payload = payload
    @sig_header = sig_header
  end

  def call
    @logger.info @sig_header

    Stripe::Webhook.construct_event(
      @payload, @sig_header, @stripe_secret
    )
  rescue JSON::ParserError => e
    # Invalid payload
    @logger.info e
    { error: 'Invalid payload', status: :bad_request }
  rescue Stripe::SignatureVerificationError => e
    # Invalid signature
    @logger.info e
    { error: 'Invalid signature', status: :unauthorized }
  end
end
