import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InventoryAutomativeService } from '../../services/inventory-automative.service';
import { CustomValidators } from 'ngx-custom-validators';
import { LbsInvInventoryAutomotive } from 'src/app/models/inv/lbs-inv-inventory-automotive';
import { ToastrService } from 'ngx-toastr';
import { InventoryVendorService } from '../../services/inventory-vendor.service';
import { MakeService } from '../../services/make.service';
import { MakeModelService } from '../../services/make-model.service';
import { SeriesService } from '../../services/series.service';
import { EngineService } from '../../services/engine.service';
import { YearService } from '../../services/year.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-inventory-automative',
  templateUrl: './inventory-automative.component.html',
  styleUrls: ['./inventory-automative.component.css']
})
export class InventoryAutomativeComponent implements OnInit {
  @Input() InventryID: any;
  @Input() IsInventoryActive: boolean;
  CompanyId = localStorage.getItem('CompanyID');
  Mode: any = 'List';
  date = new Date();
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  InventoryAutomativeForm: FormGroup;
  inventoryAutomatives: any;
  submitted: boolean;
  MakeDetails: any;
  modellist: any;
  serieslist: any;
  EngineDetails: any;
  yearlist: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  Currentpage: string;
  IsActive: boolean;
  constructor(
    private FB: FormBuilder,
    private inventoryAutomative: InventoryAutomativeService,
    private makeService: MakeService,
    private toastr: ToastrService,
    private inventoryVendor: InventoryVendorService,
    private modelservice: MakeModelService,
    private seriesservice: SeriesService,
    private engineservice: EngineService,
    private yearservice: YearService,
    private cryptoAes: CryptoAes,
    private deleteRecordsService: DeleteRecordsService,
    private syscommon: SysCommonService) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.Currentpage = "0";
    this.PageSize = "50";
    this.InventoryAutomativeForm = this.FB.group({
      ID: [null],
      Make: ['-1', CustomValidators.notEqual('-1')],
      Model: ['-1', CustomValidators.notEqual('-1')],
      Year: ['-1', CustomValidators.notEqual('-1')],
      Series: ['-1', CustomValidators.notEqual('-1')],
      Engine: ['-1', CustomValidators.notEqual('-1')],

    })
    this.BindInventoryAutomative();
    this.BindMake();
    this.BindYear();

    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Make', field: 'makeName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Model', field: 'modelName', sortable: true, filter: true },
      { headerName: 'Series', field: 'seriesName', sortable: true, filter: true },
      { headerName: 'Engine', field: 'engineName', sortable: true, filter: true },
      { headerName: 'Year', field: 'name', sortable: true, filter: true },
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access || !this.IsInventoryActive }
    ];
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryAutomativeForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryAutomativeForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryAutomativeForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  get f() { return this.InventoryAutomativeForm.controls; }
  //To bind the data of InventoryAutomative to controls.
  BindInventoryAutomative() {
    this.AgLoad = false;
    this.inventoryAutomative.getInventoryAutomativeByInventoryID(this.InventryID).subscribe((resp: any) => {
      debugger;
      this.inventoryAutomatives = resp.data.inventoryAutomative;
      this.RowData = resp.data.inventoryAutomative;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of Make to controls.
  BindMake() {
    this.inventoryAutomative.getMakeModel().subscribe((resp: any) => {
      this.MakeDetails = resp.data.makelist;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Bindmakemodel(MakeID) {
    this.inventoryAutomative.getMakeModelByMakeID(MakeID).subscribe((resp: any) => {
      console.log(resp);
      this.modellist = resp.data.makemodellist;
    }, (error) => {
    });
  }

  Bindseries(ModelID) {
    this.inventoryAutomative.getSeriesByModelID(ModelID).subscribe((resp: any) => {
      console.log(resp);
      this.serieslist = resp.data.makeserieslist;
    }, (error) => {
    });
  }
  //To bind the data of Engine to controls.
  BindEngine(SeriesID) {
    this.inventoryAutomative.getEngineBySeriesID(SeriesID).subscribe((resp: any) => {
      console.log(resp);
      this.EngineDetails = resp.data.enginelist;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of Year to controls.
  BindYear() {
    this.yearservice.getYear().subscribe((resp: any) => {
      console.log(resp);
      this.yearlist = resp.data.yeardetails;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //Add new Automative
  AddNew(): void {
    this.Mode = 'Add';
    // this.read=true;
    this.IsActive = true;
    this.InventoryAutomativeForm.enable();
  }

  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.Mode = "List";
  }

  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit';
      this.Edit(event.data.id);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }

  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the Inventory Automative details to database table by calling the API service
  onSave(saveAction) {
    this.submitted = true;
    if (this.InventoryAutomativeForm.invalid) {
      return;
    }
    let inventoryAutomative = new LbsInvInventoryAutomotive();
    inventoryAutomative.CompanyID = this.CompanyId;
    inventoryAutomative.ProductID = this.InventryID;
    inventoryAutomative.CreatedBY = localStorage.getItem('LoginID');
    inventoryAutomative.MakeID = this.InventoryAutomativeForm.get('Make').value;
    inventoryAutomative.ModelID = this.InventoryAutomativeForm.get('Model').value;
    inventoryAutomative.Year = this.InventoryAutomativeForm.get('Year').value;
    inventoryAutomative.Series = this.InventoryAutomativeForm.get('Series').value;
    inventoryAutomative.Engine = this.InventoryAutomativeForm.get('Engine').value;
    if (this.Mode == 'Add') {
      debugger;
      this.inventoryAutomative.addInventoryAutomotive(inventoryAutomative).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Automative details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInventoryAutomative();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindInventoryAutomative();
            this.Mode = 'Edit';
          }
          // this.ResetForm();
          // this.submitted = false;
          // this.BindInventoryAutomative();
          // this.Mode = 'List';

        }
        else {
          this.toastr.warning('Record already exists');
          // this.Mode = 'List';
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      inventoryAutomative.ID = this.InventoryAutomativeForm.get('ID').value;
      this.inventoryAutomative.UpdateInventoryAutomotive(inventoryAutomative).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory Automative details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindInventoryAutomative();
          }
          else {
            this.Edit(this.InventoryAutomativeForm.get('ID').value);
          }
          // this.ResetForm();
          // this.submitted = false;
          // this.BindInventoryAutomative();
          // // this.Mode = 'List';
        }
        else {
          alert(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }

  //To bind the data of Automative to the controls to edit/update.
  Edit(ID) {
    this.BindInventoryAutomativeByID(ID);
    this.Mode = 'Edit';
  }
  BindInventoryAutomativeByID(ID) {
    this.inventoryAutomative.getInventoryAutomotiveByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let automatives: any = new LbsInvInventoryAutomotive();
        automatives = resp.data.inventoryAutomative;
        debugger;
        let idd = automatives.id;
        this.InventoryAutomativeForm.patchValue({
          ID: idd,
          Make: automatives.makeID,
          Model: automatives.modelID,
          Series: automatives.series,
          Engine: automatives.engine,
          Year: automatives.year
        });
        this.InventoryAutomativeForm.patchValue({
          ID: idd
        });
        /* this.InventoryAutomativeForm.patchValue({
         // ID: automatives.id,
          Make: automatives.makeID,
          Model: automatives.modelID,
          Series: automatives.series,
          Engine: automatives.engine,
          Year: automatives.year
        }); */
        if (!automatives.deleted) {
          this.InventoryAutomativeForm.enable();
          this.IsActive = true;
        } else {
          this.InventoryAutomativeForm.disable();
          this.IsActive = false;
        }

        if (!this.IsInventoryActive) {
          this.InventoryAutomativeForm.disable();
        }
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }
  /* BindInventoryAutomativeByID(ID) {
    this.inventoryAutomative.getInventoryAutomotiveByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let automatives: any = new LbsInvInventoryAutomotive();
        automatives = resp.data.inventoryAutomative;
        debugger;
        this.InventoryAutomativeForm.patchValue({
          ID: automatives.id,
          Make: automatives.makeID,
          Model: automatives.modelID,
          Year: automatives.year,
          Series: automatives.series,
          Engine: automatives.engine,
        });
        if (!automatives.deleted) {
          this.InventoryAutomativeForm.enable();
          this.IsActive = true;
        } else {
          this.InventoryAutomativeForm.disable();
          this.IsActive = false;
        }
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  } */

  //Delete the record
  onDeleteChecked(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryAutomotive', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      //  this.toastr.success('Inventory deleted successfully')
      this.Mode = 'List';
      this.BindInventoryAutomative();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To create the Automative Form Controls.
  ResetForm() {
    this.InventoryAutomativeForm.patchValue({
      ID: '',
      Make: '-1',
      Model: '-1',
      Year: '-1',
      Series: '-1',
      Engine: '-1',
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

  onMakeChange($event) {
    let MakeID = $event;
    this.modellist = [];
    this.serieslist = [];
    this.EngineDetails = [];
    //this.yearlist=[];
    this.InventoryAutomativeForm.patchValue({
      // ID: '',
      Model: '-1',
      Year: '-1',
      Series: '-1',
      Engine: '-1',
    });
    if ($event != "-1") {
      this.Bindmakemodel(MakeID);
    }
  }

  onModelChange($event) {
    this.serieslist = [];
    this.EngineDetails = [];
    // this.yearlist=[];
    this.InventoryAutomativeForm.patchValue({
      ID: '',
      Year: '-1',
      Series: '-1',
      Engine: '-1',
    });
    let ModelID = $event;
    if ($event != "-1") {
      this.Bindseries(ModelID);
    }
  }

  onSeriesChange($event) {
    this.EngineDetails = [];
    // this.yearlist=[];
    this.InventoryAutomativeForm.patchValue({
      ID: '',
      Year: '-1',
      Engine: '-1',
    });
    let SeriesID = $event;
    if ($event != "-1") {
      this.BindEngine(SeriesID);
    }
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
