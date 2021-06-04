/*
   settings:
      id (unused)
      companyName
      siteUrl
      fromEmail
      paypal
      twitterId
      purchaseReqProcessingType
      bidPeriod
      bidAdditionalTime
      initialBidPeriod
      initialBidAdditionalTime
      invoiceNote
      emailPurchaseSuccessSubject, emailPurchaseSuccessBody
      emailPurchaseFailSubject, emailPurchaseFailBody
      emailWinningBidSubject, emailWinningBidBody
*/

export const PurchaseReqProcessingType = {
   AUTOMATIC: 'Automatic',
   MANUAL:    'Manual',
}

export const EmailFieldSuffix = {
   SUBJECT: 'Subject',
   BODY: 'Body',
}

export class SettingsMgr {  
   static isAutoPurchaseReqProcessing(settings)           { return settings.purchaseReqProcessingType == PurchaseReqProcessingType.AUTOMATIC }   
   static getPurchaseSuccessEmailSetting(settings, label) { return this.getEmailSetting(settings, 'emailPurchaseSuccess', label) }
   static getPurchaseFailEmailSetting(settings, label)    { return this.getEmailSetting(settings, 'emailPurchaseFail', label) }
   static getWinningBidEmailSetting(settings, label)      { return this.getEmailSetting(settings, 'emailWinningBid', label) } 
   static getInvoiceEmailSetting(settings, label)         { return this.getEmailSetting(settings, 'emailInvoice', label) } 

   static getEmailSetting(settings, emailType, label) { 
      return { 
         emailType: emailType,
         subject:   settings[emailType + EmailFieldSuffix.SUBJECT], 
         body:      settings[emailType + EmailFieldSuffix.BODY], 
         label:     label 
      }
   }

   static setEmailSettings(settings, emailSetting) { 
      settings[emailSetting.emailType + EmailFieldSuffix.SUBJECT] = emailSetting.subject
      settings[emailSetting.emailType + EmailFieldSuffix.BODY] = emailSetting.body
   }
}
