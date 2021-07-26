import { date } from 'quasar'

//
// dates are generally timstamp when created by frontend, and millis when created by backend functions
// easier to handle both ways than to always be standarizing
//

export function formatTodayOr_ddd_MMM_D_h_mm(inputDate) { 
   if (!inputDate) { return "" }
   const datetime = getDate(inputDate)
   return isToday(datetime) ? "Today, " + formatWithTz(datetime, "h:mm a") : formatWithTz(datetime, "ddd, MMM D, h:mm a")
}

export function formatDateTimeOptYear(inputDate) {
   if (!inputDate) { return "" }
   let datetime = getDate(inputDate)
   return date.formatDate(datetime, optYearFormat(datetime))
}

// h:mm:ss if today, date/time to min with optional year otherwise
export function formatDateTimeScalingPrecision(inputDate) {
   if (!inputDate) { return "" }
   let datetime = getDate(inputDate)
   let format = isToday(datetime) ? 'h:mm:ss a' : optYearFormat(datetime)
   return date.formatDate(datetime, format)
}

export function formatDateTimeOptYearTz(inputDate) {
   if (!inputDate) { return "" }
   let datetime = getDate(inputDate)
   return formatWithTz(datetime, optYearFormat(datetime))
}

export function formatDateOptYear(inputDate) {
   const millis = toMillis(inputDate)
   if (!millis) { return "" }
   let datetime = new Date(millis)
   return date.formatDate(datetime, isThisYear(datetime) ? 'MMM D' : 'MMM D, YYYY')
}

export function format_M_DD_YY(inputDate)    { return format(toMillis(inputDate), 'M/D/YY') }
export function format_MM_DD_YY(inputDate)   { return format(toMillis(inputDate), 'MM-DD-YY') }
export function format_MMM_D(inputDate)      { return format(toMillis(inputDate), 'MMM D') }
export function format_MMM_D_YYYY(inputDate) { return format(toMillis(inputDate), 'MMM D, YYYY') }
export function format_MMM_DD_optYYYY_h_mm_ss(inputDate) { 
   return formatOptYear(toMillis(inputDate), 'MMM D, h:mm:ss a', 'MMM D, YYYY h:mm:ss a') }

export function toMillis(inputDate) {
   if (!inputDate) { return inputDate }
   return inputDate.seconds ? inputDate.seconds*1000 : inputDate
}

export function isToday(datetime) { return (date.formatDate(new Date(), 'MM-DD-YYYY') == date.formatDate(datetime, 'MM-DD-YYYY')) }   
export function isFutureDate(timestamp) { return timestamp ? (timestamp.seconds*1000 > new Date().getTime()) : false }

export function localTimezone() {
   let dateString = new Date(Date.now()).toString()
   let timezone = dateString.slice(dateString.indexOf("("), dateString.indexOf(")") + 1)
   if (timezone == "(Eastern Daylight Time)") { timezone = "(EDT)" }
   else if (timezone == "(Pacific Daylight Time)") { timezone = "(PDT)" }
   return timezone
}

function optYearFormat(datetime) { return isThisYear(datetime) ? 'MMM D, h:mm a' : 'MMM D, YYYY h:mm a' }
function formatOptYear(millis, format, yearFormat) {
   if (!millis) { return "" }

   const now = new Date()
   const datetime = new Date(millis)
   return now.getYear() == datetime.getYear() ? date.formatDate(datetime, format) : date.formatDate(datetime, yearFormat)
}

function getDate(inputDate) { return new Date(toMillis(inputDate)) }
function isThisYear(datetime) { return new Date().getYear() == datetime.getYear() }
function formatWithTz(datetime, format) { return date.formatDate(datetime, format) + " " + localTimezone() }
function format(millis, format) {return millis ? date.formatDate(new Date(millis), format) : "" }

