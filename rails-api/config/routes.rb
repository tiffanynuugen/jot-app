Rails.application.routes.draw do
  resources :notes
  resources :users, only: [:index, :show, :create, :destroy]
end
