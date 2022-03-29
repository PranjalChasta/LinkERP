import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { WarehouseService } from 'src/app/inv/services/warehouse.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InternalTransfersService } from '../../services/internal-transfers.service';
import { PurCommonService } from '../../services/pur-common.service';

@Component({
  selector: 'app-initiate-internal-transfers-details',
  templateUrl: './initiate-internal-transfers-details.component.html',
  styleUrls: ['./initiate-internal-transfers-details.component.css']
})
export class InitiateInternalTransfersDetailsComponent implements OnInit {
  RowData:any;
  @Input() BatchID:any;
  @Input()  ProductID:any;
  @Output() OnCancel = new EventEmitter();
  IsAllSelected;
  constructor(private Requisitionservice: RequisitionService,
    private deleteRecordsService: DeleteRecordsService,
    private WareHouseService: WarehouseService,
    private commonService: InvCommonService,
    private inventoryService: InventoryService,
    private cryptoAes: CryptoAes,
    private purCommonService:PurCommonService,
    private TransferService: InternalTransfersService,
    private FB: FormBuilder,
    private toastr: ToastrService,
    public modalService: BsModalService) { }

  ngOnInit() {
    this. BindInternalTransfers()
  }

  BindInternalTransfers() { 
    this.RowData=[]
    this.TransferService.GetPurchaseRequisitionNumbers(this.BatchID).subscribe((resp: any) => {
      this.RowData = resp.data.internalTransferDetails; 
      console.log(this.RowData)
      
    }, (error) => {
 
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  UpdateChanges(){
    this.TransferService.InternalTransfersDetailsList(this.RowData).subscribe((resp: any) => {
      //this.RowData = resp.data; 
      if (resp.isSuccess == true) {
      console.log(resp.data)
      this.toastr.success('Internal transfers details updated successfully')
      this.BindInternalTransfers()
      }
      else {
        this.toastr.warning(resp.message)
      }
    }, (error) => {
 
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });

  } 
  checkAll(event) {
    let b: boolean;
    if (this.IsAllSelected) {
      b = true;
    } else {
      b = false;
    }
    for (let i = 0; i <= this.RowData.length - 1; i++) {
      // if (this.RowData[i].requisitionLineStatus != 'Approved' || Status == 'New') {
      this.RowData[i].isSelect = b;
      //}
    }
  }
  Cancel() {
    this.OnCancel.emit(); 
  }
}
