import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  UploadCloud, 
  Youtube, 
  FileAudio, 
  X, 
  Loader2, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

import { transcriptService } from '../../services/transcript/transcript.service';

export default function GenerateTranscript() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'youtube'
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverError, setServerError] = useState('');
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setServerError('');
    const validTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/m4a',
      'audio/mp3',
      'video/mp4',
      'video/quicktime',
      'video/webm',
    ];

    if (!validTypes.some((t) => selectedFile.type.includes(t.split('/')[1]))) {
      setServerError('Please select a valid audio or video file (MP3, WAV, MP4, MOV, WEBM).');
      return;
    }

    setFile(selectedFile);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setServerError('');

    if (activeTab === 'upload' && !file) {
      setServerError('Please choose an audio or video file to proceed.');
      return;
    }

    if (activeTab === 'youtube') {
      const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (!ytRegex.test(youtubeUrl.trim())) {
        setServerError('Please provide a valid YouTube URL (e.g., https://youtube.com/watch?v=...)');
        return;
      }
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      if (activeTab === 'upload') {
        // Backend Multer expects: upload.single("media")
        formData.append('media', file);
      } else {
        formData.append('youtubeUrl', youtubeUrl.trim());
      }

      const res = await transcriptService.generateTranscript(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      toast.success('Transcript generation started!');
      
      // Navigate to details if ID is returned, or to history
      const transcriptId = res?.transcript?._id || res?.data?._id || res?._id;
      if (transcriptId) {
        navigate(`/dashboard/transcript/${transcriptId}`);
      } else {
        navigate('/dashboard/history');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to process media. Please ensure the file or URL is accessible.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-6 py-12 selection:bg-white selection:text-zinc-950 font-sans">
      
      {/* Editorial Title Block */}
      <div className="text-center mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-white">
          Generate Transcript
        </h1>
        <p className="mt-2 text-[15px] text-zinc-400">
          Transform your speech, audio files, or YouTube links into high-accuracy transcripts
        </p>
      </div>

      {/* Runway-Style Soft Error Banner */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="w-full mb-6 rounded-2xl bg-red-950/40 border border-red-900/50 px-4 py-3 text-center"
          >
            <p className="text-[14px] font-medium text-red-400">{serverError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Switcher (Pill Style) */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('upload');
            setServerError('');
          }}
          className={`h-10 px-5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-zinc-950 shadow-sm'
              : 'bg-[#18181b] text-zinc-400 hover:text-white'
          }`}
        >
          Upload Media
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('youtube');
            setServerError('');
          }}
          className={`h-10 px-5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            activeTab === 'youtube'
              ? 'bg-white text-zinc-950 shadow-sm'
              : 'bg-[#18181b] text-zinc-400 hover:text-white'
          }`}
        >
          YouTube URL
        </button>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Tab 1: Upload Audio / Video */}
        {activeTab === 'upload' && (
          <div>
            {!file ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-[#121215] hover:bg-[#151518] rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="h-12 w-12 rounded-full bg-[#18181b] border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-[15px] font-semibold text-white">
                  Drop your audio or video file here
                </p>
                <p className="text-[13px] text-zinc-500 mt-1">
                  Supports MP3, WAV, M4A, MP4, MOV (up to 500MB)
                </p>
                <span className="mt-4 px-4 py-1.5 rounded-full bg-[#18181b] text-zinc-300 text-[12px] font-medium border border-zinc-800">
                  Browse file
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="w-full bg-[#18181b] border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white shrink-0">
                    <FileAudio className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[14px] font-medium text-white truncate">{file.name}</p>
                    <p className="text-[12px] text-zinc-500 font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={isSubmitting}
                  className="p-1 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: YouTube URL Input */}
        {activeTab === 'youtube' && (
          <div className="space-y-2">
            <div className="relative">
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                aria-label="YouTube Video Link"
                className="w-full h-[52px] pl-11 pr-4 rounded-xl text-[15px] transition-all outline-none bg-[#18181b] text-zinc-100 placeholder:text-zinc-500 border border-transparent focus:border-zinc-700 focus:bg-[#141416]"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Youtube className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[12px] text-zinc-500 px-1">
              Paste any public YouTube video link to extract spoken audio.
            </p>
          </div>
        )}

        {/* Upload Progress Bar (Active only during processing) */}
        {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px] text-zinc-400 font-mono">
              <span>Uploading media...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#18181b] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Pill CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[50px] rounded-full bg-white text-zinc-950 text-[15px] font-semibold transition-all hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-zinc-950" />
              <span>
                {uploadProgress < 100 ? `Uploading (${uploadProgress}%)` : 'Generating transcript...'}
              </span>
            </>
          ) : (
            <span>Generate Transcript</span>
          )}
        </button>
      </form>
    </div>
  );
}