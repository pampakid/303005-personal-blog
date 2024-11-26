# backend/app/cli.py
import click
from flask.cli import with_appcontext
from app import db
from app.models import User, Post, Tag  # Import all models

def init_app(app):
    app.cli.add_command(init_db_command)

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear existing data and create new tables."""
    db.drop_all()  # Drop existing tables
    db.create_all()  # Create new tables
    click.echo('Initialized the database.')