import { LightningElement, wire } from 'lwc';
import getPropertyV2List from '@salesforce/apex/PropertyV2Controller.getPropertyV2List';
import MCHS from '@salesforce/messageChannel/messageChannelHouseSelected__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class ListHouseTiles extends LightningElement {
  @wire(getPropertyV2List)
  houses;

  @wire(MessageContext)
  messageContext;

  houseSelectedId;

  handleHouseSelected(event) {
    this.houseSelectedId = event.detail.houseSelectedId;
    const message = { channelHouseId : event.detail.houseSelectedId}
    publish(this.messageContext, MCHS, message);   
  }
}