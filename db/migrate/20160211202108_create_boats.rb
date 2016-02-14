# frozen_string_literal: true
class CreateBoats < ActiveRecord::Migration
  def change
    create_table :boats do |t|
      t.belongs_to(:board)
      t.string(:model)
      t.integer(:x)
      t.integer(:y)
      t.integer(:orientation)
      t.timestamps
    end
  end
end
