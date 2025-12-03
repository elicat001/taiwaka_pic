import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Download, Wand2, X, Type } from 'lucide-react';
import { Button } from './Button';
import { editImageWithGemini } from '../services/geminiService';
import { EditorStatus } from '../types';

interface ImageEditorProps {
  initialImage: string;
  onReset: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<EditorStatus>(EditorStatus.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [preserveText, setPreserveText] = useState(true);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus(EditorStatus.LOADING);
    setError(null);
    setGeneratedImage(null);

    try {
      // Construct the final prompt based on settings
      let finalPrompt = prompt;
      
      if (preserveText) {
        finalPrompt += ". IMPORTANT: Keep all existing text, labels, logos, and Chinese characters EXACTLY as they are in the original image. Do not blur, distort, morph, or change the language of the text. The text must remain legible and sharp.";
      }

      const result = await editImageWithGemini(initialImage, finalPrompt);
      setGeneratedImage(result);
      setStatus(EditorStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "生成图片时出现问题。");
      setStatus(EditorStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const img = new Image();
    img.src = generatedImage;
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Handle transparency for JPG by filling white background
      if (downloadFormat === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = downloadFormat === 'png' ? 'image/png' : 'image/jpeg';
      // Use 1.0 quality to prevent compression artifacts during download
      const dataUrl = canvas.toDataURL(mimeType, 1.0);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `taiwaka-edit-${Date.now()}.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                你想让 Taiwaka 如何编辑这张图片？
              </label>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：'把它变成素描风格'，'添加霓虹光效'，'移除背景'"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-taiwaka-500 focus:ring-2 focus:ring-taiwaka-200 transition-all outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <div className="absolute right-3 top-3 text-gray-400">
                <Wand2 size={20} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto mt-6 md:mt-0">
             {/* Options Row */}
             <div className="flex items-center gap-2 mb-1 md:mb-0">
                <button
                  onClick={() => setPreserveText(!preserveText)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    preserveText 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                  title="尝试保持原文清晰可读"
                >
                  <Type size={16} />
                  <span className="font-medium">保留文字</span>
                  {preserveText && <span className="ml-1 w-2 h-2 rounded-full bg-blue-500"></span>}
                </button>
             </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleGenerate} 
                isLoading={status === EditorStatus.LOADING}
                className="w-full md:w-auto whitespace-nowrap"
              >
                生成
              </Button>
              <Button 
                variant="outline" 
                onClick={onReset}
                className="w-auto"
                title="上传新图片"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Suggested prompts pills */}
        <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider mr-2 py-1.5">尝试：</span>
            {['赛博朋克风格', '油画质感', '添加烟花', '黑白炭笔画'].map((suggestion) => (
                <button 
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                >
                    {suggestion}
                </button>
            ))}
        </div>
      </div>

      {/* Error Message */}
      {status === EditorStatus.ERROR && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
           <span className="font-semibold">错误：</span> {error}
        </div>
      )}

      {/* Image Comparison Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-semibold text-gray-700">原图</h3>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner group flex items-center justify-center min-h-[400px]">
            <img 
              src={initialImage} 
              alt="Original" 
              className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
            />
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-semibold text-gray-700">Taiwaka 结果</h3>
            {generatedImage && (
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'jpg')}
                  className="text-xs font-medium text-gray-600 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-gray-900 py-1 pl-2 pr-1 h-full rounded-md outline-none"
                  aria-label="选择下载格式"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </select>
                <div className="w-px h-4 bg-gray-200 mx-1"></div>
                <button 
                  onClick={handleDownload}
                  className="text-sm flex items-center gap-1.5 text-taiwaka-600 hover:text-taiwaka-700 font-medium transition-colors px-2 py-1 hover:bg-taiwaka-50 rounded-md"
                >
                  <Download size={14} />
                  保存
                </button>
              </div>
            )}
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner flex items-center justify-center min-h-[400px]">
            {status === EditorStatus.LOADING ? (
              <div className="flex flex-col items-center gap-3 text-taiwaka-600 animate-pulse">
                <RefreshCw size={40} className="animate-spin" />
                <p className="text-sm font-medium">正在施展魔法...</p>
                {preserveText && <p className="text-xs text-taiwaka-400">正在保留文字细节...</p>}
              </div>
            ) : generatedImage ? (
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain animate-in fade-in duration-700"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl m-4 w-full h-[90%] justify-center">
                <ArrowRight size={48} className="mb-4 opacity-20" />
                <p>输入提示词并点击生成，在此查看结果。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};