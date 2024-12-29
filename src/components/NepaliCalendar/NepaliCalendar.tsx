import { useState } from 'react'
import NepaliDate from 'nepali-datetime'

import YearSelector from '../core/YearSelector'
import MonthSelector from '../core/MonthSelector'
import { MAX_NEPALI_YEAR, MIN_NEPALI_YEAR, WEEK_DAYS_SHORT_EN } from '../../constants'
import { getCalendarTableArray, ICalendarDate } from '../../utils/calendar'
import classNames from '../../utils/classNames'

import styles from './NepaliCalendar.module.scss'

export interface INepaliCalendarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedNepaliDate?: NepaliDate | null
  onDateSelect?: ((nepaliDate: NepaliDate) => void) | null
}

const NepaliCalendar: React.FC<INepaliCalendarProps> = ({
  selectedNepaliDate,
  onDateSelect = null,
}) => {
  const now = new NepaliDate()

  const [selectedYear, setSelectedYear] = useState(
    selectedNepaliDate?.getYear() ?? now.getYear()
  )
  const [selectedMonth, setSelectedMonth] = useState(
    selectedNepaliDate?.getMonth() ?? now.getMonth()
  )

  const isCurrentDate = (calendarDate: ICalendarDate) =>
    calendarDate.year === now.getYear() &&
    calendarDate.month0 === now.getMonth() &&
    calendarDate.date === now.getDate()

  const isSelectedDate = (calendarDate: ICalendarDate) =>
    selectedNepaliDate &&
    calendarDate.year === selectedNepaliDate.getYear() &&
    calendarDate.month0 === selectedNepaliDate.getMonth() &&
    calendarDate.date === selectedNepaliDate.getDate()

  const handleDateSelect = (calendarDate: ICalendarDate) => {
    if (!calendarDate.active || !calendarDate.date || !onDateSelect) {
      return
    }

    onDateSelect(new NepaliDate(selectedYear, selectedMonth, calendarDate.date))
  }

  const setPrevMonth = () => {
    if (selectedYear === MIN_NEPALI_YEAR && selectedMonth === 0) {
      return
    }

    const [prevMonthYear, prevMonth0] =
      selectedMonth === 0 ? [selectedYear - 1, 11] : [selectedYear, selectedMonth - 1]
    setSelectedYear(prevMonthYear)
    setSelectedMonth(prevMonth0)
  }

  const setNextMonth = () => {
    if (selectedYear === MAX_NEPALI_YEAR && selectedMonth === 11) {
      return
    }

    const [prevMonthYear, prevMonth0] =
      selectedMonth === 11 ? [selectedYear + 1, 0] : [selectedYear, selectedMonth + 1]
    setSelectedYear(prevMonthYear)
    setSelectedMonth(prevMonth0)
  }

  const calendarArray = getCalendarTableArray(selectedYear, selectedMonth)

  return (
    <div className="ndt-calendar">
      <div className={`ndt-calendar-controls ${styles.calendarControls}`}>
        <div className={`ndt-prev ${styles.prevNext}`}>
          <button
            onClick={setPrevMonth}
            type="button"
            tabIndex={-1}
            aria-label="prev-month"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                fillRule="evenodd"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                d="M16.283 18.907L9.6 12l6.683-5.438"
              ></path>
            </svg>
          </button>
        </div>
        <div className={`ndt-year-month-select ${styles.yerMonthContainer}`}>
          <YearSelector
            selectedYear={selectedYear}
            onChange={newYear => setSelectedYear(newYear)}
          />
          <MonthSelector
            selectedMonth={selectedMonth}
            onChange={newMonth => setSelectedMonth(newMonth)}
          />
        </div>
        <div className={`ndt-next ${styles.prevNext}`}>
          <button
            onClick={setNextMonth}
            type="button"
            tabIndex={-1}
            aria-label="next-onth"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                transform="rotate(180 12 12)"
                fill="none"
                fillRule="evenodd"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                d="M16.283 18.907L9.6 12l6.683-5.438"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className={`ndt-calendar-container ${styles.calendarContainer}`}>
        <div className={`ndt-calendar-grid ${styles.calendarGrid}`}>
          {WEEK_DAYS_SHORT_EN.map(weekShortEn => (
            <div
              key={weekShortEn}
              className={classNames('ndt-calendar-header', styles.calendarCell)}
            >
              {weekShortEn}
            </div>
          ))}
        </div>
        <div className={`ndt-calendar-grid ${styles.calendarGrid}`}>
          {calendarArray.map(calendarDate => (
            <div
              onClick={() => handleDateSelect(calendarDate)}
              key={calendarDate.index}
              className={classNames(
                'ndt-calendar-cell',
                styles.calendarCell,
                isSelectedDate(calendarDate) &&
                  classNames('ndt-calendar-cell-selected', styles.calendarCellSelected),
                isCurrentDate(calendarDate) &&
                  classNames('ndt-calendar-cell-current', styles.calendarCellCurrent),
                !calendarDate.active && styles.calendarCellInactive
              )}
            >
              {calendarDate.date}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NepaliCalendar
