from flask import session
from src.models import User

def is_logged():
    return bool(session.get("user"))

def auth_route(func):
    def wrapper(*args, **kwargs):
        if not is_logged():
            return {
                "error": "Unauthorized"
            }, 401
        
        user = User.query.filter_by(id=session.get("user", {}).get("id")).one_or_404()
        return func(user, *args, **kwargs)
    
    wrapper.__name__ = func.__name__ 
    return wrapper

def get_user():
    user = User.query.filter_by(id=session.get("user", {}).get("id")).one_or_none()
    if not user:
        return {}
    return {
        "username": user.username
    }

def set_user_session(user):
    session["user"] = {
        "id": user.id
    }