'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import UserList from '../components/UserList';

export default function Chats() {
  const [conversations, setConversations] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://https://chat-app-back-red.vercel.app/api/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Conversations:', data);
        setConversations(data);
      });
  }, [router]);

  const selectChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Select a chat
          </h1>
        </div>
        <UserList />
        <div className="grid grid-cols-1 gap-6">
          {conversations.map((conversation) => (
            <div key={conversation._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                  {conversation.participants.map((p: any) => p.username).join(', ')}
                </h3>
                <Button variant="solid" className="mt-4 w-full" onClick={() => selectChat(conversation._id)}>
                  Open Chat
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
