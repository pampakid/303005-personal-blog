// frontend/src/pages/HomePage.jsx
import PostList from '../components/posts/PostList';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function HomePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
                {user && (
                    <Link to="/posts/new" className="btn-primary">
                        Create New Post
                    </Link>
                )}
            </div>
            <PostList />
        </div>
    );
}