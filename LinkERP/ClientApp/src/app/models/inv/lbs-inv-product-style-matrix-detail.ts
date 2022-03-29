import { LBS_INV_ProductStyleMatrix } from "./LBS_INV_ProductStyleMatrix";
import { BaseEntity } from "../base-entity";

export class LbsInvProductStyleMatrixDetail extends BaseEntity {
    CompanyID: any;
    StyleMatrixID: any;
    StyleMatrixDetailCode: any;
    StyleMatrixDetailName: any;
    Product: any = new LBS_INV_ProductStyleMatrix();
}
