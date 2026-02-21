'use client';

import { useState } from 'react';

type UserData = {
    userId: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    _count: {
        posts: number;
        comments: number;
        lineups: number;
    };
};

export default function UsersClient({ initialUsers }: { initialUsers: UserData[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user to ${newRole}?`)) return;

        setIsUpdating(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            });
            if (res.ok) {
                setUsers(users.map(u => u.userId === userId ? { ...u, role: newRole } : u));
            } else {
                alert('Failed to update role.');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating user');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('WARNING: Are you sure you want to completely delete this user? This action cannot be undone.')) return;

        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setUsers(users.filter(u => u.userId !== userId));
            } else {
                alert('Failed to delete user.');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting user');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 font-medium bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-center">Posts / Comments</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((u) => (
                            <tr key={u.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <td className="px-6 py-4 font-bold">{u.name}</td>
                                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold mr-2" title="Posts">P: {u._count.posts}</span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold" title="Comments">C: {u._count.comments}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                                        disabled={isUpdating}
                                        className={`p-1 border rounded dark:bg-gray-900 font-bold ${u.role === 'ADMIN' ? 'text-red-600' : 'text-emerald-600'}`}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleDelete(u.userId)}
                                        className="text-red-500 hover:text-red-700 font-semibold"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
