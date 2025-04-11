import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:4000';

const ChatPage = ({ recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  // Get current userId from localStorage
  const userId = localStorage.getItem('userId');

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/chat/chat/${recipientId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const sendMessage = async () => {
    try {
      const res = await fetch(`${BASE_URL}/chat/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: recipientId,
          content: content.trim(),
        }),
      });
      if (!res.ok) throw new Error('Message send failed');

      const newMsg = await res.json();
      setMessages([...messages, newMsg]);
      setContent('');
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [recipientId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow p-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md max-w-[70%] ${
                msg.senderId === userId
                  ? 'bg-blue-200 text-right ml-auto'
                  : 'bg-gray-200 text-left'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-grow p-2 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
