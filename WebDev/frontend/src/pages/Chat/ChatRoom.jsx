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
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <header className="px-6 py-5 bg-white shadow-md border-b sticky top-0 z-10">
        <h1 className="text-xl font-semibold">
          💬 Chatting with <span className="text-blue-600">{receiverName}</span>
        </h1>
      </header>
  
      <main className="flex-1 px-6 py-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-blue-300">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
            const isMine = senderId?.toString() === userId?.toString();
            const senderName = isMine ? userName : receiverName;
  
            return (
              <div
                key={index}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end`}
              >
                {!isMine && (
                  <div className="mr-3 w-9 h-9 bg-blue-200 text-blue-800 font-bold flex items-center justify-center rounded-full text-base">
                    {receiverName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div
                    className={`text-base mb-1 ${isMine ? 'text-right text-gray-400' : 'text-left text-gray-500'}`}
                  >
                    {senderName}
                  </div>
                  <div
                    className={`rounded-2xl px-6 py-4 text-lg leading-snug shadow-md ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 mt-20 text-xl">No messages yet. Start chatting 👋</div>
        )}
        <div ref={bottomRef}></div>
      </main>
  
      <footer className="bg-white border-t px-6 py-5 flex items-center gap-4 sticky bottom-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-5 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition text-lg"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default ChatRoom;