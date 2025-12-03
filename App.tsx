import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ImageEditor } from './components/ImageEditor';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {!selectedImage ? (
          <div className="max-w-2xl mx-auto flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 mt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                用 <span className="text-taiwaka-500">Taiwaka</span> 重塑图像
              </h1>
              <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
                上传照片，简单描述你想要的改变。
                由 Google Gemini 2.5 Flash 驱动。
              </p>
            </div>
            
            <ImageUpload onImageSelect={setSelectedImage} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-75">
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-3 font-bold">1</div>
                    <h3 className="font-medium text-gray-900">上传</h3>
                    <p className="text-sm text-gray-500 mt-1">首先将图片拖入编辑器。</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 font-bold">2</div>
                    <h3 className="font-medium text-gray-900">提示词</h3>
                    <p className="text-sm text-gray-500 mt-1">描述变化："变成雪景"，"加一只猫"。</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-3 font-bold">3</div>
                    <h3 className="font-medium text-gray-900">转换</h3>
                    <p className="text-sm text-gray-500 mt-1">见证 Gemini 在几秒钟内重绘像素。</p>
                </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <ImageEditor 
              initialImage={selectedImage} 
              onReset={() => setSelectedImage(null)} 
            />
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Taiwaka AI. 保留所有权利。</p>
      </footer>
    </div>
  );
};

export default App;