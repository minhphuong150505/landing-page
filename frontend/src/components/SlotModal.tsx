import { useState } from 'react'
import { slotApi } from '../services/api'

interface SlotModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (title: string, msg: string) => void
}

type Status = 'idle' | 'loading' | 'error'

export default function SlotModal({ open, onClose, onSuccess }: SlotModalProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await slotApi.book({
        name: fd.get('name') as string,
        phone: fd.get('phone') as string,
      })
      if (res.success) {
        onSuccess(
          'Slot đã được đặt! ✨',
          'Chúng tôi đã ghi nhận slot soi da của bạn vào ngày 10/05 tại finish line Thủ Thiêm. Hẹn gặp bạn ở đích!'
        )
        onClose()
      } else {
        setStatus('error')
        setError(res.message)
      }
    } catch {
      setStatus('error')
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-5"
      style={{ background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative text-center w-full max-w-[440px]"
        style={{
          background: 'var(--paper)',
          borderRadius: '28px',
          padding: '48px 40px',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-base transition-colors duration-150"
          style={{ background: 'rgba(26,26,26,0.07)', color: 'rgba(26,26,26,0.5)' }}
        >
          ×
        </button>
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[32px] mx-auto mb-5"
          style={{ background: 'rgba(111,162,52,0.12)' }}
        >
          🔬
        </div>
        <h3 className="text-2xl font-black text-[var(--ink)] mb-2.5">
          Đăng ký slot soi da
        </h3>
        <p
          className="mb-5 text-sm"
          style={{ color: 'rgba(26,26,26,0.55)' }}
        >
          Chỉ còn{' '}
          <strong style={{ color: 'var(--g700)' }}>42 slot</strong> · Ngày 10/05 tại
          finish line
        </p>
        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[var(--ink)]/50 mb-1.5">
              Họ và tên
            </label>
            <input
              name="name"
              required
              placeholder="Nguyễn Thị Lan"
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[var(--ink)]/[0.12] text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/30 outline-none transition-all duration-200 focus:border-[var(--g700)]"
              style={{ background: '#fafafa' }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[var(--ink)]/50 mb-1.5">
              Số điện thoại
            </label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="09xx xxx xxx"
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[var(--ink)]/[0.12] text-sm text-[var(--ink)] placeholder:text-[var(--ink)]/30 outline-none transition-all duration-200 focus:border-[var(--g700)]"
              style={{ background: '#fafafa' }}
            />
          </div>
          {status === 'error' && (
            <p className="text-red-500 text-xs mb-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 bg-[var(--g700)] text-white rounded-full text-[15px] font-black transition-all duration-200 hover:bg-[var(--g641)] hover:scale-[1.02]"
          >
            {status === 'loading' ? 'Đang gửi...' : 'Đặt slot ngay →'}
          </button>
        </form>
      </div>
    </div>
  )
}
