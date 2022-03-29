import { BaseEntity } from "../base-entity";

export class LBS_SOP_SalesPerson extends BaseEntity {
  ID:any='00000000-0000-0000-0000-000000000000';
  CompanyID :any=localStorage.getItem('CompanyID');
  SalesPersonName: any;
  WarehouseID:any='00000000-0000-0000-0000-000000000000';
  CreatedBY:any=localStorage.getItem('LoginID');
}
export class SYSUtility extends BaseEntity {
  Path:any='';
}