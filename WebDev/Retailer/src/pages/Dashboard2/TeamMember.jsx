import React from 'react';

const TeamMembers = () => {
  const team = [
    { name: 'Om Sharma', role: 'Mach' },
    { name: 'Christian Mad', role: 'Product Designer' },
    { name: 'Tom Holland', role: 'Content Creator' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Team Members</h2>
      <div className="space-y-3">
        {team.map((member, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-gray-500">{member.role}</p>
            </div>
            <button className="text-indigo-600">More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
