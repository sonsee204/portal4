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

  return (
    <GlassPanel card={false} className="overflow-hidden">
      {/* Header */}
      <div className="border-surface-border bg-surface flex items-center justify-between border-b p-6">
        <h3 className="text-heading flex items-center gap-2 text-lg font-semibold">
          <IonIcon name="megaphone-outline" className="text-primary" />
          Push Notification Center
        </h3>
        <div className="text-muted flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs">
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
            <p className="text-faint mt-3 text-center text-xs">
              Estimated reach: ~20,600 users
            </p>
          </div>
        </div>

        {/* Right: Message + Preview */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <label className="text-body block text-sm font-medium">
                Message Content
              </label>
              <span className="text-faint text-xs">
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
          <div className="bg-bg-secondary border-surface-border rounded-lg border border-dashed p-4">
            <p className="text-faint mb-3 text-xs font-semibold uppercase">
              Mobile Preview
            </p>
            <div className="border-surface-border bg-surface flex max-w-sm items-start gap-3 rounded-xl border p-3 shadow-md">
              <div className="bg-primary/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                <IonIcon
                  name="football-outline"
                  className="text-primary text-xl"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-baseline justify-between">
                  <h4 className="text-heading truncate text-sm font-semibold">
                    Ao Trình App
                  </h4>
                  <span className="text-muted text-[10px]">now</span>
                </div>
                <p className="text-body line-clamp-2 text-xs">
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
