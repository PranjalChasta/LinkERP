import { BaseEntity } from "../base-entity"

export class InvProductStyleMatrixTransfer extends BaseEntity {
    styleMatrixDetailName:any;
    styleMatrixName:any;
    Id:any;
    ProductStyleTransferMatrixColumn:Array<ProductStyleTransferMatrixColumn> = [];  
}

export class ProductStyleTransferMatrixColumn { 
    styleMatrixDetailName:any;
    styleMatrixName:any;
    Id:any;
    TransferMatrixDetail:Array<TransferMatrixDetail> = []; 
}

export class TransferMatrixDetail {
    Quantity: any;
    Bin: any;
    ProductID: any;
    TransferID: any;
    TransferDetailId: any;
}


