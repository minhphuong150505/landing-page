import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contactApi } from '../services/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await contactApi.submit({
        name: fd.get('name') as string,
        email: fd.get('email') as string,
        subject: fd.get('subject') as string,
        message: fd.get('message') as string,
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
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '120px 40px 80px' }}>
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--g700)] text-[13px] font-bold mb-9 hover:gap-3 transition-all duration-200">
          ← Quay lại trang chủ
        </Link>
        <div className="eyebrow" style={{ color: 'var(--g700)', marginBottom: '12px' }}>Hỗ trợ & hợp tác</div>
        <h1 className="font-black tracking-[-0.025em] mb-2" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
          Liên hệ<br /><em className="text-[var(--g700)] italic">với chúng tôi</em>
        </h1>
        <p className="text-[13px] text-[var(--ink)]/40 font-medium mb-12">Phản hồi trong vòng 24 giờ làm việc</p>

        <div className="flex flex-col gap-4 mb-12">
          {[
            { icon: '📍', title: 'Địa điểm sự kiện', desc: 'Khu vực Thủ Thiêm, Quận 2, TP.HCM\nĐiểm xuất phát và finish line: cập nhật qua email sau đăng ký' },
            { icon: '📧', title: 'Email hỗ trợ', desc: 'babe26@hustle-crew.vn\nHỏi về đăng ký, hashtag, hoặc sự kiện' },
            { icon: '📱', title: 'Mạng xã hội', desc: 'Instagram & TikTok: @LaboratoriosBaBe_VN\nFollow để cập nhật hướng dẫn UGC mỗi ngày' },
            { icon: '🤝', title: 'Hợp tác & KOC', desc: 'collab@hustle-crew.vn\nLiên hệ về cơ hội seeding, collab và partnership' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3.5 items-start rounded-2xl p-[18px]" style={{ background: 'rgba(111,162,52,0.06)', border: '1px solid rgba(111,162,52,0.14)' }}>
              <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <h4 className="text-sm font-extrabold text-[var(--ink)] mb-0.5">{item.title}</h4>
                <p className="text-[13px] text-[var(--ink)]/60 whitespace-pre-line">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-5">Gửi tin nhắn</h2>
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-xl font-black text-[var(--ink)] mb-2">Đã nhận tin nhắn!</h3>
              <p className="text-[var(--ink)]/60 text-sm">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[var(--ink)]/50 mb-1.5">Họ và tên</label>
                  <input name="name" required placeholder="Nguyễn Thị Lan" className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[var(--ink)]/[0.1] text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/30 outline-none transition-all duration-200 focus:border-[var(--g700)]" style={{ background: 'rgba(26,26,26,0.04)' }} />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[var(--ink)]/50 mb-1.5">Email</label>
                  <input name="email" type="email" required placeholder="email@gmail.com" className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[var(--ink)]/[0.1] text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/30 outline-none transition-all duration-200 focus:border-[var(--g700)]" style={{ background: 'rgba(26,26,26,0.04)' }} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[var(--ink)]/50 mb-1.5">Chủ đề</label>
                <input name="subject" placeholder="Hỏi về UGC Challenge / Đăng ký marathon..." className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[var(--ink)]/[0.1] text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/30 outline-none transition-all duration-200 focus:border-[var(--g700)]" style={{ background: 'rgba(26,26,26,0.04)' }} />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[var(--ink)]/50 mb-1.5">Nội dung</label>
                <textarea name="message" required rows={5} placeholder="Nội dung câu hỏi hoặc tin nhắn của bạn..." className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[var(--ink)]/[0.1] text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/30 outline-none transition-all duration-200 focus:border-[var(--g700)] resize-y" style={{ background: 'rgba(26,26,26,0.04)' }} />
              </div>
              {status === 'error' && <p className="text-red-500 text-xs mb-3">{message}</p>}
              <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ maxWidth: '280px' }}>
                {status === 'loading' ? 'Đang gửi...' : 'Gửi tin nhắn →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
