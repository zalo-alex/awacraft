from flask import Flask, render_template, request, session
from flask_migrate import Migrate
from src.models import db, User
from src.auth import set_user_session, get_user
from flask_sock import Sock
from src.games import Games
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///db.sqlite' # TODO: Should use the volume for docker !
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = os.urandom(24)

sock = Sock(app)

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/auth/register", methods=["POST"])
def api_auth_register():
    username = request.json.get("username")
    password = request.json.get("password")

    if not username or not password:
        return {
            "message": "Username and password are required."
        }, 400
    
    if not (2 < len(username) < 21):
        return {
            "message": "Username should be from 3 to 21 letters"
        }
    
    if len(password) < 8:
        return {
            "message": "Password is too small, min 8 chars"
        }

    if User.query.filter_by(username=username).first():
        return {
            "message": "Username already used."
        }, 400

    user = User(username=username)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return {
        "message": "User created."
    }, 400

@app.route("/api/auth/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    if not username or not password:
        return {
            "message": "Username and password are required."
        }, 400
    
    user = User.query.filter_by(username=username).one_or_none()
    if not user:
        return {
            "message": "Username not found."
        }, 400
    
    if not user.check_password(password):
        return {
            "message": "Invalid password."
        }, 400

    set_user_session(user)
    return {
        "message": "Successfuly logged-in."
    }, 200

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.pop('user', None)
    return {
        "message": "OK."
    }

@app.route("/api/user")
def api_user():
    return get_user()

@app.route("/api/games/available")
def api_games_available():
    return Games.list_available()

@app.route("/api/games/create", methods=["POST"])
def api_games_create():
    name = request.json.get("name")

    if name < 2 or name > 20:
        return {
            "message": "Invalid name length, should be between 2 and 20"
        }
    Games.create(name, None)

@sock.route("/ws")
def ws(client):
    pass

if __name__ == "__main__":
    app.run(debug=True)