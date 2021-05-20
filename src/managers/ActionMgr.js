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
   BID:          'Bid',
   PURCHASE_REQ: 'Purchase Request',
   ACCEPT_REQ:   'Accept Purchase Request',
}

export const ActionResultType = {
   LATE_BID:     'Late Bid',
   HIGH_BID:     'High Bid',
   INCREASED:    'Increased',
   OUTBID:       'Outbid',
   PURCHASED:    'Purchased',
   ALREADY_SOLD: 'Already Sold',
   WINNING_BID:  'Winning Bid',
}

export class ActionMgr {
   static initBid(action) { ActionMgr.init(action, ActionType.BID) }
   static initPurchaseReq(action) { ActionMgr.init(action, ActionType.PURCHASE_REQ) }
   static initAcceptReq(action) { ActionMgr.init(action, ActionType.ACCEPT_REQ) }
   static init(action, actionType) { 
      action.id = dateUid()
      action.actionType = actionType
      action.createdDate = Date.now()
      action.status = ActionStatus.CREATED
   }

   static isBid(action)        { return action.actionType == ActionType.BID }
   static isPurchased(action)  { return action.actionResult == ActionResultType.PURCHASED }
   static isWinningBid(action) { return action.actionResult == ActionResultType.WINNING_BID }   
}
