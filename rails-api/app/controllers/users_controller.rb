class UsersController < ApplicationController
  before_action :set_user, only: [:show, :destroy]

  def index
    @users = User.all
    render json: @users, status: 200
  end
  
  def show
    render json: @user, status: 200
  end

  def create
    @user = User.create(user_params)
    render json: @user, status: 201
  end
  
  def destroy
    @user.destroy
    render json: {message:"user deleted", id: @user.id, name: @user.name}
  end

  private
  def user_params
    params.require(:user).permit(:name)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
