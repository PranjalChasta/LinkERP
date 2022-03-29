import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { SeriesService } from 'src/app/inv/services/series.service';
import { ToastrService } from 'ngx-toastr';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MakeService } from 'src/app/inv/services/make.service';
import { LBSINVEngine } from 'src/app/models/inv/lbs-inv-engine';
import { EngineService } from 'src/app/inv/services/engine.service';
import { MakeModelService } from 'src/app/inv/services/make-model.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { YearService } from 'src/app/inv/services/year.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.css']
})
export class EngineComponent implements OnInit {
  @Input() ModelID: any;
  @Input() MakeID: any;
  @Input() SelectedModelID: any;
  @Input() ISParentActive: boolean;
  @Input() IsModelActive: boolean;
  @Input() Delete_Access: any;
  EngineForm: FormGroup;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  yearlist: any[];
  submitted: any = false;
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');
  EngineDetailsByMakeId: any[] = [];
  makelist: any[] = [];
  modellist: any[] = [];
  serieslist: any[] = [];
  ModelByseries: any[] = [];
  Mode: any = 'List';
  IsActive: boolean;
  //permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  SelectedMakeID: any;
  PageSize: any;
  Currentpage: string;
  constructor(
    private cryptoAes: CryptoAes,
    private modelservice: MakeModelService,
    private engineservice: EngineService,
    private seriesservice: SeriesService,
    private syscommon: SysCommonService,
    private FB: FormBuilder,
    private MakeService: MakeService,
    private yearservice: YearService,
    private toastr: ToastrService) { }

  ngOnInit() {
    console.log(this.SelectedModelID);
    console.log(this.MakeID);
    this.AgLoad = false;
    this.CreateForm();
    this.AgGridColumns();
    this.SetPermissions();
    this.BindEngines();
    //this.BindEngineByMakeID();
    // this.Bindmake();
    this.BindYear();
    this.Currentpage = "0";
    this.PageSize = "50";
    this.BindModelBySeries(this.SelectedModelID);
    // this.Bindmakemodel();
    // this.Bindseries();
  }
  CreateForm() {
    this.EngineForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      MakeID: [this.MakeID],
      ModelID: [this.SelectedModelID],
      Series: ['-1', CustomValidators.notEqual('-1')],
      Engine: ['', Validators.required],
      Year: ['-1', CustomValidators.notEqual('-1')]
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
      { headerName: 'Year', field: 'name', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Series', field: 'seriesName', sortable: true, filter: true, },
      { headerName: 'Engine', field: 'engine', sortable: true, filter: true, },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      // { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      // //  { headerName: '', field: 'Save', cellRenderer: this.CustomSaveIconFunc, type: 'Action', hide: false},
      // { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFuncEngine, type: 'Action', hide: !this.Delete_Access }
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.Delete_Access }
    ];
  }
  SetPermissions() {
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
      this.EngineForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.EngineForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.EngineForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }


  }
  get f() { return this.EngineForm.controls; }
  Bindmake() {
    this.Loading = true;
    this.MakeService.getMake().subscribe((resp: any) => {
      this.makelist = resp.data.makedetails;
      console.log(this.makelist);
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Bindmakemodel() {
    this.Loading = true;
    this.modelservice.getmakemodel().subscribe((resp: any) => {
      this.modellist = resp.data.makemodellist;
      console.log(this.modellist);
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Bindseries() {
    this.Loading = true;
    this.seriesservice.getSeries().subscribe((resp: any) => {
      this.serieslist = resp.data.serieslist;
      console.log(this.serieslist);
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindEngineByMakeID() {
    debugger;
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.syscommon.getEngineIDDetails(this.MakeID, this.SelectedModelID).subscribe((resp: any) => {
      console.log(resp);
      this.EngineDetailsByMakeId = resp.data.engineDetailsByMakeId;
      this.RowData = resp.data.engineDetailsByMakeId;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindEngines() {
    debugger;
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.engineservice.getAllEngines(this.MakeID, this.SelectedModelID).subscribe((resp: any) => {
      this.RowData = resp.data.enginesdetails;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  /* FOR Aggird end */
  CustomDeleteIconFuncEngine(params): string {
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
  //add operation
  AddNew() {
    this.Mode = 'Add';
    this.IsActive = true;
    this.ResetForm();
    this.EngineForm.enable();
  }
  //cancel
  Cancel() {
    this.ResetForm();
    //this.BindEngineByMakeID();
    this.BindEngines();
    this.Mode = 'List';
  }
  ResetForm() {
    this.EngineForm.patchValue({
      ID: '',
      CompanyID: '-1',
      MakeID: this.MakeID,
      ModelID: '-1',
      Series: '-1',
      Engine: '',
      Year: '-1'
    });
    this.EngineForm.markAsUntouched();
    this.EngineForm.markAsPristine();
    this.submitted = false;

  }
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {
      // this.SelectedMakeID = event.data.makeID;
      this.AgEdit(event.data);
      this.onmodelbyseriesChange(event.data.modelID);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    } else if (colId == 'Save') {
      debugger;
      this.AgSave(event.data)
    }
  }
  Edit(ID): void {
    this.Mode = 'Edit';
    this.BindenginebyId(ID);

  }
  BindenginebyId(ID) {
    this.SelectedMakeID = this.MakeID;
    this.engineservice.getEngineByID(ID).subscribe((resp: any) => {
      let engine: any = new LBSINVEngine();
      engine = resp.data.makemodeldetailbyId;
      console.log(engine);
      this.EngineForm.patchValue({
        ID: engine.id,
        CompanyID: engine.companyID,
        MakeID: engine.makeDescription,
        ModelID: engine.modelID,
        Engine: engine.engine,
        Series: engine.series,
        Year: engine.year,
      });
      if (!engine.deleted) {
        this.EngineForm.enable();
        this.IsActive = true;
      } else {
        this.EngineForm.disable();
        this.IsActive = false;
      }
    },
      (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  AgEdit(event) {
    console.log(event);
    this.EngineForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      MakeID: event.makeDescription,
      ModelID: event.modelID,
      Engine: event.engine,
      Series: event.series,
      Year: event.year,
      ///Ratio: event.conversionRatio
    }); if (!event.deleted) {
      this.EngineForm.enable();
      this.IsActive = true;
    } else {
      this.EngineForm.disable();
      this.IsActive = false;
    }
    this.Mode = 'Edit';
  }

  OnCancel() {
    this.Cancel();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.EngineForm.invalid) {
      return;
    }
    let engine = new LBSINVEngine();
    engine.CompanyID = this.CompanyId;
    engine.MakeID = this.MakeID;
    engine.ModelID = this.SelectedModelID;
    engine.Series = this.EngineForm.get('Series').value;
    engine.Engine = this.EngineForm.get('Engine').value;
    engine.Year = this.EngineForm.get('Year').value;
    engine.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.engineservice.addEngine(engine).subscribe((resp: any) => {
        this.Loading = false;
        if (resp.isSuccess == true) {
          this.toastr.success('Engine Details added successfully')

          if (saveAction == 'Close') {
            this.Cancel();
            //this.BindEngineByMakeID();
            this.BindEngines();
            this.Mode = 'List';
          } else {
            this.SelectedMakeID = this.MakeID;
            this.Edit(resp.data.id);
            this.BindEngineByMakeID();
            this.Mode = 'Edit';
          }
        } else {
          this.toastr.warning('Engine name is already exist');
          this.Loading = false;
        }

      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });

    }
    else if (this.Mode == 'Edit') {
      engine.ID = this.EngineForm.get('ID').value;
      this.engineservice.updateEngine(engine).subscribe((resp: any) => {
        this.Loading = false;
        if (resp.isSuccess == true) {
          this.toastr.success('Engine Details updated successfully')

          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindEngines();
            //this.BindEngineByMakeID();
          }
          else {
            this.Edit(this.EngineForm.get('ID').value);
          }

        } else {
          this.toastr.warning('Engine name is already exist');
          this.Loading = false;
        }

      }, (error) => {
        //   console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  BindYear() {
    this.yearservice.getYear().subscribe((resp: any) => {
      console.log(resp);
      this.yearlist = resp.data.yeardetails;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AgSave(event) {
    console.log(event);
    let enginedetails = new LBSINVEngine();
    enginedetails.ID = event.id;
    enginedetails.CompanyID = event.companyID;
    enginedetails.MakeID = event.makeID;
    enginedetails.ModelID = event.modelID;
    enginedetails.Series = event.series;
    enginedetails.Engine = event.engine;
    this.engineservice.updateEngine(enginedetails).subscribe((resp: any) => {
      this.toastr.success('Make-model Details updated successfully')
      {
        //this.ResetForm();
        //this.BindEngineByMakeID();
        this.BindEngines();
        this.Mode = 'List';
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  onDeleteChecked(ID) {
    //this.Loading = true;
    this.MakeService.deleteMakeByID(ID, 'LBS_INV_Engine', localStorage.getItem('LoginID')).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        //this.BindEngineByMakeID();
        this.BindEngines();
      }
      //this.Loading = false;
    }, (error) => {
      //this.Loading = false;
    });
  }
  onmodelbyseriesChange($event) {
    let ModelId = $event;
    if ($event != "-1") {

      this.BindModelBySeries(ModelId);
    }
  }
  BindModelBySeries(ModelId) {
    this.Loading = true;
    this.modelservice.getmodelBySeries(ModelId).subscribe((resp: any) => {
      console.log(resp);
      this.ModelByseries = resp.data.modelbyseries;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });

  }

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}
