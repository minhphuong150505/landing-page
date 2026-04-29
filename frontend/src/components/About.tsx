import { CheckCircle2 } from 'lucide-react'

const highlights = [
  'Founded in 2019 with a mission to democratize cloud technology',
  'Team of 120+ engineers across 15 countries',
  'SOC 2 Type II & ISO 27001 certified',
  'Processing over 10 billion requests per month',
  'Backed by leading venture capital firms',
]

export default function About() {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="mt-2 text-4xl font-extrabold text-gray-900 leading-tight">
              We build infrastructure so you can build products
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              NexaTech was born from a simple frustration: great ideas were being slowed down by
              complex infrastructure. We set out to build the platform we always wished existed —
              one that gets out of your way and lets you focus on what matters.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Today we power thousands of companies from early-stage startups to Fortune 500
              enterprises, processing billions of requests daily with bulletproof reliability.
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: '5K+', label: 'Active Clients' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '10B+', label: 'Requests/mo' },
                  { value: '120+', label: 'Team Members' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
                    <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/20 text-center">
                <p className="text-blue-100 text-sm">
                  "NexaTech cut our infrastructure costs by 40% while improving reliability 10x."
                </p>
                <p className="mt-2 font-semibold text-white text-sm">— CTO, ScaleUp Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
