
'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function CreatePostBox() {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    // 1. Upload Image
    const uploadImage = async (file: File) => {
        const formData = new FormData();    
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include' 
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.url;
    };

    // 2. Create Post
    const createPostMutation = useMutation({
        mutationFn: async () => {
            let imageUrl = null;
            if (file) {
                imageUrl = await uploadImage(file);
            }

            const res = await fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    content,
                    imageUrl
                }),
                headers: { 'Content-Type': 'application/json' },
                 credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to create post');
            return res.json();
        },
        onSuccess: () => {
            setContent('');
            setFile(null);
            setPreview(null);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            if (!f.type.startsWith('image/')) return;

            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const removeImage = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!user) return null;

    return (
        <div className="glass-panel p-6 rounded-3xl mb-8">
            <div className="flex gap-4">
                {/* Avatar placeholder if no user image */}
                <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {user.name.charAt(0)}
                </div>

                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full bg-transparent border-none focus:ring-0 text-emerald-900 placeholder:text-emerald-800/50 resize-none text-lg min-h-[80px]"
                    />

                    {preview && (
                        <div className="relative mt-2 rounded-xl overflow-hidden max-h-[300px] inline-block">
                            <img src={preview} alt="Preview" className="object-cover max-h-[300px]" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 border-t border-emerald-900/10 pt-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold px-3 py-2 rounded-xl hover:bg-emerald-900/10 transition-colors"
                        >
                            <PhotoIcon className="w-6 h-6" />
                            <span>Photo</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        <button
                            onClick={() => createPostMutation.mutate()}
                            disabled={!content.trim() && !file || createPostMutation.isPending}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold shadow-md hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {createPostMutation.isPending ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
