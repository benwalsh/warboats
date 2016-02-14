# frozen_string_literal: true
class HomeController < ApplicationController
  def index
    @player_board = Board.new
    @player_board.name = 'player'
    @cpu_board = Board.new
    @cpu_board.name = 'cpu'
    @player_board.save!
    @cpu_board.save!
    @cpu_board.place_boats
  end
end
