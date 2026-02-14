'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';

export function NotificationForm() {
  const [msg, setMsg] = useState('');
  const maxLen = 160;

  return (
    <GlassPanel card={false} className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <IonIcon name="megaphone-outline" className="text-primary" />
          Push Notification Center
        </h3>
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          System Ready
        </div>
      </div>

      {/* Content - 2 columns */}
      <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6">
          <Input
            label="Campaign Title"
            placeholder="e.g. Weekend Tournament Alert!"
            leftIcon="megaphone-outline"
          />
          <Select
            label="Target Audience"
            options={[
              { label: 'All Users (Ao Trình Ecosystem)', value: 'all' },
              { label: 'Football Players Only', value: 'football' },
              { label: 'Badminton Players Only', value: 'badminton' },
              { label: 'Pickleball Players Only', value: 'pickleball' },
              { label: 'Inactive Users (>30 Days)', value: 'inactive' },
            ]}
          />
          <div className="pt-2">
            <Button className="w-full py-4" iconLeft="send-outline">
              Send Push Notification
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">
              Estimated reach: ~20,600 users
            </p>
          </div>
        </div>

        {/* Right: Message + Preview */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <label className="block text-sm font-medium text-slate-300">
                Message Content
              </label>
              <span className="text-xs text-slate-500">
                {msg.length}/140 characters
              </span>
            </div>
            <Textarea
              placeholder="Type your notification message here..."
              rows={6}
              maxLength={140}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>

          {/* Preview Card (Mockup) */}
          <div className="bg-background-dark/50 rounded-lg border border-dashed border-white/20 p-4">
            <p className="mb-3 text-xs font-semibold text-slate-500 uppercase">
              Mobile Preview
            </p>
            <div className="flex max-w-sm items-start gap-3 rounded-xl border border-white/5 bg-[#1e1e1e] p-3 shadow-md">
              <div className="bg-primary/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                <IonIcon
                  name="football-outline"
                  className="text-primary text-xl"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-baseline justify-between">
                  <h4 className="truncate text-sm font-semibold text-white">
                    Ao Trình App
                  </h4>
                  <span className="text-[10px] text-slate-400">now</span>
                </div>
                <p className="line-clamp-2 text-xs text-slate-300">
                  {msg ||
                    'Your message will appear here exactly as typed above...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
