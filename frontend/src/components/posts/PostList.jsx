// frontend/src/components/posts/PostList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../api';
import { format } from 'date-fns';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postsAPI.getAllPosts();
            setPosts(response);
        } catch (err) {
            setError('Failed to fetch posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button 
                    onClick={fetchPosts}
                    className="mt-4 btn-secondary"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No posts yet!</p>
                <Link to="/posts/new" className="mt-4 btn-primary inline-block">
                    Create your first post
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {posts.map((post) => (
                <article
                    key={post.id}
                    className="border-b border-gray-200 pb-10"
                >
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                        <div className="space-y-5 xl:col-span-3">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        <Link 
                                            to={`/posts/${post.id}`}
                                            className="text-gray-900 hover:text-blue-600"
                                        >
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <div className="flex gap-x-4 text-xs text-gray-500">
                                        <time dateTime={post.created_at}>
                                            {format(new Date(post.created_at), 'MMMM d, yyyy')}
                                        </time>
                                        <span>·</span>
                                        <span>{post.author}</span>
                                    </div>
                                </div>
                                <div className="prose max-w-none text-gray-500 line-clamp-3">
                                    {post.content}
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
                            </div>
                            <div className="text-base font-medium">
                                <Link
                                    to={`/posts/${post.id}`}
                                    className="text-blue-600 hover:text-blue-500"
                                >
                                    Read more →
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}