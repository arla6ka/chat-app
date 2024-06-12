'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/chats');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
      <form className="max-w-md w-full space-y-6" onSubmit={handleSubmit}>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Register
          </h1>
        </div>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="solid" className="w-full" type="submit">
          Register
        </Button>
      </form>
    </div>
  );
}
