import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import { NavigationMixin } from 'lightning/navigation';

import MCHS from '@salesforce/messageChannel/messageChannelHouseSelected__c';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

import HOUSE_OBJECT_API_NAME from '@salesforce/schema/Property__c';

import PICTURE_FIELD from '@salesforce/schema/Property__c.Picture__c';
import CITY_FIELD from '@salesforce/schema/Property__c.City__c';
import NAME_FIELD from '@salesforce/schema/Property__c.Name';

import BEDS_FIELD from '@salesforce/schema/Property__c.Beds__c';
import BATHS_FIELD from '@salesforce/schema/Property__c.Baths__c';
import PRICE_FIELD from '@salesforce/schema/Property__c.Price__c';
import BROKER_FIELD from '@salesforce/schema/Property__c.Broker__c';

/**
 * matches the fields we want to getfieldValue to show it outside of the form
 */
const HOUSE_FIELDS = [
  PICTURE_FIELD,
  CITY_FIELD,
  NAME_FIELD
];

export default class DetailHouse extends NavigationMixin(LightningElement) {
  subscription = null;

  /**
   * houseId will be provided by the channel message service MCHS
   */
  houseId;

  objectApiName = HOUSE_OBJECT_API_NAME;

  /**
   * fields in the form
   */
  fields = [
    BEDS_FIELD,
    BATHS_FIELD,
    PRICE_FIELD,
    BROKER_FIELD
  ];

  /**
   * Property houseId is reactive. We can get the record of the house object from his Id
   */
  @wire(getRecord, {recordId: '$houseId', fields: HOUSE_FIELDS})
  house;

  /**
   * required for the form 
   */
  @api
  get recordId() {
    return this.houseId;
  }

  set recordId(houseId) {
    this.houseId = houseId;
  }

  /**
   * to show the picture outside of the form
   */
  get pictureHouse() {
    return getFieldValue(this.house.data, PICTURE_FIELD);
  }

  /**
   * to show the name outside of the form
   */
   get nameHouse() {
    return getFieldValue(this.house.data, NAME_FIELD);
  }

  /**
   * to show the city Name outside of the form
   */
  get cityHouse() {
    return getFieldValue(this.house.data, CITY_FIELD);
  }

  @wire(MessageContext)
  messageContext;

  /**
   * If there is no subcription, it subscribes the message to get the Id of the house
   */
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

  /**
   * the field called channelHouseId from MCHS message contains the house Id  
   * @param {string} message 
   */
  handleMessage(message) {
    this.houseId = message.channelHouseId;
  }

  /**
   * everytime the house Id change 
   */
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  /**
   * Navigate to the record house
   */
  handleNavigateToRecordHouse(){
    this[NavigationMixin.Navigate]({
      type : 'standard__recordPage',
      attributes: {
        recordId : this.recordId,
        objectApiName : 'Property__c',
        actionName : 'view'
      }
    });
  }

}