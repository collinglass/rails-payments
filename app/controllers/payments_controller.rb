require 'stripe'
require 'json'

class PaymentsController < ApplicationController
  protect_from_forgery with: :null_session

  def form
    @query = request.query_parameters
    @stripe_pk = ENV['STRIPE_PUBLISHABLE_KEY']
    render component: 'Pay', props: { query: @query, stripe_pk: @stripe_pk }
  end

  def index
    @payments = Payment.all
    render component: 'Payments', props: { payments: @payments }
  end

  def create
    logger.info params
    result = CreateCharge.call(params)

    logger.info result.fetch(:json)
    render json: result.fetch(:json), status: result.fetch(:status)
  end
end
