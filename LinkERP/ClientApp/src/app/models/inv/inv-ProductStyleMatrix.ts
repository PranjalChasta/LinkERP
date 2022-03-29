import { BaseEntity } from "../base-entity"

export class InvProductStyleMatrix extends BaseEntity {
    styleMatrixDetailName:any;
    styleMatrixName:any;
    Id:any;
    ProductStyleMatrixColumn:Array<ProductStyleMatrixColumn> = [];  
}

export class ProductStyleMatrixColumn { 
    styleMatrixDetailName:any;
    styleMatrixName:any;
    Id:any;
    MatrixDetail:Array<MatrixDetail> = []; 
}

export class MatrixDetail {
    Quantity: any;
    Bin: any;
    ProductID: any;
    AdjustmentID: any;
    AdjustmentDetailId: any;
}


