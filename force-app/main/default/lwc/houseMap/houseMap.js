import { LightningElement, wire, api } from 'lwc';
import MCHS from '@salesforce/messageChannel/messageChannelHouseSelected__c';
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';

import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Property__c.Name'

export default class HouseMap extends LightningElement {
  houseId;
  subscription = null;
  error;

  name;
  
  @wire(getRecord, {recordId:'$houseId'})
  house;

  @api
  get recordId() {
    return this.houseId;
  }

  set recordId(houseId){
    this.houseId = houseId;
  }

  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        MCHS,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Handler for message received by component
  handleMessage(message) {
    this.houseId = message.channelHouseId;
  }

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }
}