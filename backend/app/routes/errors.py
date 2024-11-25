# backend/app/routes/errors.py
from flask import Blueprint, jsonify

bp = Blueprint('errors', __name__)

@bp.app_errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@bp.app_errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500