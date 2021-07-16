import { LightningElement, api } from 'lwc';
const SELECTED_TILE_CSS = "border-tile-select tile slds-m-around_x-small flex-col-end";
const DESELECTED_TILE_CSS = "deselect tile slds-m-around_x-small flex-col-end";

export default class HouseTile extends LightningElement {
  /**
   * Parent ListHouseTile.js provides the house Object 
   */
  @api
  house;

  /**
   * Parent ListHouseTile.js provides the house selected 
   */
  @api
  houseSelectedId;

  /**
   * BackgroundImage used with the attibute style in houseTile.html
   */
  get backgroundImage() {
    return `background-image:url(${this.house.Thumbnail__c})`;
  }

  /**
   * ClassHouseSelect borders with red dashed the house tile if it is selected or not
   */
  get classHouseSelect() {
    if(this.houseSelectedId === this.house.Id) {
      return SELECTED_TILE_CSS; 
    }
    return DESELECTED_TILE_CSS;
  }

  /**
   * Communicate the house Id selected by an Onclick event to the parent ListHouseTile.js with a new
   * customevent, named houselected 
   */
  handleHouseId() {
    const houseId = this.house.Id;
    const eventHouseId = new CustomEvent('houseselected', {
      detail : {houseSelectedId : houseId}
    });
    this.dispatchEvent(eventHouseId);
  }

}