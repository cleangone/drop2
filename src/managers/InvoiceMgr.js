import { UserMgr } from './UserMgr'   
import { format_M_DD_YY, format_MMM_D_YYYY, toMillis } from 'src/utils/DateUtils'
import { dollars } from 'src/utils/Utils'
      
/*
   invoice
      id
      name
      items[ { id, name, buyDate, buyPrice }]
      userId
      user { 
         email
         fullName
         address { city, state, zip, country }
      status: InvoiceStatus
      sendStatus: InvoiceSendStatus
      sentDate
      history [ { status, date }]
      html
      subTotal
      shipping { shippingCharge, carrier, tracking, trackingLink }
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

export const InvoiceCarrier = {
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
   static isUspsPriority(invoice) { return invoice.shipping.carrier == InvoiceCarrier.USPS_PRIORITY }
   
   static setUpdated(invoice) { invoice.status = InvoiceStatus.UPDATED }

   // todo - tracking has a lot of hardcoding
   static hasTracking(invoice) { return invoice.shipping.service && invoice.shipping.tracking }
   static hasTrackingLink(invoice) { return invoice.shipping.trackingLink != null }
   static getTrackingLink(invoice) { return invoice.shipping.trackingLink }
   
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

      details.push({ name: "Shipping", price: dollars(invoice.shipping.shippingCharge) })
      if (invoice.priceAdjustment) { details.push({ name: "Adjustment", price: "(" + dollars(invoice.priceAdjustment) + ")" }) }

      return details 
   }
          
   static finalize(invoice, user) { 
      invoice.name = (invoice.revisedDate ? "Revised " : "") + "Invoice: " + invoice.items[0].name
      if (invoice.items.length == 2) { invoice.name += ", one other"} 
      else if (invoice.items.length > 2) { invoice.name += ", others"} 
         
      invoice.total = invoice.subTotal + invoice.shipping.shippingCharge - invoice.priceAdjustment 
     
      if (!invoice.user) { invoice.user = {} }
      invoice.user.fullName = UserMgr.fullName(user) 
      invoice.user.email = UserMgr.getEmail(user)
 
      if (!invoice.user.address) { invoice.user.address = {} }
      invoice.user.address.usePayPalAddress = user.usePayPalAddress
      if (user.address) { invoice.user.address.address = user.address }
      if (user.city)    { invoice.user.address.city = user.city }
      if (user.state)   { invoice.user.address.state = user.state }
      if (user.zip)     { invoice.user.address.zip = user.zip }
      if (user.country) { invoice.user.address.country = user.country }

      // if (invoice.shipping.tracking && InvoiceMgr.isUspsPriority(invoice)) {
      //    invoice.shipping.trackingLink = 
      //       "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + invoice.shipping.tracking 
      // }
      // else { invoice.shipping.trackingLink = null }
   }

   static getUserHtml(invoice) { 
      // console.log("getUserHtml", invoice)
      const address = invoice.user.address

      const addressHtml = address.usePayPalAddress ? "" : 
         (address.address ? div(address.address) : "" ) + 
         (address.city || address.state ? 
            div((address.city ? address.city : "") + 
                (address.city && address.state ? ", " : "") + 
                (address.state ? address.state : "")
            ) : 
            "" ) + 
         (address.zip ? div(address.zip) : "" ) + 
         (address.country ? div(address.country) : "" )
   
      return div(invoice.user.fullName) +
         div(invoice.user.email)  +
         addressHtml
   }

   static getPaypalUserHtml(invoice) { 
      if (!invoice.shipping.paypal || !invoice.shipping.paypal.address) { return null }
      
      const fullName = invoice.shipping.paypal.name && invoice.shipping.paypal.name.full_name ?
         invoice.shipping.paypal.name.full_name : null
      const address = invoice.shipping.paypal.address
      const paypalUserRow = tr(td(
         b("PayPal Shipping Address")  +
         (fullName ? div(fullName) : "") + 
         div(address.address_line_1)  +
         div(address.admin_area_2 + ", " + address.admin_area_1) +
         div(address.postal_code) + 
         (address.country_code == "US" ? "" : div(address.country_code)))) 

      return table(paypalUserRow, "style='border:1px solid; padding:5px'")
   }
    
   static getHtml(invoice, settings) { 
      let date = invoice.revisedDate ? 
         format_MMM_D_YYYY(invoice.revisedDate)  + " (Revised)":
         format_MMM_D_YYYY(invoice.createdDate)
   
      const htmlSections = {
         date: div(date),
         company: div(a(settings.companyName, settings.siteUrl), right()), 
         user: InvoiceMgr.getUserHtml(invoice),
         paypalUser: InvoiceMgr.getPaypalUserHtml(invoice)    
      }

      const itemRows = []
      for (var item of invoice.items) {
         itemRows.push(tr(
            td(format_M_DD_YY(item.buyDate), "width=10%") + 
            td(item.name) + 
            tdRight(dollars(item.buyPrice))))
      }
      htmlSections.items = itemRows.join("")

      const line = tr(td(hr(), "colspan=3"))
      const subtotal = tr(td("") + td("SubTotal") + tdRight(dollars(invoice.subTotal)))
      const shipping = tr(td("") + td("Shipping") + tdRight(dollars(invoice.shipping.shippingCharge)))
      const adjustment = invoice.priceAdjustment == 0 ? "" : tr(td("") + td("Adjustment") +  tdRight("(" + dollars(invoice.priceAdjustment) + ")"))
      const total = tr(td("") + td(b("Total")) + tdRight(b(dollars(invoice.total))))
      htmlSections.total = line + subtotal + shipping + adjustment + line + total 
      
      const paidLine = invoice.paidDate ? line : ""
      const amountPaid = invoice.paidDate ? tr(td("") + td("Amount Paid") + tdRight(dollars(invoice.amountPaid))) : ""
      const amountRemaing = invoice.paidDate ? tr(td("") + td(b("Amount Remaining")) + tdRight(b('0'))) : ""
      htmlSections.paid = paidLine + amountPaid + amountRemaing
      
      let note = settings.invoiceNote
      if (InvoiceMgr.isPaid(invoice)) { note = "" }
      else if (InvoiceMgr.isShipped(invoice)) { note = "Items shipped. " + InvoiceMgr.getTrackingLinkHtml(invoice) }
      htmlSections.note = p(note)

      return htmlSections.date + 
         htmlSections.company + br() + br() + 
         htmlSections.user + 
         (htmlSections.paypalUser ? htmlSections.paypalUser : "") + 
         br() + 
         table(htmlSections.items + htmlSections.total + htmlSections.paid, 
            "width=100% style='border:1px solid'") +
         br() + 
         htmlSections.note
   }

   static getTrackingHtml(invoice, settings) { 
      const itemNames = []
      for (var item of invoice.items) {
         itemNames.push(item.name)
      }
      
      return itemNames.join("br()")  + hr() + p(InvoiceMgr.getTrackingLinkHtml(invoice))
   }

   static getTrackingLinkHtml(invoice) { 
      console.log("invoice.shipping.trackingLink", invoice.shipping.trackingLink)
      if (invoice.shipping.trackingLink) { 
         return a(invoice.shipping.carrier + " - " + invoice.shipping.tracking, invoice.shipping.trackingLink)
      }

      let tracking = invoice.shipping.carrier ? invoice.shipping.carrier : ""
      if (invoice.shipping.carrier && invoice.shipping.tracking) { tracking += ", " }
      if (invoice.shipping.tracking) { tracking += "Tracking: " + invoice.shipping.tracking }   
      return tracking
   }
}

function right()                   { return "align=right" }
function a(innerHtml, href)        { return ele(innerHtml, "a", "href=" + href) }
function b(innerHtml)              { return ele(innerHtml, "b") }
function br()                      { return closedEle("br") }
function div(innerHtml, attr)      { return ele(innerHtml, "div", attr) }
function p(innerHtml)              { return ele(innerHtml, "p") }
function hr()                      { return closedEle("hr") }
function table(innerHtml, attr)    { return ele(innerHtml, "table", attr) }
function tr(innerHtml)             { return ele(innerHtml, "tr") }
function td(innerHtml, attr)       { return ele(innerHtml, "td", attr) }
function tdRight(innerHtml)        { return td(innerHtml, right()) }

function ele(innerHtml, tag, attr) { return openTagPrefix(tag, attr) + ">" + innerHtml + "</" + tag +">" }
function closedEle(tag, attr)      { return openTagPrefix(tag, attr) + "/>" }
function openTagPrefix(tag, attr)  { return "<" + tag + (attr ? " " + attr : "") }


