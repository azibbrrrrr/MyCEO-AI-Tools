import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Users, MapPin, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BoothReadyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pastel-green-med font-fredoka p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/map-dashboard')}
          className="bg-white/50 hover:bg-white/80 rounded-full p-2 border-2 border-white shadow-cartoon"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-3 rounded-2xl border-4 border-white shadow-cartoon">
            <Store size={32} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Booth Ready Mode</h1>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-bounce-in">
        {/* Stat Cards */}
        <Card className="p-6 rounded-[28px] border-4 border-white shadow-cartoon bg-white flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
             <Users size={32} className="text-blue-500" />
          </div>
          <span className="text-3xl font-black text-gray-800">12</span>
          <span className="text-gray-500 font-bold text-sm">Customers Today</span>
        </Card>

        <Card className="p-6 rounded-[28px] border-4 border-white shadow-cartoon bg-white flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
             <BarChart3 size={32} className="text-green-500" />
          </div>
          <span className="text-3xl font-black text-gray-800">RM 450</span>
          <span className="text-gray-500 font-bold text-sm">Total Revenue</span>
        </Card>

        <Card className="p-6 rounded-[28px] border-4 border-white shadow-cartoon bg-white flex flex-col items-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
             <MapPin size={32} className="text-purple-500" />
          </div>
          <span className="text-3xl font-black text-gray-800">Section A</span>
          <span className="text-gray-500 font-bold text-sm">Current Location</span>
        </Card>

        {/* Action Panel */}
        <div className="md:col-span-3">
          <Card className="p-8 rounded-[32px] border-4 border-white shadow-cartoon bg-white overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-black text-gray-800 mb-4">Launch Your Virtual Booth! 🎪</h2>
                <p className="text-gray-600 mb-6 font-medium">Ready to start selling? Open your booth and let the customers come in! You can track sales, chat with customers, and manage inventory.</p>
                <Button className="w-full h-16 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xl shadow-cartoon transition-all">
                  Open Booth Now
                </Button>
              </div>
              <div className="w-full md:w-1/2 bg-gray-50 rounded-3xl h-64 border-4 border-white shadow-inner flex items-center justify-center relative overflow-hidden">
                 {/* Visual placeholder for booth map */}
                 <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="w-12 h-12 bg-gray-400 rounded-lg" />
                   ))}
                 </div>
                 <Store size={80} className="text-gray-200" />
                 <div className="absolute top-4 right-4 bg-green-400 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse">
                   LIVE VIEW
                 </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoothReadyPage;
