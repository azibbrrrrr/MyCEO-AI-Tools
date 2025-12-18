import React from 'react';
import DashboardMap from '@/components/map-dashboard/DashboardMap';
import MapProfileHeader from '@/components/map-dashboard/MapProfileHeader';
import { CURRENT_USER } from '@/constants/mapDashboard.constants';

function MapDashboardPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100 font-fredoka select-none">
      {/* Main Game/Map Area */}
      <DashboardMap />

      {/* UI Overlays */}
      <MapProfileHeader user={CURRENT_USER} />
    </div>
  );
}

export default MapDashboardPage;
