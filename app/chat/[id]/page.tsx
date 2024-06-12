'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import io from 'socket.io-client';
import { Textarea } from './../../components/ui/textarea';
import { Button } from './../../components/ui/button';
import { SendIcon } from './../../components/ui/icons';

const socket = io('http://localhost:3001'); // Подключаемся к серверу

export default function Chat() {
  const router = useRouter();
  const pathname = usePathname();
  const conversationId = pathname.split('/').pop();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || !user) {
      router.push('/login');
    } else {
      setUser(user);
      socket.emit('join', user._id);
    }

    fetch(`http://localhost:3001/api/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages));
  }, [conversationId, router]);

  useEffect(() => {
    socket.on('message', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('typing', (typingUser: string) => {
      setTypingUser(typingUser);
    });

    socket.on('stopTyping', () => {
      setTypingUser(null);
    });

    socket.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.emit('leave', user?._id);
    };
  }, [user]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { conversationId, userId: user._id, text: message });
      setMessage('');
      socket.emit('stopTyping');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      socket.emit('typing', user._id);
    } else {
      socket.emit('stopTyping');
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900">
      <header className="bg-gray-800 px-4 py-3 shadow flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-100">Chat</h2>
        <div className="text-gray-400">Online: {onlineUsers.join(', ')}</div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg p-3 max-w-[70%] ${
                msg.sender._id === user._id ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="font-medium">{msg.sender.username}</div>
              <div className="text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      {typingUser && (
        <div className="px-4 py-2 text-gray-400">
          {typingUser} is typing...
        </div>
      )}
      <div className="bg-gray-800 px-4 py-3 shadow">
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            className="w-full rounded-lg border border-gray-600 p-2 pr-12 bg-gray-700 text-gray-100"
            value={message}
            onChange={handleTyping}
          />
          <Button type="submit" size="icon" className="absolute top-1/2 right-3 -translate-y-1/2" onClick={sendMessage}>
            <SendIcon className="w-5 h-5 text-gray-100" />
          </Button>
        </div>
      </div>
    </div>
  );
}
