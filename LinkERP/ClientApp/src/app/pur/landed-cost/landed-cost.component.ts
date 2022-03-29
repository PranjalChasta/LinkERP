import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { LandedCostService } from '../services/landed-cost.service';
import { CustomValidators } from 'ngx-custom-validators';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LbsPurLandedCost } from 'src/app/models/pur/lbs-pur-landed-cost';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';

@Component({
  selector: 'app-landed-cost',
  templateUrl: './landed-cost.component.html',
  styleUrls: ['./landed-cost.component.css']
})
export class LandedCostComponent implements OnInit {
  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  LandedCostForm: FormGroup;
  landed: any;
  submitted: boolean;
  vendors: any;
  AccessTab: string;
  CompanyID = localStorage.getItem('CompanyID');
  SelectedCostID: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  PageSize: any;
  IsActive: boolean;
  NextShipmentNumber: any;
  Status: any;
  changeStatusBookedIn: boolean = false;
  enableInvoiceTab: boolean;
  enableShippingLinesTab: boolean = false;
  enableNextTab: boolean;
  enableStockBookedInTab: boolean = false;
  isImportCostDone: boolean;
  isTaxableImportDone: boolean;
  isInvoiceDone: boolean;
  WareHouse: any;
  WarehouseID: any;
  WarehouseLocation: any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private commonService: InvCommonService,
    private deleteRecordsService: DeleteRecordsService,
    private landedCostService: LandedCostService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService,
    private sharedFormatterService: SharedFormatterService
  ) { }

  ngOnInit() {
    this.Mode = "List";
    this.AccessTab = "LandedCost";
    this.GetAgColumns();
    this.CreateForm();
    this.BindLandedCost();
    this.BindVendor();
    this.BindWareHouse();
    this.SetPermissions();
    this.PageSize = "50";
  }


  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'Shipment No', field: 'shipmentNo', sortable: true, filter: true },
      { headerName: 'Way Bill No', field: 'wayBillNo', sortable: true, filter: true },
      { headerName: 'ShipInit Date', field: 'shipInitDate', sortable: true, filter: true, },
      { headerName: 'Shipment Clearence Agency', field: 'vendorAccountName', sortable: true, filter: true },
      { headerName: 'Vessel Name', field: 'vesselName', sortable: true, filter: true },
      { headerName: 'Container No', field: 'containerNo', sortable: true, filter: true },
      { headerName: 'Status', field: 'status', type: 'Status' ,sortable: true, filter: true},
      { headerName: 'Delete Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  CreateForm() {
    this.LandedCostForm = this.FB.group({
      ID: [''],
      ShipmentNo: [''],
      WarehouseID: ['-1', CustomValidators.notEqual('-1')],
      ShipmentClearanceAgency: ['-1', CustomValidators.notEqual('-1')],
      WayBillNo: ['', Validators.required],
      VesselName: ['', Validators.required],
      ContainerNo: ['', Validators.required],
      ShipmentNotes: [''],
      ShipInitDate: [new Date()],
      ShipmentDepartureDate: [new Date()],
      ShipmentArrivalDate: [new Date(), Validators.required],
      ShipmentReceiptDate: [new Date()],
      ExpectedArrivalDate: [new Date()],
    })

  }

  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "308");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.LandedCostForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.LandedCostForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.LandedCostForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  get f() { return this.LandedCostForm.controls; }

  BindLandedCost() {
    this.AgLoad = false;
    this.landedCostService.getLandedCost().subscribe((resp: any) => {
      this.RowData = resp.data.landedcost;
      this.RowData.forEach(element => {
        let shipInitDate = { 'value': element.shipInitDate }
        element.shipInitDate = this.sharedFormatterService.dateTimeFormatter(shipInitDate);
      });
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of vendor to the Grid.
  BindVendor() {
    this.AgLoad = false;
    this.commonService.getVendor().subscribe((resp: any) => {
      this.vendors = resp.data.vendors;
      this.AgLoad = true;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all BindWareHouse to the Grid.
  BindWareHouse() {
    this.commonService.getWareHouse().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
    }, (error) => {
    });
  }
  //Add new LandedCost
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.LandedCostForm.enable();
    //this.BindNextShipmentNumber();
    this.ResetForm();
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.enableShippingLinesTab = false;
    this.enableStockBookedInTab = false;
    //this.CheckStatus();
    this.changeStatusBookedIn = false;
    this.Mode = "List";
    this.AccessTab = 'LandedCost';
  }
  CheckStatus() {
    this.enableShippingLinesTab = false;
    this.enableStockBookedInTab = false;
    if (this.Status == 'BookedIn') {
      this.enableShippingLinesTab = true;;
    } else if (this.Status == 'Finalise') {
      this.enableShippingLinesTab = true;
      this.enableStockBookedInTab = true;
    }
  }

  //To save the landed details to database table by calling the API service

  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.LandedCostForm.invalid) {
      return;
    }
    let landedcosts = new LbsPurLandedCost();
    landedcosts.CompanyID = this.CompanyID;
    landedcosts.ExpectedArrivalDate = this.LandedCostForm.get('ExpectedArrivalDate').value;
    landedcosts.ShipInitDate = this.LandedCostForm.get('ShipInitDate').value;
    landedcosts.ShipmentArrivalDate = this.LandedCostForm.get('ShipmentArrivalDate').value;
    landedcosts.ShipmentClearanceAgency = this.LandedCostForm.get('ShipmentClearanceAgency').value;
    landedcosts.ShipmentDepartureDate = this.LandedCostForm.get('ShipmentDepartureDate').value;
    landedcosts.ShipmentNotes = this.LandedCostForm.get('ShipmentNotes').value;
    landedcosts.ShipmentReceiptDate = this.LandedCostForm.get('ShipmentReceiptDate').value;
    landedcosts.WarehouseID = this.LandedCostForm.get('WarehouseID').value;
    landedcosts.VesselName = this.LandedCostForm.get('VesselName').value;
    landedcosts.ContainerNo = this.LandedCostForm.get('ContainerNo').value;
    landedcosts.WayBillNo = this.LandedCostForm.get('WayBillNo').value;
    landedcosts.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      landedcosts.Status = "Open";
      this.landedCostService.addLandedCost(landedcosts).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Landed cost details added successfully');
          this.SelectedCostID = resp.data.id;
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindLandedCost();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            this.Edit(resp.data.id);
            this.BindLandedCost();
          }
          // this.ResetForm();
          // this.BindLandedCost();
          // this.Mode = 'List';
          // this.submitted = false;
        }
        else {
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      debugger;
      landedcosts.ID = this.LandedCostForm.get('ID').value;
      landedcosts.ShipmentNo = this.LandedCostForm.get('ShipmentNo').value;
      if (saveAction == 'BookedIn') {
        landedcosts.Status = "BookedIn";
        this.Status = 'BookedIn';
      } else if (saveAction == 'Finalise') {
        landedcosts.Status = "Finalise";
        this.Status = 'Finalise';
      } else {
        landedcosts.Status = "Open";
        this.Status = 'Open';
      }
      this.landedCostService.updateLandedCost(landedcosts).subscribe((resp: any) => {
        if (resp.isSuccess == true) {

          this.toastr.success('Landed cost details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindLandedCost();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            let ID = this.LandedCostForm.get('ID').value;
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
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id)
      this.SelectedCostID = event.data.id;
    } else if (colId == 'Delete') {
      this.OnDeleteLandedCost(event.data.id)
    }
  }

  //To bind the data of landed cost to the controls to edit/update.
  Edit(ID): void {
    this.BindLandedCostByID(ID);
    this.Mode = 'Edit';
  }

  BindLandedCostByID(ID) {
    this.IsActive = true;
    this.landedCostService.getLandedCostByID(ID).subscribe((resp: any) => {
      console.log(resp);
      console.log(" is");
      if (resp.isSuccess == true) {
        let lendedcostdetail: any = new LbsPurLandedCost();
        lendedcostdetail = resp.data.landedDetails;
        this.WarehouseID = lendedcostdetail.warehouseID;
        let warehouse = this.WareHouse.filter(x => x.id == this.WarehouseID);
        this.WarehouseLocation = warehouse[0].wareHouseName;
        this.LandedCostForm.patchValue({
          ID: lendedcostdetail.id,
          ContainerNo: lendedcostdetail.containerNo,
          ExpectedArrivalDate: lendedcostdetail.expectedArrivalDate,
          ShipInitDate: lendedcostdetail.shipInitDate,
          ShipmentArrivalDate: lendedcostdetail.shipmentArrivalDate,
          ShipmentClearanceAgency: lendedcostdetail.shipmentClearanceAgency,
          WarehouseID: lendedcostdetail.warehouseID,
          ShipmentDepartureDate: lendedcostdetail.shipmentDepartureDate,
          ShipmentNo: lendedcostdetail.shipmentNo,
          ShipmentNotes: lendedcostdetail.shipmentNotes,
          ShipmentReceiptDate: lendedcostdetail.shipmentReceiptDate,
          Status: lendedcostdetail.status,
          VesselName: lendedcostdetail.vesselName,
          WayBillNo: lendedcostdetail.wayBillNo,
        });

        //Check if Purchase Order is already submitted then enable next tabs
        if (this.Status == 'BoodedIn' || this.Status == 'Finalise') {
          this.enableNextTab = true;
        } else if (resp.data.landedDetails.isPOSubmitted == '1') {
          this.enableNextTab = true;
        } else {
          this.enableNextTab = false;
        }

        this.NextShipmentNumber = lendedcostdetail.shipmentNo;
        this.Status = lendedcostdetail.status;
        if (this.Status == 'BookedIn') {
          this.enableShippingLinesTab = true;
          this.IsActive = false;
          this.LandedCostForm.disable();
        } else if (this.Status == 'Finalise') {
          this.enableStockBookedInTab = true;
          this.enableShippingLinesTab = true;
          this.IsActive = false;
          this.LandedCostForm.disable();
        } else {
          this.LandedCostForm.enable();
        }
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }

  //To create the cost Form Controls.
  ResetForm() {
    this.LandedCostForm.patchValue({
      ID: '',
      ContainerNo: '',
      ShipmentClearanceAgency: '-1',
      ShipInitDate: new Date(),
      ShipmentNo: '',
      ShipmentNotes: '',
      VesselName: '',
      WayBillNo: '',
      ShipmentDepartureDate: new Date(),
      ShipmentArrivalDate: new Date(),
      ShipmentReceiptDate: new Date(),
      ExpectedArrivalDate: new Date(),
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

  OnDeleteLandedCost(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_LandedCost', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindLandedCost();
      //this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  activeShippinglinesTab($event) {
    if ($event == 'InvoiceDone') {
      this.isInvoiceDone = true;
    } else if ($event == 'TaxableImportDone') {
      this.isTaxableImportDone = true;
    } else if ($event == 'ImportCostDone') {
      this.isImportCostDone = true;
    } if ((this.isInvoiceDone && this.isTaxableImportDone && this.isImportCostDone) || $event == 'AllDone') {
      this.bookedIn();
    }
  }
  bookedIn() {
    this.changeStatusBookedIn = true;
    this.onSave('BookedIn');
    this.LandedCostForm.disable();
  }
  activeNextTab() {
    this.enableNextTab = true;
  }
  activeStockBookedInTab() {
    this.enableStockBookedInTab = true;
    this.ChangeStatusToFinalise();
  }
  ChangeStatusToFinalise() {
    this.Status = 'Finalise';
    this.onSave('Finalise');
  }
  // activeShippingLinesTab(){
  //   this.enableShippingLinesTab=true;
  // }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

}
