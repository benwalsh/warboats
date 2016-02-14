# frozen_string_literal: true
class BoardsController < ApplicationController
  def fire
    board = Board.find(params.delete(:id))
    boat = board.boat_at_coordinate(params[:x], params[:y])
    render(json: { success: boat.present?, boat: boat })
  end

  def validate
    board = Board.find(params.delete(:id))
    coordinates = board.send(:"valid_#{params.delete(:position)}_position?", params.symbolize_keys)
    render(json: { success: coordinates.present?, coordinates: coordinates })
  end
end
