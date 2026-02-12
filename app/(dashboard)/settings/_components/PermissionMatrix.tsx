'use client';

import { Checkbox } from '@/components/atoms/Checkbox';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { mockPermissions, mockRolePermissions } from '@/lib/mock-data';

const roles = ['super_admin', 'staff', 'moderator'];
const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  staff: 'Staff',
  moderator: 'Moderator',
};

export function PermissionMatrix() {
  const categories = [...new Set(mockPermissions.map((p) => p.category))];

  return (
    <GlassPanel card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-surface-border border-b">
              <th className="px-4 py-3 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                Permission
              </th>
              {roles.map((r) => (
                <th
                  key={r}
                  className="px-4 py-3 text-center text-xs font-bold tracking-wider text-slate-500 uppercase"
                >
                  {roleLabels[r]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <>
                <tr key={cat}>
                  <td
                    colSpan={roles.length + 1}
                    className="bg-surface-dark/50 text-primary px-4 py-2 text-xs font-bold tracking-wider uppercase"
                  >
                    {cat}
                  </td>
                </tr>
                {mockPermissions
                  .filter((p) => p.category === cat)
                  .map((perm) => (
                    <tr
                      key={perm.key}
                      className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                    >
                      <td className="px-4 py-2.5 text-sm text-slate-300">
                        {perm.label}
                      </td>
                      {roles.map((role) => (
                        <td key={role} className="px-4 py-2.5 text-center">
                          <Checkbox
                            checked={
                              mockRolePermissions[role]?.[perm.key] ?? false
                            }
                            onChange={() => {}}
                            className="justify-center"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
