import { useState } from 'react'
import { slotApi } from '../services/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function TradeIn() {
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const steps = [
    {
      num: '①',
      title: 'Mang vỏ cũ',
      desc: 'Sữa rửa, kem dưỡng, toner. Vỏ rỗng cũng được nhận.',
    },
    {
      num: '②',
      title: 'Soi da miễn phí',
      desc: 'Chuyên gia BABÉ dùng máy phân tích da bạn.',
    },
    {
      num: '③',
      title: 'Live demo Action 360°',
      desc: 'Regulate → Treat → Restore tại chỗ.',
    },
    {
      num: '④',
      title: 'Đổi sample',
      desc: 'Cleansing Gel + Mattifying Fluid · 14 ngày dùng thử.',
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await slotApi.book({
        name: fd.get('name') as string,
        phone: fd.get('phone') as string,
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

  return (
    <section
      id="trade-in"
      style={{ background: '#c8d9b8', color: 'var(--ink)', padding: '80px 56px' }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-end mb-12">
          <div>
            <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[var(--ink)]/40 mb-6">
              Step 03 · Trade-In
            </div>
            <div
              className="font-black text-[var(--ink)] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: 1 }}
            >
              Drop the old.
              <em className="block text-[var(--g700)] italic">Reset routine.</em>
            </div>
          </div>
          <p className="text-[15px] text-[var(--ink)]/60 leading-relaxed">
            Da bạn không cần nhiều hơn — chỉ cần đúng và đủ. Để lại những gì không phù hợp. Bắt
            đầu lại với BABÉ.
          </p>
        </div>

        <div
          className="bg-white rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ padding: '36px 40px', marginBottom: '24px' }}
        >
          {steps.map((step, i) => (
            <div key={i}>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-light mb-5"
                style={{
                  border: '2px solid var(--g700)',
                  color: 'var(--g700)',
                }}
              >
                {step.num}
              </div>
              <div className="text-[15px] font-extrabold text-[var(--ink)] mb-2">{step.title}</div>
              <p className="text-[13px] text-[var(--ink)]/55 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="bg-[#111] rounded-2xl flex items-center justify-between flex-wrap gap-4"
          style={{ padding: '24px 32px' }}
        >
          <div>
            <div className="text-[10px] font-extrabold tracking-[0.12em] uppercase text-white/35 mb-1.5">
              Limited Slots
            </div>
            <div className="text-lg font-extrabold text-white">Đăng ký slot soi da miễn phí</div>
            <div className="text-xs text-white/40 mt-1">80 slot · tên + SĐT là đủ</div>
          </div>
          {!showForm ? (
            <button
              className="bg-transparent border-[1.5px] border-white/30 text-white px-6 py-3 rounded text-[13px] font-extrabold tracking-wider transition-all duration-200 hover:border-[var(--g700)] hover:text-[var(--g700)] whitespace-nowrap"
              onClick={() => setShowForm(true)}
            >
              ĐĂNG KÝ →
            </button>
          ) : status === 'success' ? (
            <div className="text-[var(--g83)] text-sm font-bold">✓ Đã đăng ký thành công!</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-wrap">
              <input
                name="name"
                required
                placeholder="Tên"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <input
                name="phone"
                required
                placeholder="SĐT"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none"
              />
              {status === 'error' && <span className="text-red-400 text-xs">{message}</span>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-[var(--g700)] text-white px-5 py-2 rounded-full text-sm font-extrabold transition-all hover:bg-[var(--g641)]"
              >
                {status === 'loading' ? '...' : 'Gửi'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
