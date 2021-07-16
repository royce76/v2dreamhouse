import { LightningElement, wire } from 'lwc';
import getPropertyV2List from '@salesforce/apex/PropertyV2Controller.getPropertyV2List';
import MCHS from '@salesforce/messageChannel/messageChannelHouseSelected__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class ListHouseTiles extends LightningElement {
  /**
   * getPropertyV2List is an apex simple method to get all houses
   */
  @wire(getPropertyV2List)
  houses;

  @wire(MessageContext)
  messageContext;

  houseSelectedId = '';

  /**
   * Provides the house Id selected to be published in a message
   * in MCHS message channel service called messageChannelHouseSelected__c
   * @param {string} event 
   */
  handleHouseSelected(event) {
    this.houseSelectedId = event.detail.houseSelectedId;
    const message = { channelHouseId : event.detail.houseSelectedId}
    publish(this.messageContext, MCHS, message);   
  }
}