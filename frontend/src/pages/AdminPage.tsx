import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../services/api'
import { auth } from '../services/auth'
import type {
  DashboardStats,
  VisitorStats,
  AdminContact,
  AdminNewsletter,
  AdminSlotBooking,
  AdminUGCRegistration,
} from '../types'

type Tab = 'contacts' | 'newsletter' | 'slots' | 'ugc'

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-1 shadow-sm">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</span>
    </div>
  )
}

function BarChart({ data, title }: { data: Record<string, number>; title: string }) {
  const entries = Object.entries(data).slice(-14)
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="flex items-end gap-1 h-32">
        {entries.map(([label, count]) => (
          <div key={label} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-xs text-gray-400">{count}</span>
            <div
              className="w-full bg-pink-400 rounded-t"
              style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? 4 : 0 }}
            />
            <span className="text-[10px] text-gray-400 rotate-45 origin-left whitespace-nowrap">
              {label.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopPaths({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).slice(0, 10)
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">Top trang</h3>
      <div className="flex flex-col gap-2">
        {entries.map(([path, count]) => (
          <div key={path} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-28 truncate">{path}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-pink-400 h-2 rounded-full"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const nav = useNavigate()
  const [tab, setTab] = useState<Tab>('contacts')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null)
  const [contacts, setContacts] = useState<AdminContact[]>([])
  const [newsletter, setNewsletter] = useState<AdminNewsletter[]>([])
  const [slots, setSlots] = useState<AdminSlotBooking[]>([])
  const [ugc, setUgc] = useState<AdminUGCRegistration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.dashboard(),
      adminApi.visitorStats(),
      adminApi.contacts(),
      adminApi.newsletter(),
      adminApi.slots(),
      adminApi.ugc(),
    ])
      .then(([d, v, c, n, s, u]) => {
        setStats(d.data)
        setVisitorStats(v.data)
        setContacts(c.data ?? [])
        setNewsletter(n.data ?? [])
        setSlots(s.data ?? [])
        setUgc(u.data ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleContactStatus = async (id: number, status: string) => {
    const res = await adminApi.updateContactStatus(id, status)
    setContacts(prev => prev.map(c => (c.id === id ? res.data : c)))
  }

  const handleSlotStatus = async (id: number, status: string) => {
    const res = await adminApi.updateSlotStatus(id, status)
    setSlots(prev => prev.map(s => (s.id === id ? res.data : s)))
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'contacts', label: 'Contacts', count: contacts.length },
    { key: 'newsletter', label: 'Newsletter', count: newsletter.length },
    { key: 'slots', label: 'Slot Bookings', count: slots.length },
    { key: 'ugc', label: 'UGC', count: ugc.length },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => { auth.clear(); nav('/admin/login') }}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Đăng xuất
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : (
          <>
            {/* Stat Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Contacts" value={stats.totalContacts} />
                <StatCard label="Subscribers" value={stats.activeSubscribers} />
                <StatCard label="Slot Bookings" value={stats.totalSlotBookings} />
                <StatCard label="UGC" value={stats.totalUgcRegistrations} />
                <StatCard label="Page Views" value={stats.totalPageViews} />
                <StatCard label="Unique Visitors" value={stats.uniqueVisitors} />
              </div>
            )}

            {/* Charts */}
            {visitorStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart data={visitorStats.viewsByDay} title="Lượt xem 14 ngày gần nhất" />
                <TopPaths data={visitorStats.viewsByPath} />
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                {tabs.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-5 py-3 text-sm font-medium transition-colors ${
                      tab === t.key
                        ? 'border-b-2 border-pink-500 text-pink-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.label}
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                {/* Contacts */}
                {tab === 'contacts' && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Tên</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">SĐT</th>
                        <th className="px-4 py-3 text-left">Chủ đề</th>
                        <th className="px-4 py-3 text-left">Trạng thái</th>
                        <th className="px-4 py-3 text-left">Ngày</th>
                        <th className="px-4 py-3 text-left">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {contacts.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                          <td className="px-4 py-3 text-gray-600">{c.email}</td>
                          <td className="px-4 py-3 text-gray-600">{c.phone || '—'}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{c.subject || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="px-4 py-3">
                            {c.status === 'NEW' ? (
                              <button
                                onClick={() => handleContactStatus(c.id, 'HANDLED')}
                                className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-100 transition"
                              >
                                Đánh dấu đã xử lý
                              </button>
                            ) : (
                              <button
                                onClick={() => handleContactStatus(c.id, 'NEW')}
                                className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded hover:bg-gray-100 transition"
                              >
                                Reset
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Newsletter */}
                {tab === 'newsletter' && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Trạng thái</th>
                        <th className="px-4 py-3 text-left">Ngày đăng ký</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {newsletter.map(n => (
                        <tr key={n.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{n.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              n.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {n.active ? 'Active' : 'Unsubscribed'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(n.subscribedAt).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Slots */}
                {tab === 'slots' && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Tên</th>
                        <th className="px-4 py-3 text-left">SĐT</th>
                        <th className="px-4 py-3 text-left">Trạng thái</th>
                        <th className="px-4 py-3 text-left">Ngày</th>
                        <th className="px-4 py-3 text-left">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {slots.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                          <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              s.status === 'BOOKED' ? 'bg-blue-100 text-blue-700' :
                              s.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="px-4 py-3 flex gap-2">
                            {s.status !== 'CONFIRMED' && (
                              <button
                                onClick={() => handleSlotStatus(s.id, 'CONFIRMED')}
                                className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-100 transition"
                              >
                                Xác nhận
                              </button>
                            )}
                            {s.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleSlotStatus(s.id, 'CANCELLED')}
                                className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded hover:bg-red-100 transition"
                              >
                                Huỷ
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* UGC */}
                {tab === 'ugc' && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Họ và tên</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Nền tảng</th>
                        <th className="px-4 py-3 text-left">Trạng thái</th>
                        <th className="px-4 py-3 text-left">Ngày</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ugc.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                          <td className="px-4 py-3 text-gray-600">{u.email}</td>
                          <td className="px-4 py-3 text-gray-600">{u.platform}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
