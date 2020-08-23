Rails.application.routes.draw do
  resources :stripe_events
  resources :payments

  get '/' => 'payments#form'
end
