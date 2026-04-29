import { useState } from 'react'
import { ugcApi } from '../services/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function UGCChallenge() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await ugcApi.register({
        name: fd.get('name') as string,
        phone: fd.get('phone') as string,
        handle: fd.get('handle') as string,
      })
      if (res.success) {
        setStatus('success')
        setMessage(res.message)
      } else {
        setStatus('error')
        setMessage(res.message)
      }
    } catch {
      setStatus('error')
      setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  const gallery = Array.from({ length: 9 }, (_, i) => ({
    day: `DAY ${(i % 7) + 1}`,
    user: `@user_${1000 + i * 17}`,
    bg: `linear-gradient(160deg, #${['1e3d0e', '1a3a0b', '223d10', '1c380d', '25430f', '1f3b0c', '2a4812', '1e3d0e', '243f10'][i]}, #0d1f08)`,
  }))

  return (
    <section
      id="ugc-challenge"
      className="grid grid-cols-1 lg:grid-cols-2"
      style={{ minHeight: '90vh', background: '#0f0f0f', color: '#fff' }}
    >
      {/* LEFT */}
      <div className="flex flex-col justify-center" style={{ padding: '80px 56px' }}>
        <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-white/35 mb-8">
          Step 01
        </div>
        <div className="mb-7">
          <span
            className="block font-black text-white tracking-[-0.03em]"
            style={{ fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 1 }}
          >
            7 days.
          </span>
          <span
            className="block font-black italic text-white tracking-[-0.03em]"
            style={{ fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 1 }}
          >
            Show up.
          </span>
          <span
            className="block font-black text-[var(--g700)] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 1 }}
          >
            Get in.
          </span>
        </div>
        <p className="text-[15px] text-white/50 leading-relaxed max-w-[420px] mb-7">
          Vận động ngoài trời. Đăng video mỗi ngày. Caption đủ 4 hashtag. Đó là tất cả những gì cần
          để mở cánh cửa marathon.
        </p>
        <div className="flex flex-wrap gap-2 mb-9">
          {['#HustleCrew_DC26', '#DigitalCreatory', '#LaboratoriosBaBé', '#TheRunningBabes'].map(
            (tag) => (
              <span
                key={tag}
                className="text-xs font-bold text-[var(--g83)] px-3.5 py-1.5 rounded-full"
                style={{
                  background: 'rgba(111,162,52,0.14)',
                  border: '1px solid rgba(111,162,52,0.3)',
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>

        <div className="border-t border-white/[0.08] pt-7">
          <div className="text-[10px] font-extrabold tracking-[0.12em] uppercase text-white/30 mb-4">
            Đăng ký nhanh
          </div>
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="text-xl font-black text-white mb-2">Đăng ký thành công!</h3>
              <p className="text-white/50 text-sm">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                required
                placeholder="Tên + SĐT"
                className="w-full bg-transparent border-b border-white/15 py-3 text-[15px] text-white placeholder:text-white/25 outline-none transition-colors duration-200 focus:border-[var(--g700)]"
              />
              <input
                name="handle"
                placeholder="@instagram / @tiktok"
                className="w-full bg-transparent border-b border-white/15 py-3 text-[15px] text-white placeholder:text-white/25 outline-none transition-colors duration-200 focus:border-[var(--g700)] mt-4"
              />
              {status === 'error' && (
                <p className="text-red-400 text-xs mt-2">{message}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="mt-2 bg-transparent border-[1.5px] border-white/30 text-white px-7 py-3.5 rounded text-sm font-extrabold tracking-wider transition-all duration-200 hover:border-[var(--g700)] hover:text-[var(--g700)]"
              >
                {status === 'loading' ? 'Đang gửi...' : 'LOCK IN MY SPOT →'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="flex flex-col border-l border-white/[0.05]"
        style={{ background: '#0a0a0a', padding: '56px 40px 56px 32px' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#E53935]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] animate-pulse" />
            LIVE
          </span>
          <span className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-white/35">
            · GALLERY PREVIEW
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1">
          {gallery.map((item, i) => (
            <div
              key={i}
              className="rounded-[10px] overflow-hidden relative aspect-[9/14]"
              style={{ background: item.bg }}
            >
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-extrabold tracking-[0.08em] px-[7px] py-[3px] rounded">
                {item.day}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 opacity-50">
                  <polygon points="5,3 19,12 5,21" fill="rgba(255,255,255,0.45)" />
                </svg>
              </div>
              <div className="absolute bottom-1.5 left-2 text-[9px] text-white/50 font-semibold">
                {item.user}
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-[10px] p-3.5 text-xs text-white/55 leading-relaxed"
          style={{
            background: 'rgba(111,162,52,0.08)',
            border: '1px solid rgba(111,162,52,0.2)',
          }}
        >
          <strong className="text-[var(--g83)]">Reward khi finish UGC + marathon:</strong> Full bộ
          BABÉ Stop AKN + voucher discount + soi da miễn phí 12 tháng.{" "}
          <strong className="text-[var(--g83)]">Top 3 entries:</strong> Gift box đặc biệt + voucher 1
          năm.
        </div>
      </div>
    </section>
  )
}
