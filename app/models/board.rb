# frozen_string_literal: true
class Board < ActiveRecord::Base
  has_many :boats do
    def persisted
      map { |boat| boat if boat.persisted? }
    end
  end

  SIZE = 10

  def boat_at_coordinate(x, y)
    boats.persisted.each { |boat| return boat if boat.coordinates.include?([x.to_i, y.to_i]) }
    false
  end

  def place_boats
    Boat::MODELS.keys.each do |model|
      boat = boats.build(model: model.to_s)
      loop do
        boat.orientation = Boat::ORIENTATIONS.values.sample
        boat.x = Random.new.rand(SIZE)
        boat.y = Random.new.rand(SIZE)
        break if boat.valid?
      end
      boat.save!
    end
  end

  def valid_start_position?(options)
    model = options[:model]
    x = options[:x].to_i
    y = options[:y].to_i
    return false unless model.to_sym.in?(Boat::MODELS.keys)
    return false if boats.where(model: model).any?
    return false if boat_at_coordinate(x, y)
    size = Boat::MODELS[model.to_sym]
    [[x, y + size], [x, y - size], [x + size, y], [x - size, y]].find do |coordinates|
      valid_end_position?(model: model, start_x: x, start_y: y, end_x: coordinates.first, end_y: coordinates.last)
    end
  end

  def valid_save_position?(options)
    boat = valid_end_position?(options)
    return nil unless boat
    boat.save
    boat.coordinates
  end

  def valid_end_position?(options)
    boat = boats.build(model: options[:model].to_s)
    boat.x = [options[:start_x].to_i, options[:end_x].to_i].min
    boat.y = [options[:start_y].to_i, options[:end_y].to_i].min
    boat.orientation = Boat::ORIENTATIONS[options[:start_x] == options[:end_x] ? :vertical : :horizontal].to_i
    boat.valid? ? boat : nil
  end
end
