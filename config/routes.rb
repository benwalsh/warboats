# frozen_string_literal: true
Rails.application.routes.draw do
  resources :boards, only: [] do
    member { get :validate }
    member { get :fire }
  end

  root 'home#index'
end
