export default function Hero() {

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0c0c0c', paddingTop: '98px' }}
    >
      {/* Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[
          { size: 700, duration: 55, opacity: 0.18, width: 1.5 },
          { size: 500, duration: 35, opacity: 0.12, width: 1 },
          { size: 330, duration: 22, opacity: 0.1, width: 1 },
          { size: 180, duration: 14, opacity: 0.08, width: 1 },
        ].map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-[var(--g700)]"
            style={{
              width: ring.size,
              height: ring.size,
              opacity: ring.opacity,
              borderWidth: ring.width,
              animation: `ringspin ${ring.duration}s linear infinite ${i % 2 === 1 ? 'reverse' : ''}`,
            }}
          >
            {i === 0 && (
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-[var(--g700)]"
                style={{ top: '-5px', left: '50%', transform: 'translateX(-50%)' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative z-[2] text-center max-w-[880px] px-6 pb-20">
        <div className="inline-flex items-center gap-2 bg-[rgba(111,162,52,0.14)] border border-[rgba(111,162,52,0.38)] text-[var(--g83)] px-[18px] py-1.5 rounded-full text-[11.5px] font-extrabold tracking-[0.13em] uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--g700)] animate-pulse" />
          Giải chạy đầu tiên của BABÉ tại Việt Nam
        </div>

        <h1 className="display-xl text-white mb-2">
          BREAK
          <br />
          <span className="italic text-[var(--g83)]">THE</span>
          <br />
          <span className="text-[var(--g700)]">LOOP.</span>
        </h1>

        <p className="text-[clamp(15px,2vw,19px)] text-white/50 font-normal max-w-[560px] mx-auto mt-5 mb-9 leading-relaxed">
          Bắt đầu hành trình sống khỏe da đẹp cùng BABÉ.
        </p>

        <div className="flex gap-2.5 justify-center flex-wrap mb-11">
          {[
            { icon: '📍', text: 'Thủ Thiêm, TP.HCM' },
            { icon: '📅', text: 'Ngày 10/05/2026' },
            { icon: '⏱', text: 'UGC: 03–09/05/2026' },
          ].map((pill) => (
            <div
              key={pill.text}
              className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-[18px] py-2 text-[13px] font-semibold text-white/80"
            >
              <span className="text-[15px]">{pill.icon}</span>
              {pill.text}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            className="btn-primary"
            onClick={() => document.getElementById('ugc-challenge')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Tham gia UGC Challenge
          </button>
          <button className="btn-ghost" onClick={() => { /* open route modal */ }}>
            Xem lộ trình chạy
          </button>
        </div>
      </div>

      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-[11px] font-bold tracking-[0.1em] uppercase">
        <div
          className="w-6 h-6"
          style={{
            borderRight: '2px solid rgba(255,255,255,0.25)',
            borderBottom: '2px solid rgba(255,255,255,0.25)',
            transform: 'rotate(45deg)',
            animation: 'scrollbounce 1.8s ease infinite',
          }}
        />
        Scroll
      </div>
    </section>
  )
}
