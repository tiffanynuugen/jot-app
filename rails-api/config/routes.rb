Rails.application.routes.draw do
  resources :users, only: [:index, :show, :create, :destroy] do
    resources :notes
  end
end
