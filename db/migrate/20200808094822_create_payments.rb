class CreatePayments < ActiveRecord::Migration[6.0]
  def change
    create_table :payments, id: :uuid do |t|
      t.string :stripe_id
      t.string :email
      t.string :status
      t.jsonb :raw
      t.jsonb :data
      t.timestamps
    end

    add_index :payments, :stripe_id
  end
end
