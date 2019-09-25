class User < ApplicationRecord
  has_many :notes

  validates :name, uniqueness: true
  validates :name, length: { minimum: 3 }
end
