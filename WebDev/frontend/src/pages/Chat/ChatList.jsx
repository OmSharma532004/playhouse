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

        // Extract partner IDs from chat participants
        const partnerIds = data.map(chat => {
          return chat.participants.find(id => id !== userId);
        });

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>

      <div className="mb-6">
        <input
          type="text"
          value={newChatUserId}
          onChange={(e) => setNewChatUserId(e.target.value)}
          className="p-2 border rounded-l-xl w-2/3"
          placeholder="Enter user ID to start new chat"
        />
        <button
          onClick={startNewChat}
          className="bg-green-500 text-white px-4 py-2 rounded-r-xl"
        >
          Start Chat
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
                className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => openChat(chat)}
              >
                <h2 className="text-lg font-semibold">{displayName}</h2>
              </div>
            );
          })
        ) : (
          <p>No chats available</p>
        )}
      </div>
    </div>
  );
};

export default ChatList;
