import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

export default function ImageUpload({ imageFile, setImageFile, imageError, setImageError }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;

    // Allowed extensions
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageError('Only JPG, JPEG, and PNG image files are supported.');
      return;
    }

    // 5MB Limit
    if (file.size > 5 * 1024 * 1024) {
      setImageError('File size exceeds the maximum limit of 5 MB.');
      return;
    }

    setImageError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile({
        file,
        previewUrl: reader.result,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setImageFile(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Attachment (Optional)
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files[0])}
        accept="image/jpeg, image/jpg, image/png"
        className="hidden"
      />

      {/* If Image Loaded -> Show Thumbnail Preview Card */}
      {imageFile ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={imageFile.previewUrl}
              alt="Uploaded Preview"
              className="w-14 h-14 rounded-lg object-cover border border-slate-200"
            />
            <div>
              <p className="text-xs font-semibold text-slate-800 max-w-xs truncate">
                {imageFile.name}
              </p>
              <p className="text-[11px] text-slate-500">{imageFile.size}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Remove attachment"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Drag & Drop Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-5 h-5" />
          </div>

          <p className="text-sm font-semibold text-slate-800 mb-1">
            <span className="text-blue-600 underline">Click to browse</span> or drag and drop image here
          </p>

          <p className="text-xs text-slate-500">
            Supported: JPG, JPEG, PNG (Max: 5 MB)
          </p>
        </div>
      )}

      {/* Error Message */}
      {imageError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{imageError}</span>
        </div>
      )}
    </div>
  );
}
