# frozen_string_literal: true
class PositionValidator < ActiveModel::Validator
  def validate(record)
    size = Boat::MODELS[record.model.to_sym]
    record.errors.add(:base, :invalid_type) unless size
    record.errors.add(:base, :invalid_position) unless record.orientation.in?(Boat::ORIENTATIONS.values)
    if record.orientation == Boat::ORIENTATIONS[:vertical]
      record.errors.add(:base, :invalid_position) if record.y + size > Board::SIZE
      size.times { |i| record.errors.add(:base, :occupied) if record.board.boat_at_coordinate(record.x, record.y + i) }
    elsif record.orientation == Boat::ORIENTATIONS[:horizontal]
      record.errors.add(:base, :invalid_position) if record.x + size > Board::SIZE
      size.times { |i| record.errors.add(:base, :occupied) if record.board.boat_at_coordinate(record.x + i, record.y) }
    end
  end
end
