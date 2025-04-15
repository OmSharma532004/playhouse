import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatRoom = () => {
  const { userId: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [userName, setUserName] = useState('');
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

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/user/getuser/${receiverId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const receiverData = await res.json();
        setReceiverName(receiverData.name);
      } catch (err) {
        console.error('Failed to fetch receiver info:', err);
      }

      try {
        const userRes = await fetch(`http://localhost:4000/user/getuser/${userId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await userRes.json();
        setUserName(userData.name);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchMessages();
    fetchUserData();
  }, [receiverId, userId, token]);

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 text-white">
      <div className="text-center text-2xl font-semibold mb-6">
        Chatting with <span className="text-yellow-400">{receiverName}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const senderId =
              typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;

            const isMine = senderId?.toString() === userId?.toString();
            const senderName = isMine ? userName : receiverName;

            return (
              <div key={index}>
                <div className={`text-sm ${isMine ? 'text-right' : 'text-left'} text-gray-200 mb-1`}>
                  <span className="font-bold">{senderName}</span>
                </div>
                <div
                  className={`p-4 rounded-3xl max-w-[70%] ${isMine ? 'bg-blue-600 text-white ml-auto' : 'bg-pink-300 text-black mr-auto'}`}
                >
                  <div className={`p-3 rounded-lg shadow-xl ${isMine ? 'bg-gradient-to-r from-blue-400 to-blue-700' : 'bg-gradient-to-r from-pink-300 to-pink-600'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-200 text-lg animate-pulse">No messages yet. Start the conversation!</div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex items-center mt-8 space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-4 rounded-xl bg-white text-black shadow-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl shadow-xl hover:scale-105 transform transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;