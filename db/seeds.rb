require 'faker'

ActiveRecord::Base.connection.tables.each do |t|
  ActiveRecord::Base.connection.reset_pk_sequence!(t)
end

5.times do
  email = Faker::Internet.email
  stripe_id = Faker::Stripe.valid_token
  status = 'succeeded'
  data = '{"data": "custom form data"}'
  Payment.create(email: email, status: status, stripe_id: stripe_id, data: data)
end
