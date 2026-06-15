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

/** Injected into react-to-print iframe so layout survives without parent CSS. */
export const PRINT_IFRAME_PAGE_STYLE = `
  @page { size: A4 portrait; margin: 12mm; }
  @page landscape-page { size: A4 landscape; margin: 10mm; }
  html, body {
    margin: 0;
    padding: 0;
    background: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-preview-scaler {
    transform: none !important;
    width: 100% !important;
    max-width: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .print-document-root {
    background: #fff !important;
    color: #000 !important;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    line-height: 1.35;
  }
  .print-document-root * {
    color: #000 !important;
    border-color: #333 !important;
  }
  .print-document-root table {
    width: 100%;
    border-collapse: collapse;
  }
  .print-document-root th,
  .print-document-root td {
    border: 1px solid #333;
    padding: 4px 6px;
    text-align: left;
    vertical-align: middle;
  }
  .print-document-root th {
    background: #f3f4f6 !important;
    font-weight: 700;
  }
  .print-page-break {
    break-after: page;
    page-break-after: always;
  }
  .print-page-break-before {
    break-before: page;
    page-break-before: always;
  }
  .print-bracket-header {
    break-after: avoid;
    page-break-after: avoid;
  }
  .print-bracket-header + .print-bracket-half,
  .print-bracket-header + .print-round-robin-sheet,
  .print-bracket-header + div > .print-bracket-half,
  .print-bracket-header + div > .print-round-robin-sheet {
    break-before: avoid;
    page-break-before: avoid;
  }
  .print-avoid-break {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .landscape-page {
    page: landscape-page;
  }
  .print-document-root.landscape-page,
  .landscape-page.print-document-root {
    page: landscape-page;
  }
`;
