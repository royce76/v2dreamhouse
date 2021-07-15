import { LightningElement, wire, api } from 'lwc';
import MCHS from '@salesforce/messageChannel/messageChannelHouseSelected__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

import BEDS_FIELD from '@salesforce/schema/Property__c.Beds__c';
import BATHS_FIELD from '@salesforce/schema/Property__c.Baths__c';
import PRICE_FIELD from '@salesforce/schema/Property__c.Price__c';
import BROKER_FIELD from '@salesforce/schema/Property__c.Broker__r.Name';

const fields = [
  BEDS_FIELD,
  BATHS_FIELD,
  PRICE_FIELD,
  BROKER_FIELD
];

export default class DetailHouse extends LightningElement {
  subscription = null;

  houseId;

  @api
  get recordId() {
    return this.houseId;
  }

  set recordId(houseId) {
    this.houseId = houseId;
  }

  @wire(getRecord, {recordId: '$houseId', fields})
  house;

 get houseBeds() {
   return getFieldValue(this.house.data, BEDS_FIELD)
 }

  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    if(!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        MCHS,
        (message)=>this.handleMessage(message),
        { scope : APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
  }

  handleMessage(message) {
    this.houseId = message.channelHouseId;
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

}