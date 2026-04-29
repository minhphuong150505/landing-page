import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '120px 40px 80px' }}>
      <div className="max-w-[800px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--g700)] text-[13px] font-bold mb-9 hover:gap-3 transition-all duration-200">
          ← Quay lại trang chủ
        </Link>
        <div className="eyebrow" style={{ color: 'var(--g700)', marginBottom: '12px' }}>Pháp lý</div>
        <h1 className="font-black tracking-[-0.025em] mb-2" style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}>
          Điều khoản<br /><em className="text-[var(--g700)] italic">sử dụng</em>
        </h1>
        <p className="text-[13px] text-[var(--ink)]/40 font-medium mb-12">Áp dụng cho BABÉ 26 – The Running Babes · 2026</p>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">1. Điều kiện tham gia</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] text-[var(--ink)]/70 leading-7">
            <li>Người tham gia phải từ 18 tuổi trở lên</li>
            <li>Tài khoản Instagram hoặc TikTok phải ở chế độ công khai trong suốt thời gian UGC Challenge</li>
            <li>Video phải được đăng lên mạng xã hội (không phải Stories) và chứa đủ 4 hashtag bắt buộc</li>
            <li>Mỗi người chỉ được đăng ký một lần</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">2. Quy tắc UGC Challenge</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] text-[var(--ink)]/70 leading-7">
            <li>Nội dung video phải liên quan đến hoạt động thể chất ngoài trời</li>
            <li>Không được sử dụng nội dung của người khác (vi phạm bản quyền)</li>
            <li>Không được đăng nội dung phản cảm, bạo lực, hoặc vi phạm thuần phong mỹ tục</li>
            <li>Ban tổ chức có quyền loại các video không đáp ứng tiêu chí mà không cần giải thích</li>
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">3. Quyền sử dụng nội dung</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Bằng cách sử dụng hashtag sự kiện, bạn đồng ý cho phép BABÉ Laboratorios và HUSTLE.CREW sử dụng nội dung UGC của bạn cho mục đích truyền thông sự kiện, với điều kiện ghi nhận tên/handle người tạo.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">4. Phần thưởng</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Phần thưởng không thể quy đổi thành tiền mặt. Top 3 được chọn dựa trên tiêu chí về sáng tạo, tương tác và tính xác thực. Quyết định của ban giám khảo là cuối cùng.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">5. Giới hạn trách nhiệm</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Ban tổ chức không chịu trách nhiệm cho các chấn thương xảy ra trong quá trình tham gia marathon. Người tham gia chịu hoàn toàn trách nhiệm về sức khoẻ cá nhân và cam kết đã đủ điều kiện thể chất để tham gia giải chạy.</p>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-[var(--ink)] mb-3.5">6. Thay đổi và huỷ sự kiện</h2>
          <p className="text-[15px] text-[var(--ink)]/70 leading-7">Ban tổ chức có quyền thay đổi địa điểm, thời gian, hoặc hủy sự kiện trong trường hợp bất khả kháng (thời tiết xấu, quy định của cơ quan chức năng, v.v.). Mọi thay đổi sẽ được thông báo qua email đăng ký và kênh social media chính thức.</p>
        </div>
      </div>
    </div>
  )
}
