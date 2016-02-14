# encoding: UTF-8
# frozen_string_literal: true
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20_160_211_202_108) do
  create_table 'boards', force: :cascade do |t|
    t.string   'name', limit: 191
    t.datetime 'created_at'
    t.datetime 'updated_at'
  end

  create_table 'boats', force: :cascade do |t|
    t.integer  'board_id',    limit: 4
    t.string   'model',       limit: 191
    t.integer  'x',           limit: 4
    t.integer  'y',           limit: 4
    t.integer  'orientation', limit: 4
    t.datetime 'created_at'
    t.datetime 'updated_at'
  end
end
