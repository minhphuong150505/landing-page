import { useEffect, useRef, useState } from 'react'

export default function LiveCounter() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)
  const [value, setValue] = useState(0)
  const target = 1847
  const targetTotal = 5000

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            if (!animated) {
              setAnimated(true)
              animateCounter(target, 2200)
            }
          }
        })
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [animated])

  useEffect(() => {
    if (!animated) return
    const interval = setInterval(() => {
      setValue((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 3), targetTotal)
        return next
      })
    }, 4200)
    return () => clearInterval(interval)
  }, [animated])

  function animateCounter(targetVal: number, duration: number) {
    const start = performance.now()
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const val = Math.floor(ease * targetVal)
      setValue(val)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const pct = Math.round((value / targetTotal) * 100)

  return (
    <section
      ref={sectionRef}
      className="fade-up"
      style={{ background: 'var(--g700)', padding: '52px 40px', position: 'relative', overflow: 'hidden' }}
    >
      <div className="absolute -top-[60px] -right-[60px] w-[240px] h-[240px] rounded-full bg-white/[0.06]" />
      <div className="absolute -bottom-10 -left-10 w-[180px] h-[180px] rounded-full bg-black/[0.08]" />

      <div className="relative z-[1] max-w-[900px] mx-auto text-center">
        <div className="text-[12px] font-bold tracking-[0.14em] uppercase text-white/75 mb-3">
          Live Counter
        </div>
        <div className="text-[clamp(64px,10vw,120px)] font-black tracking-[-0.04em] leading-[0.88] text-white tabular-nums">
          {value.toLocaleString('vi-VN')}
          <span className="text-white/45"> /</span>
        </div>
        <div className="text-[clamp(14px,2vw,17px)] font-medium text-white/80 mt-3.5 max-w-[520px] mx-auto">
          Sample Stop AKN đã phát ra
        </div>

        <div className="flex justify-center gap-10 mt-8 flex-wrap">
          <div className="text-center">
            <div className="text-[28px] font-black text-white">{value.toLocaleString('vi-VN')}</div>
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/60 mt-1">Sample đã phát</div>
          </div>
          <div className="text-center">
            <div className="text-[28px] font-black text-white">{Math.floor(value / 2).toLocaleString('vi-VN')}</div>
            <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/60 mt-1">Người tham dự</div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/40">Mục tiêu 5,000</span>
            <span className="text-[11px] font-extrabold text-white/50">{pct}%</span>
          </div>
          <div className="h-1.5 bg-[rgba(111,162,52,0.15)] rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-[2000ms] ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
