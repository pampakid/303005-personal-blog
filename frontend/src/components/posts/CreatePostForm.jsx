// frontend/src/components/posts/CreatePostForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../api';

export default function CreatePostForm() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Convert tags string to array and trim whitespace
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const postData = {
                title: formData.title,
                content: formData.content,
                tags: tagsArray
            };

            await postsAPI.createPost(postData);
            navigate('/');
        } catch (err) {
            setError(err.error || 'Failed to create post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field mt-1"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        rows={8}
                        required
                        value={formData.content}
                        onChange={handleChange}
                        className="input-field mt-1"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                    </label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Enter tags separated by commas"
                        className="input-field mt-1"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Separate tags with commas (e.g., programming, web development, react)
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                    >
                        {isLoading ? 'Creating...' : 'Create Post'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}