import React from 'react';
import { UserProfile } from '@/types/mapDashboard.types';

interface MapProfileHeaderProps {
  user: UserProfile;
}

const MapProfileHeader: React.FC<MapProfileHeaderProps> = ({ user }) => {
  return (
    <div className="absolute top-6 left-6 z-20">
      <div className="bg-[#FFF8DC] border-4 border-white rounded-[20px] p-2 pr-6 flex items-center gap-3 shadow-cartoon min-w-[280px]">
        <div className="w-14 h-14 rounded-full bg-blue-200 overflow-hidden border-2 border-white shadow-inner shrink-0">
          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
           <h1 className="text-xl font-black text-[#8BC8DB] tracking-wide" style={{ textShadow: '1px 1px 0px white' }}>
             {user.username}
           </h1>
           <p className="text-xs font-semibold text-gray-600">
             {user.companyName}
           </p>
        </div>
      </div>
    </div>
  );
};

export default MapProfileHeader;
