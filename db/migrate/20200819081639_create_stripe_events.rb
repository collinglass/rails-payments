class CreateStripeEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_events, id: :uuid do |t|
      t.string :stripe_id
      t.jsonb :data

      t.timestamps
    end

    add_index :stripe_events, :stripe_id
  end
end
