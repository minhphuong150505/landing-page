export default function MarqueeBar() {
  const items = [
    'Break The Loop',
    '10.05.2026',
    'Thủ Thiêm · TP.HCM',
    '6 km Loop',
    'UGC 03–09/05',
    '#TheRunningBabes',
    'BABÉ Stop AKN',
  ]

  const track = [...items, ...items]

  return (
    <div
      className="fixed top-16 left-0 right-0 z-[190] h-[34px] flex items-center overflow-hidden"
      style={{ background: 'var(--g700)' }}
    >
      <div className="flex gap-0 animate-marquee whitespace-nowrap">
        {track.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[11px] font-extrabold tracking-[0.13em] uppercase text-white/90 px-7">
              {item}
            </span>
            <span className="text-white/40 px-1">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
