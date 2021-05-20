import { dateUid } from 'src/utils/Utils'

/*
   smsOutbound:
      id
      status
      userId
      userPhone
      text
      createdDate
*/

export const SmsStatus = {
   CREATED:   'Created',
   PROCESSED: 'Processed',
}

export class SmsMgr {
   static createOutboundSms(text, user) { 
      return {
         id: dateUid(),
         status: SmsStatus.CREATED,
         userId: user.id,
         userPhone: user.phone,
         text: text,
         createdDate: Date.now()
      }
   }
}
