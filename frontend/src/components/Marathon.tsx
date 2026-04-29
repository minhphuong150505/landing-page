import { useEffect, useState } from 'react'
import FadeUp from './FadeUp'

function CountdownTimer() {
  const target = new Date('2026-05-10T06:00:00+07:00')
  const [diff, setDiff] = useState(Math.max(0, target.getTime() - Date.now()))

  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(Math.max(0, target.getTime() - Date.now()))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')

  const blocks = [
    { val: pad(days), lbl: 'Ngày' },
    { val: pad(hours), lbl: 'Giờ' },
    { val: pad(mins), lbl: 'Phút' },
    { val: pad(secs), lbl: 'Giây' },
  ]

  return (
    <div className="flex gap-3">
      {blocks.map((b) => (
        <div
          key={b.lbl}
          className="text-center rounded-[14px] py-3.5 px-[18px] min-w-[72px]"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <div className="text-[32px] font-black text-white tabular-nums leading-none">{b.val}</div>
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/55 mt-1">
            {b.lbl}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Marathon() {
  const specs = [
    { key: 'Ngày', val: '10/05/2026' },
    { key: 'Địa điểm', val: 'Thủ Thiêm, TP.HCM' },
    { key: 'Cự ly', val: '6 km (vòng tròn)' },
    { key: 'Lộ trình', val: 'ACTION 360° Loop' },
    { key: 'Điều kiện', val: 'Hoàn thành UGC 7 ngày' },
    { key: 'Quyền lợi tại đích', val: 'Bộ sản phẩm BABÉ + Soi da' },
  ]

  return (
    <section
      id="marathon"
      className="relative overflow-hidden"
      style={{ background: 'var(--g700)', padding: '96px 40px' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-[1] max-w-[1100px] mx-auto">
        <FadeUp className="section-header text-center">
          <div className="eyebrow section-eyebrow">Bước 02</div>
          <h2 className="display-md text-white">
            The Running Babes
            <br />
            Marathon
          </h2>
          <p className="text-white/70 mt-4">10/05/2026 · Thủ Thiêm · 6 km vòng tròn phá loop.</p>
        </FadeUp>

        <FadeUp className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-[60px] items-center mt-14">
          {/* Loop visual */}
          <div>
            <div className="mx-auto" style={{ width: '360px', height: '360px' }}>
              <svg viewBox="-40 -10 440 390" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="180" cy="180" r="150" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                <circle cx="180" cy="180" r="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx="180" cy="180" r="150" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="880" strokeDashoffset="0" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="880" to="0" dur="2.4s" fill="freeze" />
                </circle>
                <circle cx="180" cy="30" r="8" fill="#fff" />
                <circle cx="310" cy="255" r="8" fill="#fff" />
                <circle cx="50" cy="255" r="8" fill="#fff" />
                <text x="180" y="16" fontSize="10" fontWeight="800" fill="rgba(255,255,255,0.9)" textAnchor="middle" letterSpacing="0.1em">
                  REGULATE
                </text>
                <text x="335" y="265" fontSize="10" fontWeight="800" fill="rgba(255,255,255,0.9)" textAnchor="start" letterSpacing="0.1em">
                  TREAT
                </text>
                <text x="25" y="265" fontSize="10" fontWeight="800" fill="rgba(255,255,255,0.9)" textAnchor="end" letterSpacing="0.1em">
                  RESTORE
                </text>
                <text x="180" y="173" fontSize="28" fontWeight="900" fill="white" textAnchor="middle">
                  6
                </text>
                <text x="180" y="193" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.55)" textAnchor="middle" letterSpacing="0.08em">
                  KM LOOP
                </text>
                <text x="180" y="214" fontSize="10" fontWeight="700" fill="rgba(255,255,255,0.35)" textAnchor="middle">
                  ACTION 360°
                </text>
              </svg>
            </div>
            <p className="text-center text-[13px] text-white/55 mt-5 italic">
              "Sau một chặng đường dài và mệt mỏi,
              <br />
              da chỉ cần đúng 2 bước là đủ"
            </p>
          </div>

          {/* Info panel */}
          <div>
            <div className="mb-9">
              <div className="text-[12px] font-bold tracking-[0.1em] uppercase text-white/65 mb-3.5">
                ⏳ Đếm ngược đến ngày chạy
              </div>
              <CountdownTimer />
            </div>

            <div className="flex flex-col gap-3.5">
              {specs.map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center pb-3.5"
                  style={{
                    borderBottom:
                      i < specs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  <span className="text-xs font-bold tracking-[0.08em] uppercase text-white/55">
                    {s.key}
                  </span>
                  <span className="text-[15px] font-extrabold text-white text-right">{s.val}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8 flex-wrap">
              <button
                className="btn-white"
                onClick={() =>
                  document.getElementById('ugc-challenge')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Đăng ký qua UGC Challenge
              </button>
              <button className="btn-white-ghost">Xem bản đồ lộ trình</button>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
