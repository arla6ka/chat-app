'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface User {
  _id: string;
  username: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    fetch('http://localhost:3001/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Users:', data);
        setUsers(data.filter((user: User) => user._id !== currentUser._id)); // Исключаем текущего пользователя
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const startChat = async (participantId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3001/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ participantId }),
    });
    const conversation = await res.json();
    router.push(`/chat/${conversation._id}`);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {users.map((user) => (
        <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
              {user.username}
            </h3>
            <Button variant="solid" className="mt-4 w-full" onClick={() => startChat(user._id)}>
              Start Chat
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
