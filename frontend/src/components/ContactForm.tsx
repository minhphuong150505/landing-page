import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { contactApi } from '../services/api'
import type { ContactRequest } from '../types'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactRequest>()

  const onSubmit = async (data: ContactRequest) => {
    setStatus('loading')
    try {
      const res = await contactApi.submit(data)
      if (res.success) {
        setStatus('success')
        setServerMessage(res.message)
        reset()
      } else {
        setStatus('error')
        setServerMessage(res.message)
      }
    } catch {
      setStatus('error')
      setServerMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Contact</span>
            <h2 className="mt-2 text-4xl font-extrabold text-gray-900">Let's talk about your project</h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Whether you're ready to start or just exploring options, our team is here to help.
              We typically respond within 2 hours.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { label: 'Email', value: 'hello@nexatech.io' },
                { label: 'Phone', value: '+1 (555) 123-4567' },
                { label: 'Office', value: 'San Francisco, CA' },
              ].map(item => (
                <div key={item.label}>
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
                  <p className="text-gray-700 font-medium mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                <p className="text-gray-500">{serverMessage}</p>
                <button onClick={() => setStatus('idle')}
                  className="mt-6 text-blue-600 font-medium hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {status === 'error' && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    <AlertCircle size={16} />
                    {serverMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                    <input {...register('name', { required: 'Name is required' })}
                      placeholder="Your name"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                        errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`} />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                    })}
                      type="email" placeholder="you@company.com"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                        errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input {...register('phone')}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <input {...register('subject')}
                      placeholder="How can we help?"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 text-sm outline-none transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' }
                  })}
                    rows={5} placeholder="Tell us about your project..."
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none resize-none transition-colors ${
                      errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`} />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button type="submit" disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors">
                  {status === 'loading' ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
