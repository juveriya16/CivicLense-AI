import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, TrendingUp, FileText, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Award } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { reports } from '../../mock/reports'
import { cityStats, nearbyIssues, cityUpdates } from '../../mock/data'
import ReportCard from '../../components/common/ReportCard'
import WeeklyActivityChart from '../../components/charts/WeeklyActivityChart'
import CategoryBreakdown from '../../components/charts/CategoryBreakdown'
import CityMap from '../../components/map/CityMap'
import WeatherWidget from '../../components/common/WeatherWidget'
import CategoryIcon from '../../components/common/CategoryIcon'
import StatusChip from '../../components/common/StatusChip'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
}

const STATS = [
  { label: 'Total Reports', value: cityStats.totalReports.toLocaleString(), icon: FileText, tint: 'text-navy-700 bg-navy-50' },
  { label: 'Resolved', value: `${cityStats.resolvedPct}%`, icon: CheckCircle2, tint: 'text-success bg-success/10' },
  { label: 'Avg Resolution', value: `${cityStats.avgResolutionDays}d`, icon: Clock, tint: 'text-orange-600 bg-orange-50' },
  { label: 'Overdue', value: cityStats.overdue, icon: AlertTriangle, tint: 'text-danger bg-danger/10' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const recentReports = reports.slice(0, 3)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('greeting_morning') : hour < 18 ? t('greeting_afternoon') : t('greeting_evening')

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Greeting + Report CTA */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">{greeting}, {user?.fullName?.split(' ')[0]} 👋</p>
          <h1 className="font-display text-3xl tracking-wide text-ink mt-0.5">{t('dashboard_title')}</h1>
        </div>
        <Link to="/app/report" className="btn-primary shrink-0">
          <Camera size={18} /> {t('dashboard_reportCta')}
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Profile / contribution card */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show" className="card p-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-display text-2xl shrink-0">
                {user?.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-ink">{user?.fullName}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 bg-orange-50 rounded-full px-2.5 py-1">
                    <Award size={11} /> {user?.badge}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-0.5">{user?.city}, {user?.state} · Rank #{user?.leaderboardRank} citywide</p>
              </div>
              <Link to="/app/profile" className="hidden sm:flex items-center gap-1 text-xs font-semibold text-navy-700 hover:text-orange-600 shrink-0">
                {t('dashboard_viewProfile')} <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-surface-alt p-3.5 text-center">
                <p className="font-display text-2xl tracking-wide text-ink">{user?.contributionScore}</p>
                <p className="text-[11px] text-ink-soft mt-0.5">Contribution Score</p>
              </div>
              <div className="rounded-2xl bg-surface-alt p-3.5 text-center">
                <p className="font-display text-2xl tracking-wide text-ink">{user?.totalReports}</p>
                <p className="text-[11px] text-ink-soft mt-0.5">Reports Filed</p>
              </div>
              <div className="rounded-2xl bg-surface-alt p-3.5 text-center">
                <p className="font-display text-2xl tracking-wide text-ink">{user?.resolvedReports}</p>
                <p className="text-[11px] text-ink-soft mt-0.5">Resolved</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-ink-soft mb-1.5">
                <span>Level {user?.level}</span>
                <span>{user?.levelProgress}% to Level {user?.level + 1}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${user?.levelProgress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-300" />
              </div>
            </div>
          </motion.div>

          {/* Live status stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon, tint }, i) => (
              <motion.div key={label} variants={fadeUp} custom={i + 1} initial="hidden" animate="show" className="card p-4">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${tint}`}>
                  <Icon size={17} />
                </div>
                <p className="font-display text-2xl tracking-wide text-ink">{value}</p>
                <p className="text-[11px] text-ink-soft mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Weekly activity chart */}
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xl tracking-wide text-ink">{t('dashboard_weeklyActivity')}</h3>
              <TrendingUp size={17} className="text-orange-500" />
            </div>
            <WeeklyActivityChart />
          </motion.div>

          {/* Recent reports */}
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl tracking-wide text-ink">{t('dashboard_recentReports')}</h3>
              <Link to="/app/my-reports" className="text-xs font-semibold text-navy-700 hover:text-orange-600 flex items-center gap-1">
                {t('dashboard_viewAll')} <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentReports.length > 0 ? (
                recentReports.map((r) => <ReportCard key={r.id} report={r} />)
              ) : (
                <div className="card">
                  <EmptyState
                    icon={FileText}
                    title={t('dashboard_noReports')}
                    description={t('dashboard_noReportsDesc')}
                    action={<Link to="/app/report" className="btn-primary"><Camera size={16} /> {t('dashboard_reportCta')}</Link>}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="card p-6">
            <h3 className="font-display text-xl tracking-wide text-ink mb-4">{t('dashboard_cityMap')}</h3>
            <CityMap reports={reports} height={320} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show">
            <WeatherWidget />
          </motion.div>

          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show" className="card p-5">
            <h3 className="font-display text-lg tracking-wide text-ink mb-3">{t('dashboard_byCategory')}</h3>
            <CategoryBreakdown />
          </motion.div>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="card p-5">
            <h3 className="font-display text-lg tracking-wide text-ink mb-3">{t('dashboard_nearby')}</h3>
            <div className="flex flex-col gap-3">
              {nearbyIssues.map((issue) => (
                <Link key={issue.id} to={`/app/track/${issue.id}`} className="flex items-center gap-3 group">
                  <CategoryIcon category={issue.category} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate group-hover:text-orange-600">{issue.title}</p>
                    <p className="text-[11px] text-ink-soft">{issue.distanceKm} km away</p>
                  </div>
                  <StatusChip status={issue.status} size="sm" />
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="card p-5">
            <h3 className="font-display text-lg tracking-wide text-ink mb-3">{t('dashboard_updates')}</h3>
            <div className="flex flex-col gap-4">
              {cityUpdates.map((u) => (
                <div key={u.id} className="flex gap-3">
                  <span className="status-dot bg-orange-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-ink leading-snug">{u.title}</p>
                    <p className="text-[11px] text-ink-soft mt-0.5">{u.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
