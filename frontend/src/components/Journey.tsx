import FadeUp from './FadeUp'

export default function Journey() {
  const steps = [
    {
      num: 'BƯỚC 01',
      icon: '📱',
      title: '7 ngày vận động — UGC Challenge',
      desc: 'Đăng ký, vận động ngoài trời 7 ngày, đăng video kèm hashtag để mở khóa vé tham gia marathon.',
      link: '#ugc-challenge',
    },
    {
      num: 'BƯỚC 02',
      icon: '🏃',
      title: 'Marathon The Running Babes',
      desc: 'Lộ trình hình tròn ám chỉ vòng lặp mụn — ACTION 360°. Hoàn thành = bạn đã thoát.',
      link: '#marathon',
    },
    {
      num: 'BƯỚC 03',
      icon: '🔄',
      title: 'Trade-in tại đích — Reset Your Skin Routine',
      desc: 'Mang sản phẩm cũ đến đổi lấy BABÉ Stop AKN sample. Da bạn xứng đáng được bắt đầu đúng cách.',
      link: '#trade-in',
    },
  ]

  return (
    <section id="journey" className="bg-[#111]" style={{ padding: '96px 40px' }}>
      <FadeUp className="section-header">
        <div className="eyebrow section-eyebrow">Hành trình của bạn</div>
        <h2 className="display-md section-title">Hành trình của bạn bắt đầu từ đây</h2>
        <p className="section-sub">Ba bước liên kết — không phải ba hoạt động rời rạc.</p>
      </FadeUp>

      <FadeUp className="grid grid-cols-1 md:grid-cols-3 gap-0.5 max-w-[1100px] mx-auto relative">
        <div
          className="absolute hidden md:block"
          style={{
            top: '72px',
            left: '17%',
            right: '17%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--g700), transparent)',
            opacity: 0.35,
          }}
        />
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-[#181818] p-10 pb-9 relative cursor-pointer transition-colors duration-200 hover:bg-[#1f1f1f]"
            style={{
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius:
                i === 0 ? '24px 0 0 24px' : i === 2 ? '0 24px 24px 0' : '0',
            }}
            onClick={() => document.getElementById(step.link.slice(1))?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="text-[11px] font-extrabold tracking-[0.14em] text-[var(--g700)] mb-5">
              {step.num}
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
              style={{
                background: 'rgba(111,162,52,0.12)',
                border: '1px solid rgba(111,162,52,0.22)',
              }}
            >
              {step.icon}
            </div>
            <h3 className="text-lg font-extrabold text-white mb-2.5 leading-tight">
              {step.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed mb-5">{step.desc}</p>
            <span className="text-[13px] font-bold text-[var(--g83)] inline-flex items-center gap-1.5 transition-all duration-200 hover:gap-2.5 hover:text-[var(--g700)]">
              {i === 1 ? 'Xem lộ trình' : i === 2 ? 'Xem ưu đãi' : 'Xem cách tham gia'}
              <span className="text-sm">→</span>
            </span>
          </div>
        ))}
      </FadeUp>
    </section>
  )
}
