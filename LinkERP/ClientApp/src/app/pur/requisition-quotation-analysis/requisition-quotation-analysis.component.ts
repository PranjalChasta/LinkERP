import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { WarehouseService } from 'src/app/inv/services/warehouse.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { RequisitionQuotationAnalysisService } from '../services/requisition-quotation-analysis.service';
import { LBSPURRequitionQuotationAnalysis } from 'src/app/models/pur/lbs-pur-requition-quotation-analysis';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { RequisitionDetailsService } from '../services/requisition-details.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-requisition-quotation-analysis',
  templateUrl: './requisition-quotation-analysis.component.html',
  styleUrls: ['./requisition-quotation-analysis.component.css']
})
export class RequisitionQuotationAnalysisComponent implements OnInit {
  RequisitionQuotationAnalysisForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  Requisitionsquotation: any[] = [];
  BindInventory: any[] = [];
  UOMList: any[] = [];
  Vendor: any[] = [];
  RequisitionDetails: any[] = [];
  SelectedRequisitionquotationID:any;
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  modalRef: BsModalRef;
  AccessTab:string;
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  Currentpage: string;
  IsActive: boolean;
  constructor(
    private requistiondetails: RequisitionDetailsService,
    private Requisitionservice: RequisitionService,
    private sysCommonService: SysCommonService,
    private QuotationService: RequisitionQuotationAnalysisService,
    private deleteRecordsService: DeleteRecordsService,
    private WareHouseService: WarehouseService,
    private commonService: InvCommonService,
    private inventoryService: InventoryService, private cryptoAes: CryptoAes,
    private FB: FormBuilder, private toastr: ToastrService,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.AccessTab='Quotation';
    this.Mode = "List";
    this.CreateForm();
    this.AgGridColumns();
    this.SetPermissions();
    this.PageSize = "50";
    this.BindRequisitionQuotationAnalysis();
    this.BindInventories();
    this.BindUOM();
    this.BindVendor();
    this.BindRequisitionDetails();
    this.Currentpage = "0";
  }

  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "305");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.RequisitionQuotationAnalysisForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.RequisitionQuotationAnalysisForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.RequisitionQuotationAnalysisForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
 //To Create Form
  CreateForm() {
    this.RequisitionQuotationAnalysisForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      RequisitionDetailID: ['-1', CustomValidators.notEqual('-1')],
      VendorID: ['-1', CustomValidators.notEqual('-1')],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      ProductDescription: ['', Validators.required],
      UnitofMeasure: ['-1', CustomValidators.notEqual('-1')],
      UnitPrice: ['', Validators.required],
      PreferredVendor: ['true',]
    });
  }

  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Description', field: 'productDescription', sortable: true, filter: true, checkboxSelection: false },
      // { headerName: 'RequisitionID', field: 'requestedQuantity: ', sortable: true, filter: true },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true },
      { headerName: 'Vendor', field: 'name', sortable: true, filter: true },
      { headerName: 'UOM', field: 'dataName', sortable: true, filter: true },
      { headerName: 'Price', field: 'unitPrice', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  get f() { return this.RequisitionQuotationAnalysisForm.controls; }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.RequisitionQuotationAnalysisForm.patchValue({
      ID: '',
      CompanyID: '-1',
      RequisitionDetailID: '-1',
      VendorID: '-1',
      ProductID: '-1',
      ProductDescription: '',
      UnitofMeasure: '-1',
      UnitPrice: '',
      PreferredVendor: ''
    });
    this.RequisitionQuotationAnalysisForm.markAsUntouched();
    this.RequisitionQuotationAnalysisForm.markAsPristine();
    this.submitted = false;
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  /* FOR Aggird End  */

  //add for internal-transfer 
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.RequisitionQuotationAnalysisForm.enable();
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.Mode = "List";
  }
  //To bind the data of all price-group to the Grid.
  BindRequisitionQuotationAnalysis() {
    this.AgLoad = false;
    this.QuotationService.getrequisitionquotationanalysis().subscribe((resp: any) => {
      this.Requisitionsquotation = resp.data.requisitionsquotation;
      this.RowData = resp.data.requisitionsquotation;
      console.log(this.Requisitionsquotation);
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  BindInventories() {
    this.Loading = true;
    this.commonService.getInventory().subscribe((resp: any) => {
      console.log(resp.data.inventory);
      this.BindInventory = resp.data.productkits;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
    });
  }
  BindUOM() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindVendor() {
    this.Loading = true;
    this.commonService.getVendor().subscribe((resp: any) => {
      this.Vendor = resp.data.vendors;
      this.Loading = false;
    }, (error) => {
    });
  }
  BindRequisitionDetails() {
    this.requistiondetails.getRequisitionDetails().subscribe((resp: any) => {
      this.RequisitionDetails = resp.data.requisitionsdetails;
      console.log(this.RequisitionDetails);
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
    });
  }
  //To save the price-group details to database table by calling the API service
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.RequisitionQuotationAnalysisForm.invalid) {
      return;
    }
    this.Loading = true;
    let analysis = new LBSPURRequitionQuotationAnalysis();
    analysis.CompanyID = this.CompanyID;
    analysis.RequisitionDetailID = this.RequisitionQuotationAnalysisForm.get('RequisitionDetailID').value;
    analysis.VendorID = this.RequisitionQuotationAnalysisForm.get('VendorID').value;
    analysis.ProductID = this.RequisitionQuotationAnalysisForm.get('ProductID').value;
    analysis.ProductDescription = this.RequisitionQuotationAnalysisForm.get('ProductDescription').value;
    analysis.UOM = this.RequisitionQuotationAnalysisForm.get('UnitofMeasure').value;
    analysis.UnitPrice = this.RequisitionQuotationAnalysisForm.get('UnitPrice').value;
    analysis.PreferredVendor = this.RequisitionQuotationAnalysisForm.get('PreferredVendor').value;
    analysis.CreatedBY = localStorage.getItem('LoginID');
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.QuotationService.addRequisitionquotationanalysis(analysis).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Requisition quotation details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindRequisitionQuotationAnalysis();
            this.Mode = 'List';
            this.ResetForm();
          }
          else{
            this.Edit(resp.data.id);
            this.BindRequisitionQuotationAnalysis();
          }
          // this.ResetForm();
          // this.BindRequisitionQuotationAnalysis();
          // this.Mode = 'List';
          this.Loading = false;
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      analysis.ID = this.RequisitionQuotationAnalysisForm.get('ID').value;
      this.QuotationService.updateRequisitionquotationanalysis(analysis).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Requisition quotation  details updated successfully');
            if (saveAction == 'Close') {
                 this.Cancel();
            this.BindRequisitionQuotationAnalysis();
            this.Mode = 'List';
            this.ResetForm();
            }
            else{
              let ID = this.RequisitionQuotationAnalysisForm.get('ID').value;
              this.Edit(ID);
            }
       //   this.ResetForm();
        //  this.BindRequisitionQuotationAnalysis();
         // this.Mode = 'List';
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.AgEdit(event.data)
      this.SelectedRequisitionquotationID=event.data.id;
    } else if (colId == 'Delete') {
      this.OnDelete(event.data.id)
    }
  }
  //edit operation
  AgEdit(event) {
    // this.SelectedRequisitionID=event.id;
    console.log(event);
    this.RequisitionQuotationAnalysisForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      RequisitionDetailID: event.requisitionDetailID,
      VendorID: event.vendorID,
      ProductID: event.productID,
      ProductDescription: event.productDescription,
      UnitofMeasure: event.uom,
      UnitPrice: event.unitPrice,
      PreferredVendor: event.preferredVendor
    });
    if (!event.deleted) {
      this.RequisitionQuotationAnalysisForm.enable();
      this.IsActive = true;
    } else {
      this.RequisitionQuotationAnalysisForm.disable();
      this.IsActive = false;
    }
    this.Mode = 'Edit';
  }

  Edit(ID): void {
    this.BindQuotationbyID(ID);
    this.Mode = 'Edit';
  }
  BindQuotationbyID(ID) {
    this.SelectedRequisitionquotationID=ID;
    this.QuotationService.getRequisitionquotationanalysisByID(ID).subscribe((resp: any) => {
      let measure: any = new LBSPURRequitionQuotationAnalysis();
      measure = resp.data.requisitiondetail;
      this.RequisitionQuotationAnalysisForm.patchValue({
        ID: measure.id,
        CompanyID: measure.companyID,
        RequisitionDetailID: measure.requisitionDetailID,
        VendorID: measure.vendorID,
        ProductID: measure.productID,
        ProductDescription: measure.productDescription,
        UnitofMeasure: measure.uom,
        UnitPrice: measure.unitPrice,
        PreferredVendor: measure.preferredVendor
      });
       if (!measure.deleted) {
        this.RequisitionQuotationAnalysisForm.enable();
        this.IsActive = true;
      } else {
        this.RequisitionQuotationAnalysisForm.disable();
        this.IsActive = false;
      }

      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  OnDelete(ID) {
    debugger;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_RequisitionQuotationAnalysis', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindRequisitionQuotationAnalysis();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

}
