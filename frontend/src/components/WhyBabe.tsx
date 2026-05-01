import FadeUp from './FadeUp'
import babeImage from '../assets/babe.jpg'

export default function WhyBabe() {
  const cards = [
    {
      num: '01',
      tag: 'Regulate',
      title: 'Tuyến dầu',
      desc: 'Regulate dầu nhờn dư thừa mà không gây khô da hay bong tróc.',
    },
    {
      num: '02',
      tag: 'Treat',
      title: 'Hệ vi sinh',
      desc: 'Treat — phục hồi cân bằng vi khuẩn tự nhiên trên da.',
    },
    {
      num: '03',
      tag: 'Restore',
      title: 'Hàng rào bảo vệ',
      desc: 'Restore lớp barrier khoẻ mạnh, bền vững theo thời gian.',
    },
  ]

  return (
    <section
      id="about"
      style={{ background: '#111', color: '#fff', padding: '96px 56px' }}
    >
      <div className="max-w-[1100px] mx-auto mb-14">
        <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-white/30 mb-5">
          The Why · Stop AKN
        </div>
        <div
          className="font-black tracking-[-0.03em] mb-4"
          style={{ fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 1 }}
        >
          Why
          <em className="block text-[var(--g700)] italic">BABÉ Stop AKN?</em>
        </div>
        <span
          className="inline-flex items-center gap-2 text-[13px] font-bold text-[var(--g83)] px-[18px] py-[7px] rounded-full"
          style={{
            background: 'rgba(111,162,52,0.1)',
            border: '1px solid rgba(111,162,52,0.2)',
          }}
        >
          1 chu trình &nbsp;·&nbsp; 2 sản phẩm &nbsp;·&nbsp; 3 tác động
        </span>
      </div>

      <FadeUp className="grid grid-cols-1 lg:grid-cols-2 gap-14 max-w-[1100px] mx-auto items-start">
        <div
          className="rounded-[20px] overflow-hidden relative"
          style={{ aspectRatio: '4/5' }}
        >
          <img
            src={babeImage}
            alt="BABÉ Stop AKN"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-5 left-5 bg-white/92 text-[var(--ink)] text-[11px] font-extrabold tracking-[0.1em] uppercase px-3.5 py-1.5 rounded-full">
            Microbiome Care
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-2">
          {cards.map((card) => (
            <div
              key={card.num}
              className="grid grid-cols-[64px_1fr] gap-5 items-start rounded-2xl p-6 transition-colors duration-200 hover:bg-white/[0.03]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="text-[40px] font-black text-[var(--g700)] leading-none tracking-[-0.03em]">
                {card.num}
              </div>
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.12em] uppercase text-[var(--g700)] mb-1.5">
                  {card.tag}
                </div>
                <div className="text-lg font-extrabold text-white mb-1.5">
                  {card.title}
                </div>
                <p className="text-[13px] text-white/45 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  )
}
