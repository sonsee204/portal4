/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import type { PrintMasterScheduleDoc } from '@/lib/tournament/print/types';
import { PrintDocumentShell } from '../PrintPreviewFrame';

interface MasterScheduleDocumentProps {
  doc: PrintMasterScheduleDoc;
}

export function MasterScheduleDocument({ doc }: MasterScheduleDocumentProps) {
  const { header } = doc;

  return (
    <PrintDocumentShell isDraft={header.isDraft} orientation="portrait">
      <header className="mb-4 text-center">
        <h1 className="text-lg font-bold uppercase">{header.title}</h1>
        <p className="mt-1 text-sm font-semibold uppercase">Lịch thi đấu</p>
        {header.locationName ? (
          <p className="mt-1 text-xs">Địa điểm: {header.locationName}</p>
        ) : null}
        <p className="text-xs">{header.dateRangeLabel}</p>
        {header.timeRangeLabel ? (
          <p className="text-xs">{header.timeRangeLabel}</p>
        ) : null}
        <p className="text-xs">{header.courtCountLabel}</p>
      </header>

      {doc.sections.map((section) => (
        <section key={section.dateKey} className="print-avoid-break mb-6">
          <h2 className="mb-2 text-sm font-bold uppercase">
            {section.dateLabel}
          </h2>
          <table>
            <thead>
              <tr>
                <th>Giờ dự kiến</th>
                <th>Nội dung</th>
                <th>Vòng</th>
                <th>Số thứ tự trận</th>
                <th>Tổng số trận</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) =>
                row.kind === 'break' ? (
                  <tr key={`break-${i}`}>
                    <td
                      colSpan={5}
                      className="bg-gray-100 text-center font-bold"
                    >
                      {row.breakLabel}
                    </td>
                  </tr>
                ) : (
                  <tr key={`${row.timeLabel}-${row.categoryTitle}-${i}`}>
                    <td>{row.timeLabel}</td>
                    <td>{row.categoryTitle}</td>
                    <td>{row.roundLabel}</td>
                    <td>
                      {row.matchFrom === row.matchTo
                        ? `#${row.matchFrom}`
                        : `#${row.matchFrom} – ${row.matchTo}`}
                    </td>
                    <td className="text-center">{row.matchCount}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </section>
      ))}

      <table className="mt-4">
        <tbody>
          <tr>
            <td colSpan={4} className="font-bold">
              TỔNG SỐ TRẬN
            </td>
            <td className="text-center font-bold">{doc.grandTotal}</td>
          </tr>
        </tbody>
      </table>
    </PrintDocumentShell>
  );
}
