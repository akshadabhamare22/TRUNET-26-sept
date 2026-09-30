import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ListChecks } from 'lucide-react'

const AppHeaderDropdownTasks = () => {
  const { t } = useTranslation()

  const itemsCount = 5
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setDropdownOpen((prev) => !prev)
        }
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100"
        aria-label="Tasks"
        aria-expanded={dropdownOpen}
      >
        <ListChecks size={20} />

        <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
          <span className="sr-only">
            {itemsCount} new alerts
          </span>
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full z-[1000] mt-2 min-w-[220px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="rounded-t-md bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
            {t('taskCounter', {
              counter: itemsCount,
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AppHeaderDropdownTasks