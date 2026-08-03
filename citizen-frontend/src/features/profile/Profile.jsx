import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Pencil, Save, Award, Trophy, Lock, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import PasswordStrength from '../../components/common/PasswordStrength'

export default function Profile() {
  const { user, setUser } = useAuth()
  const toast = useToast()
  const { t } = useLanguage()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(user)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  function save() {
    setUser((u) => ({ ...u, ...form }))
    setEditing(false)
    toast.push('Profile updated successfully.', 'success')
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl tracking-wide text-ink">{t('profile_title')}</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-ghost text-sm px-4 py-2.5"><Pencil size={15} /> {t('profile_edit')}</button>
        ) : (
          <button onClick={save} className="btn-primary text-sm px-4 py-2.5"><Save size={15} /> {t('profile_save')}</button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic info card */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-display text-3xl">
                  {user?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                {editing && (
                  <button className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Camera size={13} />
                  </button>
                )}
              </div>
              <div>
                <p className="font-semibold text-lg text-ink">{user?.fullName}</p>
                <p className="text-sm text-ink-soft">@{user?.username}</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FieldRow label="Full Name" value={form.fullName} editing={editing} onChange={(v) => setForm({ ...form, fullName: v })} />
              <FieldRow label="Email" value={form.email} editing={editing} onChange={(v) => setForm({ ...form, email: v })} />
              <FieldRow label="Phone" value={form.phone} editing={editing} onChange={(v) => setForm({ ...form, phone: v })} />
              <FieldRow label="City" value={form.city} editing={editing} onChange={(v) => setForm({ ...form, city: v })} />
              <FieldRow label="State" value={form.state} editing={editing} onChange={(v) => setForm({ ...form, state: v })} />
              <FieldRow label="Pincode" value={form.pincode} editing={editing} onChange={(v) => setForm({ ...form, pincode: v })} />
            </div>
          </div>

          {/* Badges */}
          <div className="card p-6">
            <h3 className="font-display text-lg tracking-wide text-ink mb-4 flex items-center gap-2"><Award size={17} className="text-orange-500" /> {t('profile_badges')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {user?.badges.map((b) => (
                <div key={b.id} className={`rounded-2xl p-4 flex flex-col items-center text-center gap-2 border ${b.earned ? 'border-orange-200 bg-orange-50' : 'border-line bg-surface-alt opacity-60'}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${b.earned ? 'bg-orange-500 text-white' : 'bg-card text-ink-soft'}`}>
                    <Trophy size={17} />
                  </div>
                  <p className="text-xs font-medium text-ink">{b.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h3 className="font-display text-lg tracking-wide text-ink mb-4 flex items-center gap-2"><Lock size={17} className="text-orange-500" /> {t('profile_security')}</h3>
            <button onClick={() => setShowPasswordModal(true)} className="btn-ghost text-sm">{t('profile_changePassword')}</button>
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full px-3 py-1.5 mb-3">
              <Award size={12} /> {user?.badge}
            </span>
            <p className="font-display text-4xl tracking-wide text-ink">{user?.contributionScore}</p>
            <p className="text-xs text-ink-soft mt-1">{t('profile_contribution')}</p>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-line">
              <div>
                <p className="font-display text-2xl tracking-wide text-ink">{user?.totalReports}</p>
                <p className="text-[11px] text-ink-soft">Total Reports</p>
              </div>
              <div>
                <p className="font-display text-2xl tracking-wide text-ink">{user?.resolvedReports}</p>
                <p className="text-[11px] text-ink-soft">Resolved</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink mb-3">{t('profile_leaderboard')}</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-display text-xl">#{user?.leaderboardRank}</div>
              <p className="text-xs text-ink-soft">Among all citizens in {user?.city}</p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-ink mb-3">{t('profile_levelProgress')}</h3>
            <div className="flex items-center justify-between text-xs text-ink-soft mb-1.5">
              <span>Level {user?.level}</span>
              <span>{user?.levelProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${user?.levelProgress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  )
}

function FieldRow({ label, value, editing, onChange }) {
  return (
    <div>
      <label className="label mb-1.5 block">{label}</label>
      {editing ? (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
      ) : (
        <p className="text-sm text-ink py-3">{value}</p>
      )}
    </div>
  )
}

function PasswordModal({ onClose }) {
  const [pwd, setPwd] = useState('')
  const toast = useToast()
  function submit(e) {
    e.preventDefault()
    onClose()
    toast.push('Password changed successfully.', 'success')
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <motion.form onSubmit={submit} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative card p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl tracking-wide">{t('profile_changePassword')}</h3>
          <button type="button" onClick={onClose}><X size={18} className="text-ink-soft" /></button>
        </div>
        <label className="label mb-1.5 block">Current Password</label>
        <input type="password" className="input-field mb-4" placeholder="••••••••" />
        <label className="label mb-1.5 block">New Password</label>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="input-field" placeholder="••••••••" />
        <PasswordStrength password={pwd} />
        <button type="submit" className="btn-primary w-full mt-5 py-3">Update Password</button>
      </motion.form>
    </div>
  )
}
