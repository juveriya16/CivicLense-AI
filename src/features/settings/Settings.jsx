import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Globe, MapPin, Bell, Trash2, LogOut, ChevronRight, AlertTriangle, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { LANGUAGES } from '../../mock/translations'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${checked ? 'bg-orange-500' : 'bg-surface-alt'}`}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ left: checked ? '22px' : '2px' }} />
    </button>
  )
}

function SettingRow({ icon: Icon, title, description, right }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-10 w-10 rounded-xl bg-surface-alt text-ink-soft flex items-center justify-center shrink-0">
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description && <p className="text-xs text-ink-soft mt-0.5">{description}</p>}
      </div>
      {right}
    </div>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()

  const [locationAccess, setLocationAccess] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [profileVisible, setProfileVisible] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value)
    toast.push(`Language switched to ${e.target.value}.`, 'success')
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-6">{t('settings_title')}</h1>

      <div className="card p-6 mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">{t('settings_appearance')}</h3>
        <div className="divide-y divide-line">
          <SettingRow
            icon={theme === 'dark' ? Moon : Sun}
            title={t('settings_darkMode')}
            description={theme === 'dark' ? t('settings_darkModeOn') : t('settings_darkModeOff')}
            right={<Toggle checked={theme === 'dark'} onChange={toggleTheme} />}
          />
          <SettingRow
            icon={Globe}
            title={t('settings_language')}
            description={t('settings_languageDesc')}
            right={
              <select value={language} onChange={handleLanguageChange} className="input-field !w-auto !py-2 text-sm">
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            }
          />
        </div>
      </div>

      <div className="card p-6 mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">{t('settings_privacy')}</h3>
        <div className="divide-y divide-line">
          <SettingRow icon={MapPin} title={t('settings_locationPerm')} description={t('settings_locationPermDesc')} right={<Toggle checked={locationAccess} onChange={setLocationAccess} />} />
          <SettingRow icon={ChevronRight} title={t('settings_profileVisibility')} description={t('settings_profileVisibilityDesc')} right={<Toggle checked={profileVisible} onChange={setProfileVisible} />} />
        </div>
      </div>

      <div className="card p-6 mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">{t('settings_notifPrefs')}</h3>
        <div className="divide-y divide-line">
          <SettingRow icon={Bell} title={t('settings_push')} description={t('settings_pushDesc')} right={<Toggle checked={pushNotif} onChange={setPushNotif} />} />
          <SettingRow icon={Bell} title={t('settings_email')} description={t('settings_emailDesc')} right={<Toggle checked={emailNotif} onChange={setEmailNotif} />} />
        </div>
      </div>

      <div className="card p-6 mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-danger mb-1">{t('settings_dangerZone')}</h3>
        <div className="divide-y divide-line">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 py-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-surface-alt text-ink-soft flex items-center justify-center shrink-0"><LogOut size={17} /></div>
            <p className="text-sm font-medium text-ink flex-1">{t('settings_logout')}</p>
            <ChevronRight size={16} className="text-ink-soft" />
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center gap-4 py-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0"><Trash2 size={17} /></div>
            <p className="text-sm font-medium text-danger flex-1">{t('settings_deleteAccount')}</p>
            <ChevronRight size={16} className="text-danger" />
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative card p-6 w-full max-w-sm text-center">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-ink-soft"><X size={18} /></button>
            <div className="h-14 w-14 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-display text-xl tracking-wide mb-2">Delete your account?</h3>
            <p className="text-sm text-ink-soft mb-6">This will permanently remove your profile and report history. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => { setShowDeleteModal(false); toast.push('Account deletion is disabled in this demo.', 'error') }}
                className="flex-1 rounded-full bg-danger text-white font-semibold py-3 hover:bg-danger/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
