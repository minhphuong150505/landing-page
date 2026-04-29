import { Link } from 'react-router-dom'

export default function PolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '120px 40px 80px' }}>
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--g700)] text-[13px] font-bold mb-9 hover:gap-3 transition-all duration-200">
          ← Quay lại trang chủ
        </Link>
        <div className="eyebrow" style={{ color: 'var(--g700)', marginBottom: '12px' }}>Pháp lý</div>
        <h1 className="font-black tracking-[-0.025em] mb-2" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
          Chính sách<br /><em className="text-[var(--g700)] italic">bảo mật</em>
        </h1>
        <p className="text-[13px] text-[var(--ink)]/40 font-medium mb-12">Cập nhật lần cuối: 01/04/2026</p>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">1. Thông tin chúng tôi thu thập</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7 mb-2.5">Khi bạn đăng ký tham gia BABÉ 26 – The Running Babes, chúng tôi thu thập các thông tin sau:</p>
          <ul className="list-disc pl-5 space-y-2 text-[15px] text-[var(--ink)]/70 leading-7">
            <li>Họ và tên, số điện thoại, địa chỉ email</li>
            <li>Handle Instagram và TikTok (để xác nhận tiến độ UGC Challenge)</li>
            <li>Thông tin đặt slot soi da (tên, số điện thoại)</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">2. Mục đích sử dụng thông tin</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] text-[var(--ink)]/70 leading-7">
            <li>Xác nhận đăng ký và gửi hướng dẫn tham gia</li>
            <li>Theo dõi tiến độ UGC Challenge và gửi thông báo unlock marathon</li>
            <li>Liên hệ về phần thưởng và quyền lợi sau sự kiện</li>
            <li>Gửi thông tin cập nhật về sự kiện (không phải spam marketing)</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">3. Bảo mật thông tin</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Thông tin của bạn được lưu trữ trên hệ thống bảo mật và không được chia sẻ với bên thứ ba cho mục đích marketing mà không có sự đồng ý của bạn. Chúng tôi sử dụng HTTPS và mã hóa dữ liệu theo tiêu chuẩn ngành.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">4. Quyền của bạn</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá dữ liệu cá nhân bất kỳ lúc nào bằng cách liên hệ <a href="mailto:babe26@hustle-crew.vn" className="text-[var(--g700)] font-semibold">babe26@hustle-crew.vn</a>.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">5. Cookie</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Trang web sử dụng cookie để phân tích lưu lượng truy cập (Google Analytics với UTM tracking) và cải thiện trải nghiệm người dùng. Bạn có thể tắt cookie trong cài đặt trình duyệt mà không ảnh hưởng đến chức năng chính của trang.</p>
        </div>
      </div>
    </div>
  )
}
