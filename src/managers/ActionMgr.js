import { dateUid } from 'src/utils/Utils'

/*
   action:
      id
      status
      actionType
      actionResult
      itemId
      itemName
      userId
      refActionId
      amount
      createdDate
      processedDate    
*/

export const ActionStatus = {
   CREATED:   'Created',
   PROCESSED: 'Processed',
}

export const ActionType = {
   BID:           'Bid',
   PURCHASE_REQ:  'Purchase Request',
   ACCEPT_REQ:    'Accept Purchase Request',
   INVOICE_PAY:   'Invoice Payment',
   VERIFY_EMAIL:  'Verify Email',
   CONFIRM_EMAIL: 'Confirm Email Verification',
}

// result type 
export const ActionResultType = {
   OUTBID:       'Outbid',
   PURCHASED:    'Purchased',
   WINNING_BID:  'Winning Bid', 
   // following only needed by backend
   // LATE_BID:     'Late Bid', 
   // HIGH_BID:     'High Bid', 
   // INCREASED:    'Increased', 
   // ALREADY_SOLD: 'Already Sold', 
   // PAID:         'Paid in Full',  
   // PARTIAL_PAID: 'Partially Paid',
}

export class ActionMgr {
   static initPurchaseReq(action) { ActionMgr.init(action, ActionType.PURCHASE_REQ) }
   static initAcceptReq(action) { ActionMgr.init(action, ActionType.ACCEPT_REQ) }
   static init(action, actionType) { 
      action.id = dateUid()
      action.actionType = actionType
      action.createdDate = Date.now()
      action.status = ActionStatus.CREATED

      return action
   }

   static isBid(action)        { return action.actionType == ActionType.BID }
   static isPurchased(action)  { return action.actionResult == ActionResultType.PURCHASED }
   static isWinningBid(action) { return action.actionResult == ActionResultType.WINNING_BID }   
}
