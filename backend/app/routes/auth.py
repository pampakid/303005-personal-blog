# backend/app/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app.models.user import User
from app import db

bp = Blueprint('auth', __name__)

@bp.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['email', 'password']):
            return jsonify({'error': 'Missing email or password'}), 400
            
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            login_user(user)
            return jsonify({
                'message': 'Logged in successfully',
                'user': {
                    'username': user.username,
                    'email': user.email
                }
            })
            
        return jsonify({'error': 'Invalid email or password'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['username', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
            
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
            
        user = User(
            username=data['username'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'username': user.username,
                'email': user.email
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@bp.route('/api/auth/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@bp.route('/api/auth/status')
def auth_status():
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': {
                'username': current_user.username,
                'email': current_user.email
            }
        })
    return jsonify({'authenticated': False}), 401