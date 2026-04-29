import { ArrowRight, Play, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl" />
        <div className="absolute inset-0"
          style={{backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px'}} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <Star size={14} className="fill-blue-400 text-blue-400" />
            Trusted by 5,000+ businesses worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Build the Future{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Faster
            </span>
          </h1>

          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            NexaTech provides cutting-edge cloud infrastructure, AI-powered development tools,
            and expert engineering support to help your business scale without limits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#contact"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105">
              Start for Free
              <ArrowRight size={20} />
            </a>
            <a href="#features"
              className="flex items-center gap-2 text-white/80 hover:text-white px-6 py-4 font-medium transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Play size={16} className="ml-0.5" />
              </div>
              See how it works
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '5,000+', label: 'Happy Clients' },
              { value: '< 50ms', label: 'Avg Response' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-300/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
