import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import TeamMembers from './TeamMember';

const Dashboard2= () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 space-y-6">
        <Dashboard />
        {/* <TeamMembers /> */}
      </main>
    </div>
  );
}

export default Dashboard2;
