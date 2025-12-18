import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PackagingIdeaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pastel-green-light font-fredoka p-6 flex flex-col items-center">
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
          <div className="bg-green-100 p-3 rounded-2xl border-4 border-white shadow-cartoon">
            <Package size={32} className="text-amber-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Packaging Designer</h1>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 animate-bounce-in">
        <Card className="p-8 rounded-[32px] border-4 border-white shadow-cartoon bg-white flex flex-col items-center justify-center min-h-[400px] group transition-all">
          <div className="w-48 h-48 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group-hover:border-green-400 group-hover:text-green-400 transition-colors">
            <Package size={64} className="mb-2 opacity-50" />
            <span className="font-bold">Your Design Here</span>
          </div>
          <p className="mt-6 text-gray-500 font-medium text-center">
            Upload your product sketch to see it in 3D packaging!
          </p>
          <Button className="mt-8 bg-green-500 hover:bg-green-600 text-white font-black px-8 py-6 rounded-2xl shadow-cartoon">
            Upload Sketch
          </Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 rounded-[24px] border-4 border-white shadow-cartoon bg-white">
            <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={20} />
              AI Design Styles
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['Minimalist', 'Vibrant', 'Eco-Friendly', 'Futuristic'].map((style) => (
                <button key={style} className="p-4 rounded-xl border-2 border-gray-100 font-bold text-gray-600 hover:border-green-400 hover:text-green-500 transition-all text-sm">
                  {style}
                </button>
              ))}
            </div>
          </Card>

          <Button className="w-full h-20 rounded-2xl bg-gradient-to-r from-green-400 to-teal-500 text-white font-black text-2xl shadow-cartoon hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4">
            Magic Render
            <Wand2 size={32} />
          </Button>

          <div className="bg-amber-100 p-4 rounded-2xl border-2 border-white shadow-cartoon flex gap-4 items-start">
            <div className="bg-white p-2 rounded-xl border-2 border-amber-200 shadow-sm shrink-0">
               💡
            </div>
            <div>
              <p className="text-amber-900 text-sm font-bold">Did you know?</p>
              <p className="text-amber-800 text-xs">Eco-friendly packaging can increase sales by 20% for Gen Z customers!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagingIdeaPage;
