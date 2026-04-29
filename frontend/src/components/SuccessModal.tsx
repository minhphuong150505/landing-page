interface SuccessModalProps {
  open: boolean
  title: string
  message: string
  onClose: () => void
}

export default function SuccessModal({ open, title, message, onClose }: SuccessModalProps) {
  if (!open) return null

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
          ✅
        </div>
        <h3 className="text-2xl font-black text-[var(--ink)] mb-2.5">{title}</h3>
        <p className="text-sm text-[var(--ink)]/60 leading-relaxed">{message}</p>
      </div>
    </div>
  )
}
