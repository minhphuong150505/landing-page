import { useState } from 'react'
import FadeUp from './FadeUp'

const faqs = [
  {
    q: 'Tôi cần hoàn thành 7 ngày UGC mới được tham gia marathon không?',
    a: 'Đúng — hoàn thành đủ 7 ngày UGC Challenge (03/05–09/05) là điều kiện bắt buộc để nhận link đăng ký marathon. Đây là cách funnel hoạt động: UGC là cánh cửa duy nhất vào toàn bộ hành trình.',
  },
  {
    q: 'Sản phẩm trade-in có cần còn dùng được không?',
    a: 'Không cần — kể cả vỏ rỗng cũng được chấp nhận. Mục tiêu là để bạn có cơ hội bắt đầu lại với một quy trình đơn giản hơn, không phải đánh giá sản phẩm cũ của bạn.',
  },
  {
    q: 'Hashtag bắt buộc phải có là gì?',
    a: 'Caption của mỗi video phải chứa đủ 4 hashtag: #HustleCrew_DC26 #DigitalCreatory #LaboratoriosBaBé #TheRunningBabes. Thiếu bất kỳ hashtag nào trong số này, ngày đó sẽ không được tính.',
  },
  {
    q: 'Phần thưởng sẽ được trao như thế nào?',
    a: 'Sample BABÉ Stop AKN (2 sản phẩm) được trao trực tiếp tại khu vực finish line sau khi hoàn thành marathon. Phần thưởng hoàn thành UGC + marathon (full bộ + voucher + soi da 1 năm) sẽ được gửi qua thông tin đăng ký trong vòng 7 ngày sau sự kiện.',
  },
  {
    q: 'Video UGC cần đăng lên nền tảng nào?',
    a: 'Bạn có thể đăng lên Instagram (Feed hoặc Reels) hoặc TikTok — hoặc cả hai. Tài khoản cần ở chế độ công khai trong thời gian challenge để được xác nhận. Hãy điền đúng handle khi đăng ký để chúng tôi có thể theo dõi tiến độ.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
      style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '96px 40px' }}
    >
      <FadeUp className="section-header text-center">
        <div className="eyebrow" style={{ color: 'var(--g700)', marginBottom: '14px' }}>
          Hỗ trợ
        </div>
        <h2 className="display-md" style={{ color: 'var(--ink)' }}>
          Câu hỏi thường gặp
        </h2>
      </FadeUp>

      <FadeUp className="flex flex-col gap-0.5 max-w-[760px] mx-auto mt-12">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className="rounded-2xl bg-white overflow-hidden transition-shadow duration-200"
              style={{
                border: '1px solid rgba(26,26,26,0.06)',
                boxShadow: isOpen ? '0 4px 24px rgba(111,162,52,0.1)' : 'none',
              }}
            >
              <div
                className="flex justify-between items-center px-6 py-5 cursor-pointer gap-4"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span className="text-[15px] font-bold text-[var(--ink)] flex-1 leading-snug">
                  {faq.q}
                </span>
                <div
                  className="w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isOpen ? 'var(--g700)' : 'rgba(111,162,52,0.1)',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                  }}
                >
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      d="M7 1v12M1 7h12"
                      stroke={isOpen ? '#fff' : 'var(--g700)'}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              {isOpen && (
                <div className="px-6 pb-5 text-sm text-[var(--ink)]/60 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </FadeUp>
    </section>
  )
}
