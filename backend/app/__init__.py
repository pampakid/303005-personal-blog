# backend/app/__init__.py
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
import os

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    
    # Configure the Flask application
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-please-change')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 'sqlite:///blog.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions with app
    CORS(app)
    db.init_app(app)
    login_manager.init_app(app)

    # Import models to ensure they're registered with SQLAlchemy
    from app.models.user import User
    from app.models.post import Post, Tag

    # Register blueprints
    from app.routes.auth import bp as auth_bp
    from app.routes.posts import bp as posts_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(posts_bp)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register CLI commands
    from app import cli
    cli.init_app(app)

    return app