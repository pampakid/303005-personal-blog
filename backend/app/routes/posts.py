# backend/app/routes/posts.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.post import Post, Tag
from app import db
import traceback

bp = Blueprint('posts', __name__)

@bp.route('/api/posts', methods=['POST'])
@login_required
def create_post():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        print(f"Received data: {data}")  # Debug print
        print(f"Current user: {current_user}")  # Debug print
        
        # Create new post
        post = Post(
            title=data.get('title'),
            content=data.get('content'),
            user_id=current_user.id
        )
        
        # Handle tags
        if 'tags' in data and isinstance(data['tags'], list):
            for tag_name in data['tags']:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                post.tags.append(tag)
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Post created successfully',
            'post': {
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': current_user.username,
                'created_at': post.created_at.isoformat(),
                'tags': [tag.name for tag in post.tags]
            }
        }), 201
        
    except Exception as e:
        print(f"Error creating post: {str(e)}")
        print("Traceback:")
        print(traceback.format_exc())
        db.session.rollback()
        return jsonify({'error': 'Failed to create post', 'details': str(e)}), 500

@bp.route('/api/posts', methods=['GET'])
def get_posts():
    try:
        posts = Post.query.order_by(Post.created_at.desc()).all()
        return jsonify([{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': post.author.username,
            'created_at': post.created_at.isoformat(),
            'tags': [tag.name for tag in post.tags]
        } for post in posts])
    except Exception as e:
        print(f"Error in get_posts: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Failed to fetch posts: {str(e)}'}), 500
    
@bp.route('/api/posts/<int:post_id>', methods=['PUT'])
@login_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    if post.author != current_user:
        return jsonify({'error': 'Unauthorized'}), 403
        
    data = request.get_json()
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    
    # Update tags
    if 'tags' in data:
        tags = []
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            tags.append(tag)
        post.tags = tags
    
    db.session.commit()
    
    return jsonify({
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author': post.author.username,
        'created_at': post.created_at.isoformat(),
        'tags': [tag.name for tag in post.tags]
    })

@bp.route('/api/posts/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    if post.author != current_user:
        return jsonify({'error': 'Unauthorized'}), 403
        
    db.session.delete(post)
    db.session.commit()
    
    return '', 204