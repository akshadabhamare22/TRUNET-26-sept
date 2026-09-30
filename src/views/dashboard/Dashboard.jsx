import React, {
  useEffect,
  useState,
} from 'react'

import NotificationDetails from './NotificationDetails'
import IndentCard from './IndentCard'
import TransactionReport from './TransactionReport'
import CenterUsage from './CenterUsage'
import LoginHistory from './LoginHistory'

const Dashboard = () => {
  const [
    showNotice,
    setShowNotice,
  ] = useState(true)

  const [
    animate,
    setAnimate,
  ] = useState(false)

  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState(null)

  const storedUserCenter =
    localStorage.getItem('userCenter')

  const userCenter = storedUserCenter
    ? JSON.parse(storedUserCenter)
    : {}

  const userCenterType = (
    userCenter.centerType ||
    'Outlet'
  ).toLowerCase()

  const closeNotice = () => {
    setShowNotice(false)
  }

  const handleNotificationClick = (
    notification,
  ) => {
    setSelectedNotification(
      notification,
    )
  }

  useEffect(() => {
    if (
      showNotice &&
      userCenterType !== 'center'
    ) {
      const timer = setTimeout(() => {
        setAnimate(true)
      }, 50)

      return () => {
        clearTimeout(timer)
      }
    }

    setShowNotice(false)
  }, [
    showNotice,
    userCenterType,
  ])

  return (
    <div className="w-full">
      {/*
        Notice section intentionally kept
        commented as in the old frontend.

        {showNotice &&
          userCenterType !== 'center' && (
            <div>
              ...
            </div>
          )}
      */}

      {selectedNotification ? (
        <NotificationDetails
          notification={
            selectedNotification
          }
          onBack={() =>
            setSelectedNotification(null)
          }
        />
      ) : (
        <div className="w-full space-y-4">
          <IndentCard />

          <TransactionReport
            onNotificationClick={
              handleNotificationClick
            }
          />

          <CenterUsage />

          <LoginHistory />
        </div>
      )}
    </div>
  )
}

export default Dashboard