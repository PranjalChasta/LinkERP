import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { MakeModelService } from 'src/app/inv/services/make-model.service';
import { ToastrService } from 'ngx-toastr';
import { MakeService } from 'src/app/inv/services/make.service';
import { LBSINVMakeMode } from 'src/app/models/inv/lbs-inv-make-mode';
import { Router } from '@angular/router';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-make-model',
  templateUrl: './make-model.component.html',
  styleUrls: ['./make-model.component.css']
})
export class MakeModelComponent implements OnInit {
  @Input() MakeID: any;
  @Output() onModeChange = new EventEmitter<any>();
  @Input() MakeName: any;
  @Input() ISParentActive:boolean;
  submitted: any = false;
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');
  Mode: any = 'List';
  MakeModelForm: FormGroup;
  AccessTab: string;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  MakeModelDetails: any[] = [];
  makelist: any[] = [];
  SelectedMakeID: any;
  SelectedModelID: any;
  read: boolean;
  LineEditField: string;
  //permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(private cryptoAes: CryptoAes, private modelservice: MakeModelService, private router: Router,
    private syscommon: SysCommonService, private FB: FormBuilder,
    private MakeService: MakeService, private toastr: ToastrService, ) { }

  ngOnInit() {
    console.log(this.SelectedModelID);
    this.AgLoad = false;
    this.AccessTab = "MakeModel";
    this.CreateForm();
    this.read = true;
    this.SetPermissions();
    this.AgGridColumns();
    this.BindMakeModelByMakeID();
    this.Bindmake();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  CreateForm() {
    this.MakeModelForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      // MakeID: ['-1'],
      ModelDescription: ['', Validators.required]
    })
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Model', field: 'modelDescription', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "209");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      //  this.MakeModelForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          //  this.MakeModelForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      // this.MakeModelForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }


  }
  get f() { return this.MakeModelForm.controls; }
  /* FOR Aggird end */
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  CustomSaveIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-save"></i></div>';
    return cellContent
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomPriceIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-usd"></i></div>';
    return cellContent
  }

  BindMakeModelByMakeID() {
    debugger;
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.syscommon.getMakeDetails(this.MakeID).subscribe((resp: any) => {
      console.log(resp);
      this.MakeModelDetails = resp.data.makemodeldetails;
      this.RowData = resp.data.makemodeldetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //add operation
  AddNew(): void {
    this.Mode = 'Add';
    this.ResetForm();
    this.IsActive = true;
    this.MakeModelForm.enable();
  }

  OnSaveall() {
    debugger;
    this.MakeService.updateModelDetails(this.RowData).subscribe((resp: any) => {
      console.log(resp);
      if (!resp.isSuccess) {
        this.toastr.warning(resp.message);
        this.BindMakeModelByMakeID();
      } else {
        this.toastr.success('Model added successfully');
        this.BindMakeModelByMakeID();
        // this.AgSave(this.SelectedWorkflowID);
        this.Mode = 'List';
      }

    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CancelNew() {
    debugger;
    this.BindMakeModelByMakeID();
    this.Mode = 'List';
  }
  //cancel
  Cancel() {
    this.ResetForm();
    this.BindMakeModelByMakeID();
    this.submitted = false;
    this.Mode = 'List';
  }
  Cancelmodel() {
    this.BindMakeModelByMakeID();
    this.submitted = false;
    this.Mode = 'List';
  }
  AgEdit(event) {
    debugger;
    this.MakeModelForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      MakeID: event.makeID,
      ModelDescription: event.modelDescription
    });
    // if (!event.deleted) {
    //   this.MakeModelForm.enable();
    //   this.IsActive = true;
    // } else {
    //   this.MakeModelForm.disable();
    //   this.IsActive = false;
    // }
    // this.Mode = 'Edit';
  }
  OnActionClick(event: any) {
    console.log(event);
    var colId = event.column.getId();
    if (colId == 'Edit') {
      //  this.SelectedModelID = event.data.id;
      //  this.SelectedMakeID = event.data.makeID;
      this.Edit(event.data.id);
      this.SelectedMakeID = event.data.makeID;
      this.SelectedModelID=event.data.id;
console.log(this.SelectedModelID);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    } else if (colId == 'Price') {
      this.MakeID = event.data.makeID;
      this.Mode = 'Price'
      if (!event.data.deleted) {
        this.IsActive = true;
      } else {
        this.IsActive = false;
      }
    }
  }
  Edit(ID): void {

    this.Mode = 'Edit';
    this.BindmakeModelById(ID);

  }

  BindmakeModelById(ID) {
    debugger;
    this.SelectedMakeID=this.MakeID;
    this.SelectedModelID=ID;
    this.modelservice.getMakeModelByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let model: any = new LBSINVMakeMode();
        model = resp.data.makemodeldetailbyId;
        this.MakeModelForm.patchValue({
          ID: model.id,
          CompanyID: model.companyID,
          MakeID: model.makeID,
          ModelDescription: model.modelDescription
        });
        if (!model.deleted && this.ISParentActive) {
          this.MakeModelForm.enable();
          this.IsActive = true;
        } else {
          this.MakeModelForm.disable();
          this.IsActive = false;
        }
       
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  // MakeName: any;
  Bindmake() {
    this.Loading = true;
    this.MakeService.getMake().subscribe((resp: any) => {
      this.makelist = resp.data.makedetails;

      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Bindmakebyid(id) {
    debugger;
    // this.Loading = true;
    this.MakeService.getMakeByID(id).subscribe((resp: any) => {
      this.makelist = resp.data.makedetailbyId;
      console.log(this.makelist);
      // this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // OnCancel() {
  //   this.Cancel();
  //   this.Mode = 'Add';
  // }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.MakeModelForm.invalid) {
      return;
    }
    let model = new LBSINVMakeMode();
    model.CompanyID = this.CompanyId;
    model.MakeID = this.MakeID;
    model.ModelDescription = this.MakeModelForm.get('ModelDescription').value;
    model.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      debugger;
      this.modelservice.addMakeModel(model).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Make-Model Details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindMakeModelByMakeID();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindMakeModelByMakeID();
            this.Mode = 'Edit';
          }
          // this.BindMakeModelByMakeID();
          // this.Mode = 'List';
          this.Loading = false;
        }
        else {
          this.toastr.warning("Model description is already  exist");
          this.Loading = false;
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });

    }
    else if (this.Mode == 'Edit') {
      debugger;
      model.ID = this.MakeModelForm.get('ID').value;
      this.modelservice.updateMakeModel(model).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Make-Model Details updated successfully');
      
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindMakeModelByMakeID();
          }
          else {
            this.Edit(this.MakeModelForm.get('ID').value);
          }
        }
        else {
          this.toastr.warning("Model description is already  exist");

        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }

  }



  ResetForm() {
   // this.MakeName = '';
    this.MakeModelForm.patchValue({
      ID: '',
      MakeID: '',
      ModelDescription: ''
    });

  }
  onDeleteChecked(ID) {
    //this.Loading = true;
    this.MakeService.deleteMakeByID(ID, 'LBS_INV_MakeModel', localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        this.BindMakeModelByMakeID();
      }
      //this.Loading = false;
    }, (error) => {
      //this.Loading = false;
    });
  }

  OnModeChanged() {
    this.onModeChange.emit('List');
  }
  Back() {
    this.OnModeChanged();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}


