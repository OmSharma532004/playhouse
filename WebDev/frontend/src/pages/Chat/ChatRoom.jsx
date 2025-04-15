import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatRoom = () => {
  const { userId: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // ✅ Clean the userId from localStorage
  const rawUserId = localStorage.getItem('userId');
  const userId = rawUserId?.replace(/^"|"$/g, '');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:4000/chat/chat/${receiverId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [receiverId, token]);

  useEffect(() => {
    socket.emit('join', userId);

    socket.on('receiveMessage', (msg) => {
      const sender = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
      const receiver = typeof msg.receiverId === 'object' ? msg.receiverId._id : msg.receiverId;

      if (
        (sender === receiverId && receiver === userId) ||
        (sender === userId && receiver === receiverId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('receiveMessage');
  }, [receiverId, userId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const message = { receiverId, content: input, senderId: userId };

    socket.emit('sendMessage', message);

    try {
      await fetch('http://localhost:4000/chat/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(message),
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }

    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const senderId =
              typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;

            const isMine = senderId?.toString() === userId?.toString();

            return (
              <div
                key={index}
                className={`p-2 rounded-md max-w-[70%] ${
                  isMine
                    ? 'bg-blue-500 text-white text-right ml-auto'
                    : 'bg-gray-200 text-black text-left mr-auto'
                }`}
              >
                {msg.content}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500">No messages yet.</div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l-xl"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
