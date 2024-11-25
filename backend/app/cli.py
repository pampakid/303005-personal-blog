# backend/app/cli.py
import click
from flask.cli import with_appcontext
from app import db

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear existing data and create new tables."""
    db.create_all()
    click.echo('Database initialized')