class InMemoryRepository:
    def __init__(self):
        self.storage = {}

    def add(self, obj):
        obj_type = type(obj).__name__
        if obj_type not in self.storage:
            self.storage[obj_type] = []
        self.storage[obj_type].append(obj)

    def get_all(self, obj_type):
        return self.storage.get(obj_type, [])

    def get_by_id(self, obj_type, obj_id):
        for obj in self.storage.get(obj_type, []):
            if obj.id == obj_id:
                return obj
        return None
