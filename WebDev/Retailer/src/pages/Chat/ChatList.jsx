import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [newChatUserId, setNewChatUserId] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('http://localhost:4000/chat/chat', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const data = await res.json();
        setChats(data);

        const partnerIds = data.map(chat => chat.participants.find(id => id !== userId));
        const uniquePartnerIds = [...new Set(partnerIds)];
        const newUserMap = {};

        await Promise.all(
          uniquePartnerIds.map(async (id) => {
            const res = await fetch(`http://localhost:4000/user/getUser/${id}`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              credentials: 'include',
            });

            const user = await res.json();
            newUserMap[id] = user.name || user.username || `User ${id}`;
          })
        );

        setUserMap(newUserMap);
      } catch (err) {
        console.error("Error while fetching chats or user details:", err);
      }
    };

    fetchChats();
  }, [token, userId]);

  const openChat = (chat) => {
    const partnerId = chat.participants.find(id => id !== userId);
    navigate(`/chat/${partnerId}`);
  };

  const startNewChat = () => {
    if (newChatUserId && newChatUserId !== userId) {
      navigate(`/chat/${newChatUserId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">💬 Your Chats</h1>

        <div className="flex items-center mb-6">
          <input
            type="text"
            value={newChatUserId}
            onChange={(e) => setNewChatUserId(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter user ID to start new chat"
          />
          <button
            onClick={startNewChat}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-r-xl transition"
          >
            ➕ Start Chat
          </button>
        </div>

        <div className="space-y-4">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const partnerId = chat.participants.find(id => id !== userId);
              const displayName = userMap[partnerId] || 'Loading...';
              return (
                <div
                  key={chat._id}
                  className="p-4 bg-gray-100 rounded-xl shadow-sm cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => openChat(chat)}
                >
                  <h2 className="text-lg font-semibold text-gray-800">👤 {displayName}</h2>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No chats available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;