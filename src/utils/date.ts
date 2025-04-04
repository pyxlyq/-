import dayjs from 'dayjs'

export const formatDate = (date: Date | string, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: Date | string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export const getDateRange = (days = 7) => {
  const end = dayjs()
  const start = end.subtract(days, 'day')
  return {
    start: start.toDate(),
    end: end.toDate()
  }
}

export const isToday = (date: Date | string) => {
  return dayjs(date).isSame(dayjs(), 'day')
}

export const isThisWeek = (date: Date | string) => {
  return dayjs(date).isSame(dayjs(), 'week')
}

export const isThisMonth = (date: Date | string) => {
  return dayjs(date).isSame(dayjs(), 'month')
} 