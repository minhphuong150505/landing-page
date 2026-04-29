import { Cloud, Cpu, Shield, Zap, BarChart3, Headphones } from 'lucide-react'

const features = [
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    description: 'Scalable, reliable cloud hosting with automatic failover and global CDN to keep your app blazing fast.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Tools',
    description: 'Integrate intelligent automation, predictive analytics, and ML models directly into your workflow.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant infrastructure with end-to-end encryption, DDoS protection, and automated backups.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Optimized stack delivering sub-50ms response times with intelligent caching and edge computing.',
    color: 'text-yellow-600 bg-yellow-50',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time dashboards and insights to monitor performance, usage patterns, and business metrics.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'Dedicated engineering team available around the clock via chat, email, or video call.',
    color: 'text-rose-600 bg-rose-50',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
            Everything you need to scale
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            A complete platform built for modern businesses — from startup to enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300">
              <div className={`inline-flex p-3 rounded-xl ${color} mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
