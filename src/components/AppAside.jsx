import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  List,
  MessageSquare,
  Settings,
  X,
  CalendarDays,
  MapPin,
  Home,
  Video,
  AlertCircle,
} from 'lucide-react'

import avatar1 from './../assets/images/avatars/1.jpg'
import avatar2 from './../assets/images/avatars/2.jpg'
import avatar3 from './../assets/images/avatars/3.jpg'
import avatar4 from './../assets/images/avatars/4.jpg'
import avatar5 from './../assets/images/avatars/5.jpg'
import avatar6 from './../assets/images/avatars/6.jpg'
import avatar7 from './../assets/images/avatars/7.jpg'
import avatar8 from './../assets/images/avatars/8.jpg'

const AppAside = () => {
  const dispatch = useDispatch()
  const asideShow = useSelector((state) => state.asideShow)
  const { t } = useTranslation()

  const [activeKey, setActiveKey] = useState(1)

  const handleClose = () => {
    dispatch({
      type: 'set',
      asideShow: false,
    })
  }

  const tabButtonClass = (active) =>
    `
      flex flex-1 items-center justify-center
      border-b-2 px-4 py-3
      transition-colors duration-150
      ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-800'
      }
    `

  if (!asideShow) {
    return null
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[1040] bg-black/30"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Aside */}
      <aside
        className="
          fixed right-0 top-0 z-[1050]
          flex h-screen w-full max-w-[400px]
          flex-col border-l border-gray-200
          bg-white shadow-2xl
        "
      >
        {/* Header / Tabs */}
        <div className="relative border-b border-gray-200">
          <div className="flex w-full">
            <button
              type="button"
              className={tabButtonClass(activeKey === 1)}
              onClick={() => setActiveKey(1)}
              aria-label="Calendar"
            >
              <List size={20} />
            </button>

            <button
              type="button"
              className={tabButtonClass(activeKey === 2)}
              onClick={() => setActiveKey(2)}
              aria-label="Messages"
            >
              <MessageSquare size={20} />
            </button>

            <button
              type="button"
              className={tabButtonClass(activeKey === 3)}
              onClick={() => setActiveKey(3)}
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              absolute right-2 top-1/2
              flex h-8 w-8 -translate-y-1/2
              items-center justify-center
              rounded-md text-gray-500
              transition hover:bg-gray-100
              hover:text-gray-800
            "
            aria-label="Close aside"
          >
            <X size={19} />
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {/* TAB 1 - Schedule */}
          {activeKey === 1 && (
            <div>
              {/* Today */}
              <div className="border-l-4 border-gray-400 bg-gray-100 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t('today')}
              </div>

              {/* Meeting */}
              <div className="border-l-4 border-yellow-400 border-b border-gray-200 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-700">
                      Meeting with{' '}
                      <strong>Lucas</strong>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={13} />
                        1 - 3pm
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} />
                        Palo Alto, CA
                      </span>
                    </div>
                  </div>

                  <img
                    src={avatar7}
                    alt="Lucas"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Skype */}
              <div className="border-l-4 border-cyan-400 border-b border-gray-200 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-700">
                      Skype with{' '}
                      <strong>Megan</strong>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={13} />
                        4 - 5pm
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Video size={13} />
                        On-line
                      </span>
                    </div>
                  </div>

                  <img
                    src={avatar4}
                    alt="Megan"
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Tomorrow */}
              <div className="border-l-4 border-gray-400 bg-gray-100 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t('tomorrow')}
              </div>

              {/* New UI Project */}
              <div className="border-l-4 border-red-500 border-b border-gray-200 px-4 py-4">
                <div className="text-sm text-gray-700">
                  New UI Project -{' '}
                  <strong>deadline</strong>
                </div>

                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    10 - 11pm
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Home size={13} />
                    creativeLabs HQ
                  </span>
                </div>

                <div className="mt-3 flex -space-x-2">
                  {[avatar2, avatar3, avatar4, avatar5, avatar6].map(
                    (avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt={`Team member ${index + 1}`}
                        className="h-7 w-7 rounded-full border-2 border-white object-cover"
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Meetup */}
              <div className="border-l-4 border-green-500 border-b border-gray-200 px-4 py-4">
                <div className="text-sm text-gray-700">
                  <strong>
                    #10 Startups.Garden
                  </strong>{' '}
                  Meetup
                </div>

                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    1 - 3pm
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} />
                    Palo Alto, CA
                  </span>
                </div>
              </div>

              {/* Team Meeting */}
              <div className="border-l-4 border-blue-500 px-4 py-4">
                <div className="text-sm text-gray-700">
                  <strong>Team meeting</strong>
                </div>

                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    4 - 6pm
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Home size={13} />
                    creativeLabs HQ
                  </span>
                </div>

                <div className="mt-3 flex -space-x-2">
                  {[
                    avatar2,
                    avatar3,
                    avatar4,
                    avatar5,
                    avatar6,
                    avatar7,
                    avatar8,
                  ].map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`Team member ${index + 1}`}
                      className="h-7 w-7 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 - Messages */}
          {activeKey === 2 && (
            <div className="p-4">
              <MessageItem
                avatar={avatar1}
                name="Jessica Williams"
                time="Just now"
                title={
                  <>
                    <span className="text-red-600">
                      !
                    </span>{' '}
                    Urgent: System Maintenance
                    Tonight
                  </>
                }
                message="Attention team, we'll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly..."
              />

              <MessageItem
                avatar={avatar2}
                name="Richard Johnson"
                time="5 minutes ago"
                title="Social Media Campaign Launch"
                message="Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement..."
              />

              <MessageItem
                avatar={avatar4}
                name="Angela Rodriguez"
                time="1:52 PM"
                title={
                  <>
                    <span className="text-red-600">
                      !
                    </span>{' '}
                    Project Update: Milestone
                    Achieved
                  </>
                }
                message="Kudos on hitting sales targets last quarter! Let's keep the momentum. New goals, new victories ahead..."
              />

              <MessageItem
                avatar={avatar5}
                name="Jane Lewis"
                time="4:03 PM"
                title="Inventory Checkpoint"
                message="Team, it's time for our monthly inventory check. Accurate counts ensure smooth operations. Let's nail it..."
              />

              <MessageItem
                avatar={avatar3}
                name="Ryan Miller"
                time="3 days ago"
                title="Customer Feedback Results"
                message="Our latest customer feedback is in. Let's analyze and discuss improvements for an even better service..."
                last
              />
            </div>
          )}

          {/* TAB 3 - Settings */}
          {activeKey === 3 && (
            <div className="p-5">
              <h6 className="mb-5 text-base font-semibold text-gray-800">
                {t('settings')}
              </h6>

              <SettingSwitch
                id="Option1"
                label="Option 1"
                defaultChecked
                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              />

              <SettingSwitch
                id="Option2"
                label="Option 2"
                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              />

              <SettingSwitch
                id="Option3"
                label="Option 3"
              />

              <SettingSwitch
                id="Option4"
                label="Option 4"
                defaultChecked
              />

              <hr className="my-5 border-gray-200" />

              <h6 className="mb-4 text-base font-semibold text-gray-800">
                {t('systemUtilization')}
              </h6>

              <ProgressItem
                label={t('cpuUsage')}
                value={25}
                text={t(
                  'cpuUsageDescription',
                  {
                    number_of_processes: 348,
                    number_of_cores: '1/4',
                  },
                )}
                progressClass="bg-cyan-500"
              />

              <ProgressItem
                label={t('memoryUsage')}
                value={70}
                text="11444GB/16384MB"
                progressClass="bg-yellow-500"
              />

              <ProgressItem
                label={t('ssdUsage')}
                value={95}
                text="243GB/256GB"
                progressClass="bg-red-500"
              />

              <ProgressItem
                label={t('ssdUsage')}
                value={10}
                text="25GB/256GB"
                progressClass="bg-green-500"
              />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

/* Message Item */
const MessageItem = ({
  avatar,
  name,
  time,
  title,
  message,
  last = false,
}) => {
  return (
    <div
      className={`flex gap-3 py-3 ${
        !last
          ? 'border-b border-gray-200'
          : ''
      }`}
    >
      <img
        src={avatar}
        alt={name}
        className="mt-1 h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-green-400"
      />

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-3 text-xs text-gray-500">
          <span>{name}</span>
          <span className="shrink-0">
            {time}
          </span>
        </div>

        <div className="mt-1 truncate text-sm font-semibold text-gray-800">
          {title}
        </div>

        <div className="mt-1 text-xs leading-relaxed text-gray-500">
          {message}
        </div>
      </div>
    </div>
  )
}

/* Setting Switch */
const SettingSwitch = ({
  id,
  label,
  defaultChecked = false,
  description,
}) => {
  const [checked, setChecked] =
    useState(defaultChecked)

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-between"
      >
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>

        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() =>
            setChecked((prev) => !prev)
          }
          className={`relative h-6 w-11 rounded-full transition-colors ${
            checked
              ? 'bg-blue-600'
              : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              checked
                ? 'translate-x-5'
                : 'translate-x-0.5'
            }`}
          />
        </button>
      </label>

      {description && (
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {description}
        </p>
      )}
    </div>
  )
}

/* Progress Item */
const ProgressItem = ({
  label,
  value,
  text,
  progressClass,
}) => {
  return (
    <div className="mb-4">
      <div className="mb-1 text-xs font-semibold uppercase text-gray-700">
        {label}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${progressClass}`}
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="mt-1 text-xs text-gray-500">
        {text}
      </div>
    </div>
  )
}

export default React.memo(AppAside)