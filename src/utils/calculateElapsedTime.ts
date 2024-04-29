export function calculateElapsedTime(isoString: string) {
  const currentDate = new Date()
  const inputDate = new Date(isoString)

  // Calculate elapsed years.
  const elapsedYears = currentDate.getFullYear() - inputDate.getFullYear()
  
  if (elapsedYears >= 1) {
    return `${elapsedYears}y`
  }
  
  // Calculate elapsed months.
  const elapsedMonths = currentDate.getMonth() - inputDate.getMonth()
  
  if (elapsedMonths >= 1) {
    return `${elapsedMonths}mo`
  }
  
  // Calculate elapsed days.
  const elapsedDays = currentDate.getDay() - inputDate.getDay()
  
  if (elapsedDays >= 1) {
    return `${elapsedDays}d`
  }
  
  // Calculate elapsed hours.
  const elapsedHours = currentDate.getHours() - inputDate.getHours()
  
  if (elapsedHours >= 1) {
    return `${elapsedHours}h`
  }
  
  // Calculate elapsed minutes.
  const elapsedMinutes = currentDate.getMinutes() - inputDate.getMinutes()
  
  if (elapsedMinutes >= 1) {
    return `${elapsedMinutes}m`
  }
  
  // If there were no elapsed time exceeding a minute, return 'Now.'
  return "Now"
}