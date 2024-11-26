# backend/app/routes/posts.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.post import Post, Tag
from app import db
import traceback  # Add this for detailed error logging

bp = Blueprint('posts', __name__)

@bp.route('/api/posts', methods=['POST'])
@login_required
def create_post():
    try:
        print("Received request to create post")  # Debug log
        data = request.get_json()
        print(f"Request data: {data}")  # Debug log
        
        # Validate required fields
        if not data or 'title' not in data or 'content' not in data:
            return jsonify({'error': 'Title and content are required'}), 400

        print(f"Current user: {current_user}")  # Debug log

        # Create post
        post = Post(
            title=data['title'],
            content=data['content'],
            user_id=current_user.id
        )
        print("Post object created")  # Debug log

        # Handle tags if present
        if 'tags' in data and isinstance(data['tags'], list):
            for tag_name in data['tags']:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                post.tags.append(tag)
            print("Tags processed")  # Debug log

        db.session.add(post)
        db.session.commit()
        print("Post saved to database")  # Debug log

        return jsonify({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': current_user.username,
            'created_at': post.created_at.isoformat(),
            'tags': [tag.name for tag in post.tags]
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error in create_post: {str(e)}")  # Basic error
        print("Detailed traceback:")  # Detailed error
        print(traceback.format_exc())
        return jsonify({'error': f'Failed to create post: {str(e)}'}), 500

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