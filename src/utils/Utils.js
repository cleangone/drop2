import { uid } from 'quasar'
import { format_MM_DD_YY } from './DateUtils'

export function isSwipeLeft(swipeInfo) {return swipeInfo.direction == "left" }
export function isSwipeRight(swipeInfo) {return swipeInfo.direction == "right" }

export function dollars(number) {
   return number ? "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
}

export function formatPhone(phone) {
   // phone in format: 1aaaxxxnnnn
   if (!phone || phone.length != 11) { return "" }
   return "(" + phone.substring(1, 4) + ") " + phone.substring(4, 7) + " - " + phone.substring(7)
}

export function formatTightPhone(phone) {
   // phone in format: 1aaaxxxnnnn
   if (!phone || phone.length != 11) { return "" }
   return phone.substring(1, 4) + "-" + phone.substring(4, 7) + "-" + phone.substring(7)
}

export function unformatPhone(phone) {
   // phone in format: "(aaa) xxx - nnnn"
   return "1" + phone.substring(1, 4) + phone.substring(6, 9) + phone.substring(12)
}

export function dateUid() {
   return format_MM_DD_YY(new Date().getTime()) + "-" +  uid()
}

export function shallowEquals(object1, object2) {
   const keys1 = Object.keys(object1);
   const keys2 = Object.keys(object2);
 
   if (keys1.length !== keys2.length) { return false }
 
   for (let key of keys1) {
     if (object1[key] !== object2[key]) { return false }
   }
 
   return true
}

export function getIds(objects) {
   const ids = []
   for (const obj of objects) { 
      ids.push(obj.id) 
   }
   return ids   
}

export function syncRows(row, rows) {
   for (var i=0; i<rows.length; i++) {
      if (rows[i].id == row.id ) { 
         rows.splice(i, 1)
         return
      }
   }
   
   rows.push(row)       
}
