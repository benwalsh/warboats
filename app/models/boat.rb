# frozen_string_literal: true
class Boat < ActiveRecord::Base
  belongs_to :board

  MODELS = {
    flier_holder: 5,
    war_boat: 4,
    underwater_boat: 3,
    damager: 3,
    wanderer: 2
  }.freeze

  ORIENTATIONS = {
    horizontal: 0,
    vertical: 1
  }.freeze

  validates :board, presence: true
  validates :orientation, numericality: { only_integer: true,
                                          greater_than_or_equal_to: ORIENTATIONS.values.min,
                                          less_than_or_equal_to: ORIENTATIONS.values.max
  }

  validates_with PositionValidator

  def coordinates
    [].tap do |coordinate_set|
      size.times do |i|
        if horizontal?
          coordinate_set.push([x + i, y])
        elsif vertical?
          coordinate_set.push([x, y + i])
        end
      end
    end
  end

  def horizontal?
    orientation == ORIENTATIONS[:horizontal]
  end

  def vertical?
    orientation == ORIENTATIONS[:vertical]
  end

  def size
    MODELS[model.to_sym]
  end
end
