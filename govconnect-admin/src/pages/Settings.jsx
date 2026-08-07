import { useState } from 'react'
import Topbar from '../components/layout/Topbar'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useRoutingSettings } from '../hooks/useSettings'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { settings, loading, upsert, refresh } = useRoutingSettings()
  const { isSuperAdmin } = useAuth()
  const [newCategory, setNewCategory] = useState({ category: '', sla_hours: 72, duplicate_radius_meters: 150 })
  const [savingId, setSavingId] = useState(null)

  const saveRow = async (row) => {
    setSavingId(row.category)
    try {
      await upsert(row)
      await refresh()
    } finally {
      setSavingId(null)
    }
  }

  const addCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.category.trim()) return
    await upsert(newCategory)
    setNewCategory({ category: '', sla_hours: 72, duplicate_radius_meters: 150 })
    await refresh()
  }

  return (
    <div>
      <Topbar title="Settings" subtitle="Per-category SLA and duplicate-detection routing rules" />
      <div className="space-y-6 p-8">
        {!isSuperAdmin && (
          <p className="rounded-md bg-status-amberSoft px-4 py-2.5 text-sm text-status-amber">
            Only super admins can change these values — you can view current routing rules below.
          </p>
        )}

        <Card className="overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-ink/50">Loading…</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">SLA (hours)</th>
                  <th className="px-5 py-3 font-medium">Duplicate radius (m)</th>
                  {isSuperAdmin && <th className="px-5 py-3 font-medium" />}
                </tr>
              </thead>
              <tbody>
                {settings.map((row) => (
                  <SettingsRow
                    key={row.category}
                    row={row}
                    editable={isSuperAdmin}
                    saving={savingId === row.category}
                    onSave={saveRow}
                  />
                ))}
                {settings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-ink/50">
                      No routing rules configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Card>

        {isSuperAdmin && (
          <Card className="p-5">
            <h2 className="font-display text-sm font-extrabold text-ink">Add category rule</h2>
            <form onSubmit={addCategory} className="mt-3 flex flex-wrap items-end gap-3">
              <Input
                label="Category"
                placeholder="e.g. Water supply"
                value={newCategory.category}
                onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
              />
              <Input
                label="SLA hours"
                type="number"
                min={1}
                value={newCategory.sla_hours}
                onChange={(e) => setNewCategory({ ...newCategory, sla_hours: Number(e.target.value) })}
              />
              <Input
                label="Duplicate radius (m)"
                type="number"
                min={1}
                value={newCategory.duplicate_radius_meters}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, duplicate_radius_meters: Number(e.target.value) })
                }
              />
              <Button type="submit">Add</Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

function SettingsRow({ row, editable, saving, onSave }) {
  const [sla, setSla] = useState(row.sla_hours)
  const [radius, setRadius] = useState(row.duplicate_radius_meters)
  const dirty = sla !== row.sla_hours || radius !== row.duplicate_radius_meters

  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-5 py-3 font-medium capitalize text-ink">{row.category}</td>
      <td className="px-5 py-3">
        {editable ? (
          <input
            type="number"
            value={sla}
            onChange={(e) => setSla(Number(e.target.value))}
            className="w-24 rounded-md border border-line px-2 py-1 text-sm"
          />
        ) : (
          row.sla_hours
        )}
      </td>
      <td className="px-5 py-3">
        {editable ? (
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-24 rounded-md border border-line px-2 py-1 text-sm"
          />
        ) : (
          row.duplicate_radius_meters
        )}
      </td>
      {editable && (
        <td className="px-5 py-3">
          <Button
            variant="secondary"
            disabled={!dirty || saving}
            onClick={() => onSave({ category: row.category, sla_hours: sla, duplicate_radius_meters: radius })}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </td>
      )}
    </tr>
  )
}
