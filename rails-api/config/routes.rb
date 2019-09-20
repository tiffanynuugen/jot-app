Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      resources :notes, only: [:index, :create, :update, :destroy, :show]
      resources :users, only: [:index, :create, :update, :destroy, :show]
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
# /api/v1/notes
