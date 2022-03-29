import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { LBSINVInventoryAdjustment } from 'src/app/models/inv/LBS_INV_InventoryAdjustment';
import { InventoryAdjustmentService } from '../services/inventory-adjustment.service';
import { PurchaseTemplateService } from '../services/purchase-template.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { InvCommonService } from '../services/inv-common.service';
import { SharedFormatterService } from '../../shared/services/shared-formatter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-inventory-adjustment',
  templateUrl: './inventory-adjustment.component.html',
  styleUrls: ['./inventory-adjustment.component.css']
})
export class InventoryAdjustmentComponent implements OnInit {

  InventoryAdjustmentForm: FormGroup;
  Mode: any = 'List';
  AgLoad: boolean = false
  ColumnDefs;
  read: boolean;
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  inventoryAdjustment: any;
  RowData: any;
  WareHouse: any;
  //Loading: any = false;
  SelectedAdjustmentID: any;
  SelecteWareHouseID: any;
  postClicked: boolean = false;
  modalRef: BsModalRef;
  datePickerConfig: Partial<BsDatepickerConfig>
  CurrentStatus: string;
  PageSize: any;
  Currentpage: string;
  invadjustmentrouter: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private inventoryAdjustmentService: InventoryAdjustmentService,
    private purchaseTemplateService: PurchaseTemplateService,
    public modalService: BsModalService,
    private invcommonservice: InvCommonService,
    private deleteRecordsService: DeleteRecordsService,
    private sharedFormatterService: SharedFormatterService, private route: ActivatedRoute, private router: Router, private cryptoAes: CryptoAes) {
    this.datePickerConfig = Object.assign({}, { dateInputFormat: 'MM-DD-YYYY', showWeekNumbers: false });
    this.invadjustmentrouter = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.AgLoad = false;
    this.IsActive = true;
    this.Mode = "List";
    this.PageSize = "50";
    this.Currentpage = "0";

    let d = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.InventoryAdjustmentForm = this.FB.group({
      ID: [''],
      WareHouseID: ['-1', CustomValidators.notEqual('-1')],
      AdjustmentNo: [''],
      AdjustmentReason: ['', Validators.required],
      DocumentNo: ['', Validators.required],
      DatePosted: [d, Validators.required],
    })
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Adjustment No', field: 'adjustmentNo', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Adjustment Reason', field: 'adjustmentReason', sortable: true, filter: true },
      { headerName: 'WareHouse', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Document No', field: 'documentNumber', sortable: true, filter: true },
      { headerName: 'Date Posted', field: 'datePosted', sortable: true, filter: true, valueFormatter: this.sharedFormatterService.dateFormatter },
      { headerName: 'Adj Status', field: 'status', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: !this.write_Access },
      { headerName: '', field: 'Delete', type: 'DeleteActionAdj', hide: !this.delete_Access }
    ];
    this.BindInventoryAdjustment();
    this.BindWareHouse();

  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }

  get f() { return this.InventoryAdjustmentForm.controls; }

  OnActionClick(event: any) {
    debugger;
    event.data.deletedBy = this.delete_Access + ',' + this.write_Access;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.read = false;
      this.SelectedAdjustmentID = event.data.id;
      this.SelecteWareHouseID = event.data.wareHouseID;
      if (event.deleteStatus == 'Active') {
        this.IsActive = true;
      } else {
        this.IsActive = false;
        this.InventoryAdjustmentForm.disable();
      }
      if (event.data.deleteStatus == 'Active') {
        this.IsActive = true;
      } else {
        this.IsActive = false;
        this.InventoryAdjustmentForm.disable();
      }
      this.Mode = 'Edit';
      this.Edit(event.data.id);

      console.log(this.SelectedAdjustmentID);
      //this.BindDetails(event.data)
    } else if (colId == 'Delete' && this.delete_Access) {
      this.DeleteInventoryAdjustment(event.data.id)
    }
  }
  //To bind the data of States to the controls to edit/update.
  Edit(ID): void {

    this.BindInventoryAdjustmentByID(ID);

  }


  BindInventoryAdjustmentByID(ID) {
    debugger;
    this.inventoryAdjustmentService.getInventoryAdjustmentByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let adjustment: any = new LBSINVInventoryAdjustment();
        adjustment = resp.data.inventoryAdjustment;
        this.read = false;
        this.CurrentStatus = adjustment.status;
        debugger;
        // if (adjustment.deleteStatus == "Active")
        // {
        //   this.IsActive = true;
        // }
        // if(adjustment.deleteStatus=="InActive")
        // {
        //   this.IsActive = false;
        //   this.InventoryAdjustmentForm.disable();
        // }


        //alert(this.IsActive);
        this.SelectedAdjustmentID = adjustment.id;
        this.SelecteWareHouseID = adjustment.wareHouseID;
        this.Mode = 'Edit';
        console.log(adjustment);
        this.InventoryAdjustmentForm.patchValue({
          ID: adjustment.id,
          AdjustmentNo: adjustment.adjustmentNo,
          AdjustmentReason: adjustment.adjustmentReason,
          WareHouseID: adjustment.wareHouseID,
          DocumentNo: adjustment.documentNumber,
          DatePosted: adjustment.datePosted
        });
        if (adjustment.status == 'Closed') {
          this.postClicked = true;
          this.InventoryAdjustmentForm.disable();
        } else {
          this.InventoryAdjustmentForm.get('WareHouseID').disable();
        }
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }

  //Delete the record
  DeleteInventoryAdjustment(ID) {

    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryAdjustment', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      //   this.BindInventoryProductPriceDetails();
      this.BindInventoryAdjustment();
      //this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  //To bind the data of all warehouse to the Grid.
  BindWareHouse() {
    debugger; //bug #654
    // this.invcommonservice.getWareHouse().subscribe((resp: any) => {
    //   this.WareHouse = resp.data.warehouse;
    // }, (error) => {
    //   this.toastr.error(error);
    //   console.error('Problem with the sevice. Please try later : ' + error);
    // });
    this.invcommonservice.getWareHouseByRole().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //Add new InventoryTransfer
  AddNewInvAdjustment(): void {
    let d = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.ResetForm();
    this.submitted = false;
    this.IsActive = true;
    this.postClicked = false;
    this.CurrentStatus = 'New';
    this.InventoryAdjustmentForm.enable();
    this.InventoryAdjustmentForm.get('WareHouseID').enable();
    this.Mode = 'Add';
  }

  //Cancel the Add/Edit
  Cancel(): void {
    this.router.navigate(['/inv/inventory-adjustment']);
    this.ResetForm();
    this.InventoryAdjustmentForm.enable();
    this.submitted = false;
    this.postClicked = false;
    this.BindInventoryAdjustment();
    this.Mode = "List";

  }

  //To create the States Form Controls.
  ResetForm() {
    let d = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.InventoryAdjustmentForm.patchValue({
      ID: '',
      AdjustmentNo: '',
      AdjustmentReason: '',
      WareHouseID: '-1',
      DocumentNo: '',
      DatePosted: d
    });
  }
  OnCancel() {
    this.ResetForm();
    this.Mode = 'List';
  }
  /* onSave() {
    this.confirmation.ConfirmationPopup('Are you sure to save record?');
  } */
  //To save the Inventory Adjustment to database table by calling the API service
  //onSave() {
  //  this.confirmation.ConfirmationPopup('Are you sure to save record?');
  //}
  onSave() {
    this.onSaveNew('Save');
  }
  onSaveNew(saveAction) {
    console.log(saveAction);
    this.submitted = true;
    if (this.InventoryAdjustmentForm.invalid) {
      return;
    }
    //this.Loading = true;
    let inventoryadjustment = new LBSINVInventoryAdjustment();
    inventoryadjustment.CompanyID = this.CompanyID;
    inventoryadjustment.CreatedBY = localStorage.getItem('LoginID');
    inventoryadjustment.AdjustmentNo = this.InventoryAdjustmentForm.get('AdjustmentNo').value;
    inventoryadjustment.AdjustmentReason = this.InventoryAdjustmentForm.get('AdjustmentReason').value;
    inventoryadjustment.DocumentNumber = this.InventoryAdjustmentForm.get('DocumentNo').value;
    inventoryadjustment.CreatedBY = localStorage.getItem('LoginID');
    if (this.postClicked) {
      inventoryadjustment.Status = "Closed";
    } else {
      inventoryadjustment.Status = "New";
    }

    inventoryadjustment.WareHouseID = this.InventoryAdjustmentForm.get('WareHouseID').value;
    inventoryadjustment.DatePosted = this.InventoryAdjustmentForm.get('DatePosted').value;

    this.submitted = false;
    if (this.Mode == 'Add') {

      this.inventoryAdjustmentService.addInventoryAdjustment(inventoryadjustment).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Adjustment details added successfully');
          this.ResetForm();
          this.BindInventoryAdjustment();
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
          } else {
            this.Edit(resp.data.id);
          }
          //this.Loading = false;
        }
        else {
          // alert(resp.message);
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {

      console.log(inventoryadjustment);
      inventoryadjustment.ID = this.InventoryAdjustmentForm.get('ID').value;
      let ID = this.InventoryAdjustmentForm.get('ID').value;
      this.inventoryAdjustmentService.UpdateInventoryAdjustment(inventoryadjustment).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Adjustment details updated successfully');

          this.ResetForm();
          //this.BindInventoryAdjustment();
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
          } else {
            this.Edit(ID);
          }

        }
        else {
          alert(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  post(event) {
    debugger;
 
      this.postClicked = true;
      let inventoryadjustment = new LBSINVInventoryAdjustment();
      inventoryadjustment.CompanyID = this.CompanyID;
      inventoryadjustment.ID = this.InventoryAdjustmentForm.get('ID').value;
      inventoryadjustment.AdjustmentReason = this.InventoryAdjustmentForm.get('AdjustmentReason').value;
      inventoryadjustment.DocumentNumber = this.InventoryAdjustmentForm.get('DocumentNo').value;
      inventoryadjustment.DatePosted = this.InventoryAdjustmentForm.get('DatePosted').value;
      inventoryadjustment.WareHouseID = this.InventoryAdjustmentForm.get('WareHouseID').value;
      // inventoryadjustment.ProductID = event[i].productID;
      inventoryadjustment.Status = "Closed";
      this.inventoryAdjustmentService.updateInventoryAdjustmentStatus(inventoryadjustment).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory adjustment details added successfully');
          // this.InventoryAdjustmentForm.disable();
          //this.BindInventoryAdjustment();
          // this.Mode = 'List';
          this.BindInventoryAdjustmentByID(this.InventoryAdjustmentForm.get('ID').value)
          //this.Loading = false;
        }
        else {
          this.toastr.warning(resp.message);
          return;
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    
  }


  BindInventoryAdjustment() {
    debugger;
    this.AgLoad = false;
    this.inventoryAdjustmentService.getInventoryAdjustment().subscribe((resp: any) => {
      this.inventoryAdjustment = resp.data.inventoryAdjustment;
      console.log(this.inventoryAdjustment);
      this.RowData = resp.data.inventoryAdjustment;
      if (this.invadjustmentrouter) {
        let data = this.RowData.filter(r => r.adjustmentNo == this.invadjustmentrouter);
        this.Edit(data[0].id);
      }
      this.AgLoad = true;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }

  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  OnSaveClose() {
    this.onSaveNew('Close');
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "211");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryAdjustmentForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryAdjustmentForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryAdjustmentForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
}
