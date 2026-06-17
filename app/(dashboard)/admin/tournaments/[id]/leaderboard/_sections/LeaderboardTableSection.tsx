'use client';

type Props = {
  data: any;
};

export function LeaderboardTableSection({ data }: Props) {
  if (data.loading) return <div className="text-muted">Đang tải...</div>;
  if (data.error) return <div className="text-red-400">Lỗi tải dữ liệu</div>;
  if (!data.rankings.length) return <div className="text-muted">Chưa có dữ liệu xếp hạng</div>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted border-b border-white/10 text-left">
          <th className="py-3 pr-4">Hạng</th>
          <th className="py-3 pr-4">Tên</th>
          <th className="py-3 pr-4">Thắng</th>
          <th className="py-3 pr-4">Thua</th>
          <th className="py-3 pr-4">Tỉ lệ thắng</th>
          <th className="py-3">Điểm</th>
        </tr>
      </thead>
      <tbody>
        {data.rankings.map((r: any) => (
          <tr key={r.registrationId} className="border-b border-white/5">
            <td className="py-3 pr-4 font-bold">{r.rank}</td>
            <td className="py-3 pr-4">{r.playerName}</td>
            <td className="py-3 pr-4">{r.matchesWon}</td>
            <td className="py-3 pr-4">{r.matchesLost}</td>
            <td className="py-3 pr-4">{r.winRate}%</td>
            <td className="py-3">{r.groupPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}