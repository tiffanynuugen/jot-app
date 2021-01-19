class User < ApplicationRecord
  has_many :notes, dependent: :destroy

  validates :name, presence: true
  validates :name, length: { minimum: 3 }
  validates :name, uniqueness: true
end
