import { BaseEntity } from "../base-entity";
import { LBS_INV_ProductStyleMatrix } from "./LBS_INV_ProductStyleMatrix";
export class LbsInvProductstylematrixdetail extends BaseEntity{
    CompanyID:any;
    StyleMatrixID:any;
    StyleMatrixDetailCode:any;
    StyleMatrixDetailName:any;
    Product: any = new LBS_INV_ProductStyleMatrix();
}
