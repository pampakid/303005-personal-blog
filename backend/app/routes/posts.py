# backend/app/routes/posts.py
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.post import Post, Tag
from app import db

bp = Blueprint('posts', __name__)

@bp.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author': post.author.username,
        'created_at': post.created_at,
        'tags': [tag.name for tag in post.tags]
    } for post in posts])

@bp.route('/api/posts', methods=['POST'])
@login_required
def create_post():
    data = request.get_json()
    
    # Handle tags
    tag_names = data.get('tags', [])
    tags = []
    for tag_name in tag_names:
        tag = Tag.query.filter_by(name=tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.session.add(tag)
        tags.append(tag)

    post = Post(
        title=data['title'],
        content=data['content'],
        author=current_user,
        tags=tags
    )
    
    db.session.add(post)
    db.session.commit()

    return jsonify({
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author': post.author.username,
        'created_at': post.created_at,
        'tags': [tag.name for tag in post.tags]
    }), 201

@bp.route('/api/posts/<int:post_id>', methods=['GET'])
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
        'created_at': post.created_at,
        'tags': [tag.name for tag in post.tags]
    }), 200

@bp.route('/api/posts/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)

    if post.author != current_user:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(post)
    db.session.commit()

    return jsonify({'message': 'Post deleted successfully'}), 204