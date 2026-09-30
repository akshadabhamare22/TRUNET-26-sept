import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'

const DatePicker = ({
  value = '',
  onChange,
  placeholder = 'Select Date Range',
  className = '',
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedRange, setSelectedRange] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('12:00 AM')
  const [endTime, setEndTime] = useState('11:59 PM')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [nextMonth, setNextMonth] = useState(
    new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ),
  )
  const [isCustomRange, setIsCustomRange] = useState(false)

  const datePickerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const openDatePicker = () => {
    setShowDatePicker(true)

    const now = new Date()

    setCurrentMonth(new Date(now))

    setNextMonth(
      new Date(
        new Date(now).setMonth(now.getMonth() + 1),
      ),
    )
  }

  const handleQuickRangeSelect = (range) => {
    setSelectedRange(range)

    const today = new Date()
    let start
    let end

    switch (range) {
      case 'Today':
        start = today
        end = today
        break

      case 'Yesterday':
        start = new Date(today)
        start.setDate(today.getDate() - 1)
        end = new Date(start)
        break

      case 'This Week':
        start = new Date(today)
        start.setDate(
          today.getDate() - today.getDay(),
        )
        end = new Date(today)
        end.setDate(
          today.getDate() + (6 - today.getDay()),
        )
        break

      case 'Last Week':
        start = new Date(today)
        start.setDate(
          today.getDate() - today.getDay() - 7,
        )
        end = new Date(start)
        end.setDate(start.getDate() + 6)
        break

      case 'This Month':
        start = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        )
        end = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        )
        break

      case 'Last Month':
        start = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        )
        end = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
        )
        break

      case 'This Year':
        start = new Date(
          today.getFullYear(),
          0,
          1,
        )
        end = new Date(
          today.getFullYear(),
          11,
          31,
        )
        break

      case 'Last Year':
        start = new Date(
          today.getFullYear() - 1,
          0,
          1,
        )
        end = new Date(
          today.getFullYear() - 1,
          11,
          31,
        )
        break

      case 'Custom Range':
        setIsCustomRange(true)
        return

      default:
        return
    }

    setStartDate(formatDate(start))
    setEndDate(formatDate(end))

    if (range !== 'Custom Range') {
      const dateString = `${formatDate(start)} to ${formatDate(end)}`

      onChange(dateString)
      setShowDatePicker(false)
      setIsCustomRange(false)
    }
  }

  const applyDateRange = () => {
    if (startDate && endDate) {
      const dateString = `${startDate} to ${endDate}`
      onChange(dateString)
    }

    setShowDatePicker(false)
    setIsCustomRange(false)
  }

  const cancelDateRange = () => {
    setShowDatePicker(false)
    setSelectedRange('')
    setStartDate('')
    setEndDate('')
    setIsCustomRange(false)
  }

  const getDaysInMonth = (year, month) => {
    return new Date(
      year,
      month + 1,
      0,
    ).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(
      year,
      month,
      1,
    ).getDay()
  }

  const generateCalendar = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const daysInMonth = getDaysInMonth(
      year,
      month,
    )

    const firstDay = getFirstDayOfMonth(
      year,
      month,
    )

    const days = []

    const prevMonth =
      month === 0 ? 11 : month - 1

    const prevYear =
      month === 0 ? year - 1 : year

    const daysInPrevMonth =
      getDaysInMonth(
        prevYear,
        prevMonth,
      )

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: 'prev',
        date: new Date(
          prevYear,
          prevMonth,
          daysInPrevMonth - i,
        ),
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: 'current',
        date: new Date(
          year,
          month,
          i,
        ),
      })
    }

    const totalCells = 42

    const nextMonthValue =
      month === 11 ? 0 : month + 1

    const nextYear =
      month === 11 ? year + 1 : year

    for (
      let i = 1;
      days.length < totalCells;
      i++
    ) {
      days.push({
        day: i,
        month: 'next',
        date: new Date(
          nextYear,
          nextMonthValue,
          i,
        ),
      })
    }

    return days
  }

  const navigateMonth = (
    calendarType,
    direction,
  ) => {
    if (calendarType === 'current') {
      const newMonth = new Date(currentMonth)

      newMonth.setMonth(
        newMonth.getMonth() + direction,
      )

      setCurrentMonth(newMonth)

      const next = new Date(newMonth)

      next.setMonth(
        next.getMonth() + 1,
      )

      setNextMonth(next)
    } else {
      const newMonth = new Date(nextMonth)

      newMonth.setMonth(
        newMonth.getMonth() + direction,
      )

      setNextMonth(newMonth)

      const current = new Date(newMonth)

      current.setMonth(
        current.getMonth() - 1,
      )

      setCurrentMonth(current)
    }
  }

  const handleDateSelect = (
    date,
    calendarType,
  ) => {
    const formattedDate = formatDate(date)

    if (calendarType === 'start') {
      setStartDate(formattedDate)

      if (
        endDate &&
        date >
          new Date(
            endDate
              .split('-')
              .reverse()
              .join('-'),
          )
      ) {
        setEndDate(formattedDate)
      }
    } else {
      setEndDate(formattedDate)

      if (
        startDate &&
        date <
          new Date(
            startDate
              .split('-')
              .reverse()
              .join('-'),
          )
      ) {
        setStartDate(formattedDate)
      }
    }

    setIsCustomRange(true)
    setSelectedRange('Custom Range')
  }

  const formatDate = (date) => {
    const day = date
      .getDate()
      .toString()
      .padStart(2, '0')

    const month = (date.getMonth() + 1)
      .toString()
      .padStart(2, '0')

    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const isDateSelected = (
    date,
    type,
  ) => {
    const formattedDate = formatDate(date)

    if (type === 'start') {
      return formattedDate === startDate
    }

    return formattedDate === endDate
  }

  const handleTimeChange = (
    type,
    part,
    value,
  ) => {
    if (type === 'start') {
      const [hourMinute, ampm] =
        startTime.split(' ')

      let [hour, minute] =
        hourMinute.split(':')

      if (part === 'hour') hour = value
      if (part === 'minute') minute = value
      if (part === 'ampm') {
        setStartTime(
          `${hour}:${minute} ${value}`,
        )
        setIsCustomRange(true)
        setSelectedRange('Custom Range')
        return
      }

      setStartTime(
        `${hour}:${minute} ${ampm}`,
      )
    } else {
      const [hourMinute, ampm] =
        endTime.split(' ')

      let [hour, minute] =
        hourMinute.split(':')

      if (part === 'hour') hour = value
      if (part === 'minute') minute = value
      if (part === 'ampm') {
        setEndTime(
          `${hour}:${minute} ${value}`,
        )
        setIsCustomRange(true)
        setSelectedRange('Custom Range')
        return
      }

      setEndTime(
        `${hour}:${minute} ${ampm}`,
      )
    }

    setIsCustomRange(true)
    setSelectedRange('Custom Range')
  }

  const previewQuickRange = (range) => {
    const today = new Date()
    let start
    let end

    switch (range) {
      case 'Today':
        start = today
        end = today
        break

      case 'Yesterday':
        start = new Date(today)
        start.setDate(today.getDate() - 1)
        end = new Date(start)
        break

      case 'This Week':
        start = new Date(today)
        start.setDate(
          today.getDate() - today.getDay(),
        )
        end = new Date(today)
        end.setDate(
          today.getDate() +
            (6 - today.getDay()),
        )
        break

      case 'Last Week':
        start = new Date(today)
        start.setDate(
          today.getDate() -
            today.getDay() -
            7,
        )
        end = new Date(start)
        end.setDate(start.getDate() + 6)
        break

      case 'This Month':
        start = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        )
        end = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        )
        break

      case 'Last Month':
        start = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        )
        end = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
        )
        break

      case 'This Year':
        start = new Date(
          today.getFullYear(),
          0,
          1,
        )
        end = new Date(
          today.getFullYear(),
          11,
          31,
        )
        break

      case 'Last Year':
        start = new Date(
          today.getFullYear() - 1,
          0,
          1,
        )
        end = new Date(
          today.getFullYear() - 1,
          11,
          31,
        )
        break

      default:
        return
    }

    setStartDate(formatDate(start))
    setEndDate(formatDate(end))
  }

  const DatePickerModal = () => (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/40 p-4
      "
    >
      <div
        ref={datePickerRef}
        className="
          w-full max-w-5xl
          overflow-hidden
          rounded-lg
          bg-white
          shadow-2xl
        "
      >
        <div className="p-4">
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Quick Range */}
            <div className="w-full lg:w-48">
              <div className="flex flex-col gap-1.5">
                {[
                  'Today',
                  'Yesterday',
                  'This Week',
                  'Last Week',
                  'This Month',
                  'Last Month',
                  'This Year',
                  'Last Year',
                  'Custom Range',
                ].map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={`
                      rounded-md
                      px-3 py-2
                      text-left text-sm
                      transition-colors
                      ${
                        selectedRange === range
                          ? 'bg-[#2759A2] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onMouseEnter={() =>
                      previewQuickRange(range)
                    }
                    onClick={() =>
                      handleQuickRangeSelect(range)
                    }
                  >
                    {range}
                  </button>
                ))}
              </div>

              {(isCustomRange ||
                selectedRange ===
                  'Custom Range') && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={applyDateRange}
                    className="
                      rounded-md
                      bg-green-600
                      px-3 py-1.5
                      text-sm font-medium
                      text-white
                      hover:bg-green-700
                    "
                  >
                    Apply
                  </button>

                  <button
                    type="button"
                    onClick={cancelDateRange}
                    className="
                      rounded-md
                      bg-gray-500
                      px-3 py-1.5
                      text-sm font-medium
                      text-white
                      hover:bg-gray-600
                    "
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Calendars */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Start Calendar */}
                <Calendar
                  date={currentMonth}
                  selectedDate={startDate}
                  time={startTime}
                  onTimeChange={(part, value) =>
                    handleTimeChange(
                      'start',
                      part,
                      value,
                    )
                  }
                  onNavigate={(direction) =>
                    navigateMonth(
                      'current',
                      direction,
                    )
                  }
                  onDateSelect={(date) =>
                    handleDateSelect(
                      date,
                      'start',
                    )
                  }
                  isDateSelected={
                    isDateSelected
                  }
                  generateCalendar={
                    generateCalendar
                  }
                  dateType="start"
                />

                {/* End Calendar */}
                <Calendar
                  date={nextMonth}
                  selectedDate={endDate}
                  time={endTime}
                  onTimeChange={(part, value) =>
                    handleTimeChange(
                      'end',
                      part,
                      value,
                    )
                  }
                  onNavigate={(direction) =>
                    navigateMonth(
                      'next',
                      direction,
                    )
                  }
                  onDateSelect={(date) =>
                    handleDateSelect(
                      date,
                      'end',
                    )
                  }
                  isDateSelected={
                    isDateSelected
                  }
                  generateCalendar={
                    generateCalendar
                  }
                  dateType="end"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={`relative ${className}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly
        className="
          h-9 w-full
          rounded-md
          border border-gray-300
          bg-white
          px-3
          text-sm text-gray-700
          outline-none
          transition
          focus:border-[#2759A2]
          focus:ring-1
          focus:ring-[#2759A2]
        "
        onClick={openDatePicker}
        placeholder={placeholder}
      />

      {showDatePicker && <DatePickerModal />}
    </div>
  )
}

const Calendar = ({
  date,
  selectedDate,
  time,
  onTimeChange,
  onNavigate,
  onDateSelect,
  isDateSelected,
  generateCalendar,
  dateType,
}) => {
  return (
    <div className="min-w-0">
      {/* Date Input */}
      <div className="mb-3">
        <input
          type="text"
          value={
            selectedDate ||
            formatCalendarDate(new Date())
          }
          readOnly
          className="
            h-9 w-full
            rounded-md
            border border-gray-300
            px-3
            text-sm
            text-gray-700
            outline-none
          "
        />
      </div>

      {/* Time */}
      <div className="mb-4 flex items-center gap-1.5">
        <span className="text-base">⏰</span>

        <select
          value={time.split(':')[0]}
          onChange={(e) =>
            onTimeChange(
              'hour',
              e.target.value,
            )
          }
          className="
            h-8 rounded border
            border-gray-300
            px-1.5 text-sm
            outline-none
            focus:border-[#2759A2]
          "
        >
          {Array.from(
            { length: 12 },
            (_, i) => i + 1,
          ).map((hour) => (
            <option
              key={hour}
              value={hour}
            >
              {hour}
            </option>
          ))}
        </select>

        <span>:</span>

        <select
          value={
            time
              .split(':')[1]
              .split(' ')[0]
          }
          onChange={(e) =>
            onTimeChange(
              'minute',
              e.target.value,
            )
          }
          className="
            h-8 rounded border
            border-gray-300
            px-1.5 text-sm
            outline-none
            focus:border-[#2759A2]
          "
        >
          {Array.from(
            { length: 60 },
            (_, i) =>
              i
                .toString()
                .padStart(2, '0'),
          ).map((minute) => (
            <option
              key={minute}
              value={minute}
            >
              {minute}
            </option>
          ))}
        </select>

        <select
          value={time.split(' ')[1]}
          onChange={(e) =>
            onTimeChange(
              'ampm',
              e.target.value,
            )
          }
          className="
            h-8 rounded border
            border-gray-300
            px-1.5 text-sm
            outline-none
            focus:border-[#2759A2]
          "
        >
          {['AM', 'PM'].map(
            (ampm) => (
              <option
                key={ampm}
                value={ampm}
              >
                {ampm}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Calendar Header */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          className="
            flex h-7 w-7
            items-center justify-center
            rounded
            text-lg
            text-gray-600
            hover:bg-gray-100
          "
        >
          ‹
        </button>

        <span className="text-sm font-semibold text-gray-700">
          {date.toLocaleString(
            'default',
            {
              month: 'short',
              year: 'numeric',
            },
          )}
        </span>

        <button
          type="button"
          onClick={() => onNavigate(1)}
          className="
            flex h-7 w-7
            items-center justify-center
            rounded
            text-lg
            text-gray-600
            hover:bg-gray-100
          "
        >
          ›
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7">
        {[
          'Su',
          'Mo',
          'Tu',
          'We',
          'Th',
          'Fr',
          'Sa',
        ].map((day) => (
          <div
            key={day}
            className="
              py-1.5
              text-center
              text-xs
              font-semibold
              text-gray-500
            "
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendar(date).map(
          (dayObj, index) => (
            <button
              key={`${dateType}-${index}`}
              type="button"
              onClick={() =>
                onDateSelect(
                  dayObj.date,
                )
              }
              className={`
                flex
                h-8 w-8
                items-center
                justify-center
                rounded-full
                text-xs
                transition-colors
                ${
                  dayObj.month !==
                  'current'
                    ? 'text-gray-300'
                    : 'text-gray-700 hover:bg-gray-100'
                }
                ${
                  isDateSelected(
                    dayObj.date,
                    dateType,
                  )
                    ? 'bg-[#2759A2] font-semibold text-white hover:bg-[#2759A2]'
                    : ''
                }
              `}
            >
              {dayObj.day}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

const formatCalendarDate = (date) => {
  const day = date
    .getDate()
    .toString()
    .padStart(2, '0')

  const month = (date.getMonth() + 1)
    .toString()
    .padStart(2, '0')

  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
}

DatePicker.defaultProps = {
  value: '',
  placeholder: 'Select Date Range',
  className: '',
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.string,
  time: PropTypes.string.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onDateSelect: PropTypes.func.isRequired,
  isDateSelected: PropTypes.func.isRequired,
  generateCalendar: PropTypes.func.isRequired,
  dateType: PropTypes.oneOf([
    'start',
    'end',
  ]).isRequired,
}

export default DatePicker