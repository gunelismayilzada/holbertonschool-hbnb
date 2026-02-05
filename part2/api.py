from flask import Blueprint, request
from flask_restx import Api, Resource
from business_logic.facade import HBnBFacade

api_bp = Blueprint("api", __name__, url_prefix="/api")
api = Api(api_bp)

facade = HBnBFacade()

@api.route("/ping")
class Ping(Resource):
    def get(self):
        return {"message": "HBnB API is running "}
