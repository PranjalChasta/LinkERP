import { BaseEntity } from "../base-entity";
export class LBSINVInventoryDetail extends BaseEntity {
  CompanyID: any;
  ProductID: any;
  WarehouseID: any;
  BinID: any;
  MinimumStock: any;
  MaximumStock: any;
  MinimumOrder: any;
  AverageCost: any;
  StandardCost: any;
  LastCost: any;
  AvailableQuantity: any;
  InventoryGLClassificationID: any;
  AllowNegative: any;
}
