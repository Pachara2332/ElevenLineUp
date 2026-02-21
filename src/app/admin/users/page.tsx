import prisma from '@/lib/prisma';
import UsersClient from './UsersClient';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        select: {
            userId: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            _count: {
                select: {
                    posts: true,
                    comments: true,
                    lineups: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-gray-500">Edit user roles or remove users from the system.</p>
            {/* Serialize dates for Client Component */}
            <UsersClient initialUsers={JSON.parse(JSON.stringify(users))} />
        </div>
    );
}
