import { LightningElement, wire, api } from 'lwc';
import MCHS from '@salesforce/messageChannel/messageChannelHouseSelected__c';
import { subscribe, unsubscribe, MessageContext} from 'lightning/messageService';

import { getRecord } from 'lightning/uiRecordApi';

/**
 * fields in getRecord we need
 */
const champs = [
  'Property__c.Name',
  'Property__c.Address__c',
  'Property__c.City__c',
  'Property__c.Location__Latitude__s',
  'Property__c.Location__Longitude__s'
];

export default class HouseMap extends LightningElement {
  houseId;

  mapMarkers;

  /**
   * for the form
   */
  /* fieldes = [
    'Name',
    'Address__c',
    'City__c',
    'Location__Latitude__s',
    'Location__Longitude__s'
  ]; */

  error;

  subscription = null;
  
  /**
   * define this.mapMarkers dynamcly
   * @param {array} param0 
   */
  @wire(getRecord, {recordId:'$houseId', fields: champs})
  wireRecordHouse({data,error}){
    if(data) {
      this.error = undefined;
      this.mapMarkers = [{
        location: {
          Latitude: data.fields.Location__Latitude__s.value,
          Longitude: data.fields.Location__Longitude__s.value,
        },
        title: `${data.fields.Name.value}`,
        description: `${data.fields.Address__c.value} ${data.fields.City__c.value}`,
        mapIcon: {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',            
          fillColor: 'gold',
          fillOpacity: .8,
          strokeWeight: 0,
          scale: .10
        },
      }];
    } else if(error) {
      this.error = error;
      this.mapMarkers = [];
    }
  }

  /**
   * dynamic get record without getfieldvalue on property
   */
  /* @wire(getRecord, {recordId:'$houseId', fields:champs})
  house;

  get name() {
    return this.house.data.fields.Name.value;
  } */

  /**
   * don't need
   */
  /* @api
  get recordId() {
    return this.houseId;
  }

  set recordId(houseId){
    this.houseId = houseId;
  } */

  @wire(MessageContext)
  messageContext;

  subscribeToMessageChannel() {
    this.subscription = subscribe(
      this.messageContext,
      MCHS,
      (message) => {
        this.handleMessage(message);
      }
    );
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