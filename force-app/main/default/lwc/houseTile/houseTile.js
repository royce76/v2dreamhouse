import { LightningElement, api } from 'lwc';
const SELECTED_TILE_CSS = "border-tile-select";
const DESELECTED_TILE_CSS = "deselect";

export default class HouseTile extends LightningElement {
  @api
  house;

  @api
  houseSelectedId;

  get backgroundImage() {
    return `background-image:url(${this.house.Thumbnail__c})`;
  }

  get classHouseSelect() {
    if(this.houseSelectedId === this.house.Id) {
      return SELECTED_TILE_CSS;
    }
    return DESELECTED_TILE_CSS;
  }

  handleHouseId() {
    const houseId = this.house.Id;
    const eventHouseId = new CustomEvent('houseselected', {
      detail : {houseSelectedId : houseId}
    });
    this.dispatchEvent(eventHouseId);
  }

}