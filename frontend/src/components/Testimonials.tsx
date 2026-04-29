import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO at Prismatic',
    avatar: 'SC',
    rating: 5,
    text: 'NexaTech transformed how we deploy and scale. What used to take days now happens in minutes. The support team is genuinely world-class.',
  },
  {
    name: 'James Okafor',
    role: 'VP Engineering at Flowstate',
    avatar: 'JO',
    rating: 5,
    text: 'We migrated our entire platform to NexaTech in 3 weeks with zero downtime. The documentation and onboarding experience is unmatched.',
  },
  {
    name: 'Maria Santos',
    role: 'Founder at DataBridge',
    avatar: 'MS',
    rating: 5,
    text: 'As a startup, reliability is everything. NexaTech gives us enterprise-grade infrastructure at a price we can actually afford. Highly recommend.',
  },
  {
    name: 'Alex Thompson',
    role: 'Lead Developer at Nexify',
    avatar: 'AT',
    rating: 5,
    text: 'The AI-powered monitoring caught a potential outage before it happened. The platform pays for itself just in peace of mind.',
  },
  {
    name: 'Priya Patel',
    role: 'Head of Platform at CloudCore',
    avatar: 'PP',
    rating: 5,
    text: 'We handle 50M requests per day without breaking a sweat. The auto-scaling is seamless and the pricing is completely transparent.',
  },
  {
    name: 'Lucas Müller',
    role: 'Director of Engineering at Vaultly',
    avatar: 'LM',
    rating: 5,
    text: 'Security compliance was our biggest concern. NexaTech\'s SOC 2 certification and built-in audit logs made our compliance review effortless.',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900">Loved by engineers worldwide</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Don't take our word for it — here's what our customers say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.name}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 relative">
              <Quote size={32} className="text-blue-100 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 relative z-10">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
