import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '120px 40px 80px' }}>
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--g700)] text-[13px] font-bold mb-9 hover:gap-3 transition-all duration-200">
          ← Quay lại trang chủ
        </Link>
        <div className="eyebrow" style={{ color: 'var(--g700)', marginBottom: '12px' }}>Về thương hiệu</div>
        <h1 className="font-black tracking-[-0.025em] mb-2" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
          Về BABÉ<br /><em className="text-[var(--g700)] italic">Laboratorios</em>
        </h1>
        <p className="text-[13px] text-[var(--ink)]/40 font-medium mb-12">Được nghiên cứu tại Tây Ban Nha · Phân phối tại Việt Nam</p>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">Triết lý "Simply Essential"</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7 mb-2.5">BABÉ Laboratorios được thành lập với triết lý rằng làn da khoẻ chính là làn da đẹp. Chúng tôi tin vào sự đơn giản và bền vững — thay vì chồng chất hàng chục bước skincare, hãy tìm đúng 2 bước nền tảng cho da bạn.</p>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Sản phẩm được nghiên cứu và phát triển tại Tây Ban Nha trong điều kiện khí hậu tương đồng với Việt Nam — nhiệt độ cao, nóng ẩm — được tối ưu để cho cảm giác nhẹ thoáng và không gây bí da.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">BABÉ Stop AKN — Bộ đôi chủ lực</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7 mb-2.5">Bộ đôi <strong>Purifying Cleansing Gel</strong> và <strong>Mattifying Fluid</strong> được thiết kế để giải quyết vấn đề da dầu và mụn thông qua cơ chế ACTION 360°:</p>
          <ul className="list-disc pl-5 space-y-2 text-[15px] text-[var(--ink)]/70 leading-7">
            <li><strong>REGULATE</strong> — Kiểm soát tuyến dầu, cân bằng bã nhờn, ngăn bít tắc lỗ chân lông.</li>
            <li><strong>TREAT</strong> — Điều trị vi khuẩn gây mụn, giảm viêm, làm dịu vùng da tổn thương.</li>
            <li><strong>RESTORE</strong> — Phục hồi hàng rào bảo vệ da, cân bằng hệ vi sinh, duy trì ổn định bền vững.</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">Tại sao chọn BABÉ?</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7 mb-2.5">47.4% thảo luận về da tại Việt Nam liên quan đến da dầu. 13.3% tổng thảo luận skincare đề cập đến vấn đề trị mụn. Người dùng đang mắc kẹt trong "vòng lặp mụn" — lạm dụng quá nhiều hoạt chất mạnh, da không có thời gian phục hồi, mụn lại tái phát.</p>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">BABÉ Stop AKN mang đến giải pháp <strong>"Ba cân bằng"</strong>: Tuyến dầu – Hệ vi sinh – Hàng rào bảo vệ. Không tấn công mụn tức thời mà ổn định da bền vững từ gốc rễ.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">BABÉ 26 — The Running Babes</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7 mb-2.5">Giải chạy đầu tiên của BABÉ tại Việt Nam — một chiến dịch kết hợp UGC community building, trải nghiệm thể chất và hành động cụ thể với làn da. Được tổ chức bởi HUSTLE.CREW và Digital Creatory.</p>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Sự kiện diễn ra ngày 10/05/2026 tại khu vực Thủ Thiêm, TP.HCM. Lộ trình 6 km hình tròn — biểu tượng cho vòng lặp mụn bị phá vỡ và cơ chế ACTION 360°.</p>
        </div>
      </div>
    </div>
  )
}
