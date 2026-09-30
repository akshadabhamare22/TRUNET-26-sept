import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Clock, Loader2 } from 'lucide-react'

import axiosInstance from '../../axiosInstance'

const AppHeaderDropdownNotif = () => {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const now = new Date()

    const seconds = Math.floor(
      (now - date) / 1000,
    )

    if (seconds < 60) {
      return 'Just now'
    }

    const minutes = Math.floor(seconds / 60)

    if (minutes < 60) {
      return `${minutes} min ago`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }

    const days = Math.floor(hours / 24)

    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    }

    const weeks = Math.floor(days / 7)

    if (weeks < 4) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get(
          '/stockrequest/notifications',
        )

        if (res.data.success) {
          const data = res.data.data || []

          setNotifications(data)
          setUnreadCount(data.length)
        }
      } catch (err) {
        console.error(
          'Error fetching notifications:',
          err,
        )
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(
          '[data-notification-dropdown]',
        )
      ) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener(
        'mousedown',
        handleClickOutside,
      )
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [dropdownOpen])

  const handleNotificationClick = (
    notification,
  ) => {
    setDropdownOpen(false)

    if (notification.stockRequestId) {
      navigate(
        `/stockRequest-profile/${notification.stockRequestId}`,
      )
    }
  }

  const handleViewAll = () => {
    setDropdownOpen(false)
    navigate('/stock-requests')
  }

  return (
    <div
      data-notification-dropdown
      className="relative"
    >
      {/* Notification Button */}
      <button
        type="button"
        onClick={() =>
          setDropdownOpen((prev) => !prev)
        }
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-white transition hover:bg-white/15"
        aria-label="Notifications"
        aria-expanded={dropdownOpen}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span
            className="absolute right-0.5 top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white"
            aria-label={`${unreadCount} new notifications`}
          >
            {unreadCount > 9
              ? '9+'
              : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full z-[1000] mt-2 w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center px-4 py-4 text-sm text-gray-500">
              <Loader2
                size={16}
                className="mr-2 animate-spin"
              />
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            <>
              {/* Notifications */}
              {notifications
                .slice(0, 5)
                .map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      handleNotificationClick(
                        notification,
                      )
                    }
                    className="block w-full border-b border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="w-full">
                      <div className="text-sm leading-[1.3] text-gray-700">
                        {notification.message}
                      </div>

                      <div className="mt-2 flex w-full justify-end">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock
                            size={13}
                            className="mr-1"
                          />

                          {getTimeAgo(
                            notification.timestamp ||
                              notification.createdAt,
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

              {/* View All */}
              {notifications.length > 5 && (
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="w-full border-t border-gray-200 px-4 py-3 text-center text-sm text-blue-600 transition-colors hover:bg-gray-50 hover:text-blue-700"
                >
                  View all{' '}
                  {notifications.length}{' '}
                  notifications
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              No notifications
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AppHeaderDropdownNotif