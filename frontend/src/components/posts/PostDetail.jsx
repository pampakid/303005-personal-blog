// frontend/src/components/posts/PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { postsAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function PostDetail() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await postsAPI.getPost(postId);
            setPost(response);
        } catch (err) {
            setError('Failed to fetch post');
            console.error('Error fetching post:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await postsAPI.deletePost(postId);
            navigate('/');
        } catch (err) {
            setError('Failed to delete post');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Post not found'}</p>
                <Link to="/" className="mt-4 btn-secondary inline-block">
                    Back to Posts
                </Link>
            </div>
        );
    }

    return (
        <article className="max-w-3xl mx-auto py-8">
            <div className="space-y-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {post.title}
                    </h1>
                    <div className="flex gap-x-4 text-sm text-gray-500">
                        <time dateTime={post.created_at}>
                            {format(new Date(post.created_at), 'MMMM d, yyyy')}
                        </time>
                        <span>·</span>
                        <span>{post.author}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="prose max-w-none pt-8 pb-8">
                    {post.content}
                </div>

                {user && post.author === user.username && (
                    <div className="flex gap-4 pt-6 border-t">
                        <Link
                            to={`/posts/${post.id}/edit`}
                            className="btn-primary"
                        >
                            Edit Post
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200"
                        >
                            Delete Post
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}