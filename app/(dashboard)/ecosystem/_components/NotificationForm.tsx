'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';

export function NotificationForm() {
  const [msg, setMsg] = useState('');
  const maxLen = 160;

  return (
    <GlassPanel card className="space-y-4">
      <h3 className="text-sm font-bold text-white">Push Notification</h3>
      <Input
        label="Tiêu đề"
        placeholder="Nhập tiêu đề thông báo"
        leftIcon="megaphone-outline"
      />
      <Select
        label="Đối tượng"
        options={[
          { label: 'Tất cả người dùng', value: 'all' },
          { label: 'Premium', value: 'premium' },
          { label: 'Free', value: 'free' },
        ]}
      />
      <div>
        <Textarea
          label="Nội dung"
          placeholder="Nhập nội dung thông báo..."
          rows={3}
          maxLength={maxLen}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <p className="mt-1 text-right text-xs text-slate-500">
          {msg.length}/{maxLen}
        </p>
      </div>

      {/* Mobile preview mockup */}
      <div className="border-surface-border bg-surface-dark mx-auto w-48 rounded-2xl border p-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="bg-primary/30 h-6 w-6 rounded-full" />
          <span className="text-[10px] text-slate-400">HITRI TECH</span>
        </div>
        <p className="line-clamp-3 text-xs text-white">
          {msg || 'Preview notification...'}
        </p>
      </div>

      <Button className="w-full" iconLeft="send-outline">
        Gửi thông báo
      </Button>
    </GlassPanel>
  );
}
