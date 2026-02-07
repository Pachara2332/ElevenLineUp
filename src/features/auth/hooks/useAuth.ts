
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser() {
  const res = await fetch('/api/auth/me');
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to fetch user');
  const data = await res.json();
  return data.data.user as User;
}

async function loginUser(credentials: { email: string; password: string }) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
}

async function registerUser(credentials: { name: string; email: string; password: string }) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
}

async function logoutUser() {
  const res = await fetch('/api/auth/logout', { method: 'POST' });
  if (!res.ok) throw new Error('Logout failed');
  return res.json();
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
      mutationFn: loginUser,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
          router.push('/select-team');
          router.refresh();
      }
  });

  const registerMutation = useMutation({
      mutationFn: registerUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        router.push('/select-team');
        router.refresh();
      }
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      router.push('/login');
      router.refresh();
    },
  });

  return {
    user,
    isLoading: isUserLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: !!user,
    login: (email: string, password: string) => loginMutation.mutate({ email, password }),
    register: (name: string, email: string, password: string) => registerMutation.mutate({ name, email, password }),
    logout: logoutMutation.mutate,
    error: loginMutation.error || registerMutation.error || (userError as Error),
  };
}
