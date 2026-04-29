import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, CheckCircle } from 'lucide-react'
import { newsletterApi } from '../services/api'
import type { NewsletterRequest } from '../types'

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterRequest>()

  const onSubmit = async (data: NewsletterRequest) => {
    setLoading(true)
    setError('')
    try {
      const res = await newsletterApi.subscribe(data)
      if (res.success) {
        setSubmitted(true)
      } else {
        setError(res.message)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail size={40} className="text-blue-200 mx-auto mb-4" />
        <h2 className="text-3xl font-extrabold text-white mb-3">Stay in the loop</h2>
        <p className="text-blue-100 text-lg mb-8">
          Get the latest product updates, engineering insights, and company news delivered to your inbox.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 text-white text-lg font-medium">
            <CheckCircle size={24} />
            You're subscribed! Thanks for joining us.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <div className="flex-1">
                <input {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                })}
                  type="email" placeholder="Enter your email"
                  className="w-full px-5 py-3 rounded-full text-gray-900 outline-none text-sm" />
              </div>
              <button type="submit" disabled={loading}
                className="bg-white hover:bg-gray-50 text-blue-700 font-semibold px-6 py-3 rounded-full transition-colors text-sm whitespace-nowrap disabled:opacity-70">
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {(errors.email || error) && (
              <p className="mt-2 text-blue-200 text-sm text-left pl-4">
                {errors.email?.message || error}
              </p>
            )}
            <p className="mt-3 text-blue-200/70 text-xs">No spam, ever. Unsubscribe at any time.</p>
          </form>
        )}
      </div>
    </section>
  )
}
