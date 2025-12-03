import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      onImageSelect(base64);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        onImageSelect(base64);
      }
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragging ? 'border-taiwaka-500 bg-taiwaka-50' : 'border-gray-200 bg-white hover:border-taiwaka-300 hover:bg-gray-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-taiwaka-100 text-taiwaka-600' : 'bg-gray-100 text-gray-400 group-hover:bg-taiwaka-50 group-hover:text-taiwaka-500'}`}>
          <Upload size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          上传图片进行编辑
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          拖放图片到这里，或点击浏览文件。
          支持 JPG, PNG 和 WEBP 格式。
        </p>
      </div>
    </div>
  );
};