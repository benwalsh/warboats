# frozen_string_literal: true
ENV['RAILS_ENV'] = 'test'

require File.expand_path('../../config/environment', __FILE__)
require 'database_cleaner'
require 'factory_girl'

Dir.glob(Rails.root.join('spec', 'support', '**', '*.rb')).each { |f| require f }

RSpec.configure do |config|
  config.mock_with :rspec
  config.include Devise::TestHelpers, type: :controller
  config.include FactoryGirl::Syntax::Methods
  config.pattern = '**/*_spec.rb'
  config.raise_errors_for_deprecations!
  config.expect_with(:rspec) { |c| c.syntax = :expect }
  config.before(:suite) { DatabaseCleaner.clean_with(:truncation) }
  config.before(:all) { |example| print "#{example.class.description}: " }
  config.after(:all) { puts }
  config.before(:each) do
    DatabaseCleaner.start
    Rails.application.load_seed
  end
end
