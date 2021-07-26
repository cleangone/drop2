/*
   barcode
      id
      status
      barcode
      carrier
      service
      tracking
      createdDate
*/

export const ShipmentStatus = {
   CREATED: 'Created',
   ADDED_TO_INVOICE: 'Added to Invoice',
}

export const ShipmentCarrier = {
   USPS:  'USPS',
   FEDEX: 'FedEx',
   OTHER: 'Other',
}

export const ShipmentService = {
   USPS_PRIORITY: 'USPS Priority',
   USPS_INSURED:  'USPS Insured Domestic',
   FEDEX: 'FedEx',
}

/*

USPS Tracking	9400 1000 0000 0000 0000 00
Priority Mail	9205 5000 0000 0000 0000 00
Certified Mail	9407 3000 0000 0000 0000 00
Collect On Delivery Hold For Pickup	9303 3000 0000 0000 0000 00
Global Express Guaranteed	82 000 000 00
Priority Mail Express International	EC 000 000 000 US
Priority Mail Express	9270 1000 0000 0000 0000 00 
EA 000 000 000 US
Priority Mail International	CP 000 000 000 US
Registered Mail	9208 8000 0000 0000 0000 00
Signature Confirmation	9202 1000 0000 0000 0000 00

Priority Mail 2-Day: 42098116 9506 1118 0282 8089 2253 06, 
Insured Mail - Domestic: VJ788361252US
*/

export class ShipmentMgr {
   static getServices() { return [ ShipmentService.USPS_PRIORITY, ShipmentService.USPS_INSURED, ShipmentService.FEDEX ] }
   
   static createShipment(barcode, carrier) {
     const shipment = { 
         status: ShipmentStatus.CREATED,
         barcode: barcode,
         carrier: carrier,
      }

      ShipmentMgr.setTracking(shipment)
      return shipment
   }

   static setTracking(shipment) {
      shipment.service = null 
      shipment.tracking = null
      shipment.trackingLink = null

      if (shipment.carrier == ShipmentCarrier.USPS) {
         shipment.tracking = shipment.barcode.length < 22 ?  shipment.barcode : shipment.barcode.substring(barcode.length - 22)
         console.log("shipment.tracking", shipment.tracking)

         shipment.service = null 
         shipment.trackingLink = null
         if (shipment.tracking) {
            if (startsWith(shipment.tracking, ["9205", "9506"])) { 
               shipment.service = ShipmentService.USPS_PRIORITY 
               shipment.trackingLink = 
                  "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + shipment.tracking 
            }
            if (startsWith(shipment.tracking, ["VJ"]) && shipment.tracking.endsWith("US") ) { 
               shipment.service = ShipmentService.USPS_INSURED 
            }
         }
      }
   }
}

function startsWith(str, prefixes) { 
   for (var prefix of prefixes) {
      if (str.startsWith(prefix)) { return true }
   }
   return false 
}


