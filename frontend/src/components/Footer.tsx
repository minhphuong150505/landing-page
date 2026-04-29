import { Zap, Github, Twitter, Linkedin } from 'lucide-react'

const links = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Documentation', 'API Reference', 'Status', 'Support'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Zap size={22} className="text-blue-500" />
              NexaTech
            </a>
            <p className="text-sm leading-relaxed mb-6">
              Building the infrastructure layer for the next generation of products.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="text-gray-500 hover:text-white transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} NexaTech, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
