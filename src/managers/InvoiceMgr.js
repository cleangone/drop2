import { UserMgr } from './UserMgr'   
import { format_M_DD_YY, format_MMM_D_YYYY, toMillis } from 'src/utils/DateUtils'
import { dollars } from 'src/utils/Utils'
      
/*
   invoice
      id
      name
      items[ { id, name, buyDate, buyPrice }]
      userId
      userFullName
      status: InvoiceStatus
      sendStatus: InvoiceSendStatus
      sentDate
      history [ { status, date }]
      html
      subTotal
      shippingCharge
      priceAdjustment
      total
      createdDate
      paidDate
      shippedDate
      updatedDate
*/

export const InvoiceStatus = {
   CREATED:     'Created',
   SENT:        'Sent',
   REVISED:     'Revised',
   RESENT:      'Resent',
   PAID:        'Paid in Full',
   PARTIAL_PAY: 'Partial Payment',
   SHIPPED:     'Shipped',
}

export const InvoiceSendStatus = {
   SENDING: 'Sending',
   SENT:    'Sent',
   ERROR:   'Send Error'
}

const InvoiceCarrier = {
   USPS_PRIORITY: 'USPS Priority',
   FEDEX:         'FedEx',
}

export class InvoiceMgr {
   
   static isCreated(invoice)  { return invoice.status == InvoiceStatus.CREATED }
   static isRevised(invoice)  { return invoice.status == InvoiceStatus.REVISED }
   static isPaid(invoice)     { return invoice.status == InvoiceStatus.PAID }
   static isShipped(invoice)  { return invoice.status == InvoiceStatus.SHIPPED }
   static isSending(invoice)  { return invoice.sendStatus == InvoiceSendStatus.SENDING }
   static isSent(invoice)     { return invoice.sendStatus == InvoiceSendStatus.SENT }
   static isSendError(invoice){ return invoice.sendStatus == InvoiceSendStatus.ERROR }
   
   static getCarriers() { return [ InvoiceCarrier.USPS_PRIORITY, InvoiceCarrier.FEDEX ] }
   static isUspsPriority(invoice) { return invoice.carrier == InvoiceCarrier.USPS_PRIORITY }
   
   // todo - tracking has a lot of hardcoding
   static hasTrackingLink(invoice) { 
      return (invoice.tracking && invoice.tracking.length > 5 && InvoiceMgr.isUspsPriority(invoice)) 
   }
   static getTrackingLink(invoice) {  
      if (InvoiceMgr.hasTrackingLink(invoice)) { 
         return "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + invoice.tracking 
      }
      return ""
   }     
   
   static hasTracking(invoice) { return invoice.carrier || invoice.tracking }
   
   static needToResend(invoice) {
      return invoice.sentDate && 
         ((invoice.revisedDate && (toMillis(invoice.sentDate) < toMillis(invoice.revisedDate))) ||
          (invoice.paidDate    && (toMillis(invoice.sentDate) < toMillis(invoice.paidDate)))    ||
          (invoice.shippedDate && (toMillis(invoice.sentDate) < toMillis(invoice.shippedDate))))
   }

   static getDetails(invoice) { 
      let details = []
      for (var item of invoice.items) {
         details.push({ name: item.name, price: dollars(item.buyPrice) })
      }

      details.push({ name: "Shipping", price: dollars(invoice.shippingCharge) })
      if (invoice.priceAdjustment) { details.push({ name: "Adjustment", price: "(" + dollars(invoice.priceAdjustment) + ")" }) }

      return details 
   }
          
   static finalize(invoice, user, setting) { 
      invoice.name = (invoice.revisedDate ? "Revised " : "") + "Invoice: " + invoice.items[0].name
      if (invoice.items.length == 2) { invoice.name += ", one other"} 
      else if (invoice.items.length > 2) { invoice.name += ", others"} 
         
      invoice.total = invoice.subTotal + invoice.shippingCharge - invoice.priceAdjustment 
      InvoiceMgr.setUserFullName(invoice, user)
      InvoiceMgr.setHtml(invoice, user, setting)   
   }
   
   static setUserFullName(invoice, user) { invoice.userFullName = UserMgr.fullName(user) }
   
   static getUserHtml(invoice, user) { 
      // console.log("getUserHtml: user", user)
      let html = []      
      html.push(
         div(invoice.userFullName) +
         div(UserMgr.getEmail(user))  +
         div(user.address ? user.address : "ADDRESS" )  +
         div((user.city ? user.city : "CITY") + ", " + (user.state ? user.state : "STATE")) +
         div(user.zip ? user.zip : "ZIP" ) +
         (user.country ? div(user.country) : "" )
      )

      return html.join("")
   }

   static setHtml(invoice, user, setting) { 
      // console.log("setHtml: user", user)
      // console.log("setHtml: setting", setting)
      let html = []
      
      let date = invoice.revisedDate ? 
         format_MMM_D_YYYY(invoice.revisedDate)  + " (Revised)":
         format_MMM_D_YYYY(invoice.createdDate)
      
      let paypal = "" 
      if (setting.paypal) {
         let paypalLink = setting.paypal 
         if (paypalLink.toLowerCase().startsWith("https://")) { paypalLink = paypalLink.substring(0, 8) }
         if (paypalLink.toLowerCase().startsWith("http://"))  { paypalLink = paypalLink.substring(0, 7) }

         paypal = a(paypalLink, "https://" + paypalLink)
      }
      
      html.push(
         div(date) + 
         div(a(setting.companyName, setting.siteUrl), right()) + 
         div(paypal, right()) +
         br() + br() + 
         InvoiceMgr.getUserHtml(invoice, user) + 
         br())
      
      let detailRows = []
      for (var item of invoice.items) {
         detailRows.push(tr(
            td(format_M_DD_YY(item.buyDate), "width=10%") + 
            td(item.name) + 
            tdRight(dollars(item.buyPrice))))
      }

      const line = tr(td(hr(), "colspan=3"))
      const subtotal = tr(td("") + td("SubTotal") + tdRight(dollars(invoice.subTotal)))
      const shipping = tr(td("") + td("Shipping") + tdRight(dollars(invoice.shippingCharge)))
      const adjustment = invoice.priceAdjustment == 0 ? "" : tr(td("") + td("Adjustment") +  tdRight("(" + dollars(invoice.priceAdjustment) + ")"))
      const total = tr(td("") + td(b("Total")) + tdRight(b(dollars(invoice.total))))
      let paidLine = invoice.paidDate ? line : ""
      let amountPaid = invoice.paidDate ? tr(td("") + td("Amount Paid") + tdRight(dollars(invoice.total))) : ""
      let amountRemaing = invoice.paidDate ? tr(td("") + td(b("Amount Remaining")) + tdRight(b('0'))) : ""
      
      let itemsTable = table(
         detailRows.join("") + line + subtotal + shipping + adjustment + line + total + paidLine + amountPaid + amountRemaing, 
         "width=100% style='border:1px solid'")
      html.push(itemsTable)

      let note = setting.invoiceNote
      if (InvoiceMgr.isPaid(invoice)) { note = "" }
      else if (InvoiceMgr.isShipped(invoice)) {
         note = "Items shipped. "
         if (InvoiceMgr.hasTrackingLink(invoice)) { 
            note += a(invoice.carrier + " - " + invoice.tracking, InvoiceMgr.getTrackingLink(invoice)) 
         }
         else if (invoice.tracking) { note += invoice.carrier + ", Tracking: " + invoice.tracking}
      }
      html.push(br() + p(note))

      invoice.html = html.join("")
   }

   static setUpdated(invoice) { invoice.status = InvoiceStatus.UPDATED }
}

function right()                   { return "align=right" }

function a(innerHtml, href)        { return ele(innerHtml, "a", "href=" + href) }
function b(innerHtml)              { return ele(innerHtml, "b") }
function br()                      { return closedEle("br") }
function div(innerHtml, attr)      { return ele(innerHtml, "div", attr) }
function p(innerHtml)              { return ele(innerHtml, "p") }
function h4(innerHtml)             { return ele(innerHtml, "h4") }
function hr()                      { return closedEle("hr") }
// function span(innerHtml, attr)     { return ele(innerHtml, "span", attr) }
function table(innerHtml, attr)    { return ele(innerHtml, "table", attr) }
function tr(innerHtml)             { return ele(innerHtml, "tr") }
function td(innerHtml, attr)       { return ele(innerHtml, "td", attr) }
function tdRight(innerHtml)        { return td(innerHtml, right()) }

function ele(innerHtml, tag, attr) { return openTagPrefix(tag, attr) + ">" + innerHtml + "</" + tag +">" }
function closedEle(tag, attr)      { return openTagPrefix(tag, attr) + "/>" }
function openTagPrefix(tag, attr)  { return "<" + tag + (attr ? " " + attr : "") }


