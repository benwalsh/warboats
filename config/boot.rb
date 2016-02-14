# frozen_string_literal: true
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup'
require 'rails/commands/server'

module DefaultOptions
  def default_options
    super.merge!(Host:  '0.0.0.0', Port: 3000)
  end
end

Rails::Server.prepend(DefaultOptions)
