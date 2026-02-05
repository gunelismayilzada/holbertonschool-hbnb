from persistence.repository import InMemoryRepository
from business_logic.user import User
from business_logic.place import Place
from business_logic.review import Review
from business_logic.amenity import Amenity

class HBnBFacade:
    def __init__(self):
        self.repo = InMemoryRepository()

    def create_user(self, id, name):
        user = User(id, name)
        self.repo.add(user)
        return user

    def get_all_users(self):
        return self.repo.get_all("User")

    def create_place(self, id, title):
        place = Place(id, title)
        self.repo.add(place)
        return place

    def get_all_places(self):
        return self.repo.get_all("Place")
