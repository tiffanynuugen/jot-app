Rails.application.routes.draw do
  root to: "notes#index"
  resources :notes
  resources :users, only: [:index, :show, :create, :destroy]
end
