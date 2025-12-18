import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const ProductIdeaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pastel-sky font-fredoka p-6 flex flex-col items-center">
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
          <div className="bg-orange-100 p-3 rounded-2xl border-4 border-white shadow-cartoon">
            <Lightbulb size={32} className="text-orange-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Product Idea Hub</h1>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl animate-bounce-in">
        <Card className="p-8 rounded-[32px] border-4 border-white shadow-cartoon bg-white relative overflow-hidden">
          {/* Decorative Sparkles */}
          <Sparkles className="absolute top-4 right-4 text-yellow-400 animate-pulse" size={24} />
          <Sparkles className="absolute bottom-10 left-4 text-blue-400 animate-bounce" size={20} />

          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            What's your next big idea? 🚀
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-500 mb-2 uppercase tracking-wider">
                Product Name
              </label>
              <Input 
                placeholder="Super Cool Gadget..." 
                className="rounded-2xl border-2 border-gray-100 h-14 text-lg focus:border-pastel-green-dark transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-500 mb-2 uppercase tracking-wider">
                What does it do?
              </label>
              <textarea 
                className="w-full rounded-2xl border-2 border-gray-100 p-4 h-32 text-lg focus:border-pastel-green-dark transition-colors focus:ring-0 resize-none"
                placeholder="Tell us about the magic..."
              />
            </div>

            <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-black text-xl shadow-cartoon hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Generate AI Feedback
              <Send size={24} />
            </Button>
          </div>
        </Card>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-2xl border-2 border-white shadow-cartoon">
            <h3 className="font-black text-blue-800 text-sm mb-1 uppercase">Pro Tip #1</h3>
            <p className="text-blue-700 text-xs">A great product solves a problem! Ask your friends what they struggle with. 💡</p>
          </div>
          <div className="bg-green-100 p-4 rounded-2xl border-2 border-white shadow-cartoon">
            <h3 className="font-black text-green-800 text-sm mb-1 uppercase">Pro Tip #2</h3>
            <p className="text-green-700 text-xs">Keep it simple! Some of the best products do just one thing perfectly. ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductIdeaPage;
