# frozen_string_literal: true
class CreateBoards < ActiveRecord::Migration
  def change
    create_table :boards do |t|
      t.string(:name)
      t.timestamps
    end
  end
end
