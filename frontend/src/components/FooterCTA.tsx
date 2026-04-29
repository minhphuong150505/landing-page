import { Link } from 'react-router-dom'

export default function FooterCTA() {
  return (
    <footer
      className="relative overflow-hidden text-center"
      style={{
        background: '#0a0a0a',
        padding: '96px 40px 64px',
        borderTop: '1px solid rgba(111,162,52,0.15)',
      }}
    >
      {/* Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        {[600, 400, 200].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-[var(--g700)]"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      <div className="relative z-[1]">
        <div
          className="eyebrow"
          style={{ color: 'var(--g83)', marginBottom: '16px' }}
        >
          10.05.2026 · Thủ Thiêm · TP.HCM
        </div>
        <h2
          className="font-black text-white tracking-[-0.025em] mb-3"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          Bạn đã sẵn sàng
          <br />
          <em className="text-[var(--g700)] italic">phá vòng lặp</em> chưa?
        </h2>
        <p className="text-base text-white/45 mb-10">
          Đăng ký UGC Challenge ngay hôm nay — hành trình bắt đầu từ 03/05.
        </p>
        <button
          className="btn-primary"
          style={{ fontSize: '16px', padding: '16px 40px' }}
          onClick={() =>
            document
              .getElementById('ugc-challenge')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Đăng ký ngay →
        </button>

        <div className="flex gap-2.5 justify-center flex-wrap mt-12 mb-14">
          {[
            '#HustleCrew_DC26',
            '#TheRunningBabes',
            '#DigitalCreatory',
            '#LaboratoriosBaBé',
          ].map((tag) => (
            <span
              key={tag}
              className="text-[13px] font-bold text-[var(--g83)] opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="flex justify-between items-center flex-wrap gap-4 max-w-[900px] mx-auto pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="text-base font-black tracking-wide text-white/50 whitespace-nowrap">
            BABÉ <em className="text-[var(--g700)] not-italic">Laboratorios</em> ×
            HUSTLE.CREW · 2026
          </div>
          <div className="flex gap-5 flex-wrap">
            <Link
              to="/about"
              className="text-xs text-white/35 font-semibold hover:text-[var(--g83)] transition-colors duration-200"
            >
              Về BABÉ
            </Link>
            <Link
              to="/contact"
              className="text-xs text-white/35 font-semibold hover:text-[var(--g83)] transition-colors duration-200"
            >
              Liên hệ
            </Link>
            <Link
              to="/policy"
              className="text-xs text-white/35 font-semibold hover:text-[var(--g83)] transition-colors duration-200"
            >
              Chính sách
            </Link>
            <Link
              to="/terms"
              className="text-xs text-white/35 font-semibold hover:text-[var(--g83)] transition-colors duration-200"
            >
              Điều khoản
            </Link>
          </div>
          <div className="text-xs text-white/25 font-medium">
            © 2026 Laboratorios BABÉ. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
