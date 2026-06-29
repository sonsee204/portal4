'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { toast } from 'sonner';

interface MediaUploadProps {
  onUpload: (base64: string) => Promise<void>;
  uploading: boolean;
  disabled?: boolean;
}

export function MediaUpload({
  onUpload,
  uploading,
  disabled = false,
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ảnh không được lớn hơn 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ hỗ trợ ảnh (JPEG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await onUpload(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || disabled}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? 'Đang tải...' : 'Tải ảnh'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        multiple={false}
      />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        PNG, JPG, WEBP (max 10MB)
      </span>
    </div>
  );
}
