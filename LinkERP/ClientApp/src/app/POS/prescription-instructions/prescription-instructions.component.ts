import { Component, OnInit } from '@angular/core';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LBS_SOP_PrescriptionInstructions } from 'src/app/models/pos/LBS_SOP_PrescriptionInstructions';
import { PrescriptionInstructionsService } from '../services/prescription-instructions';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { TableDataService } from 'src/app/sys/services/table-data.service';

@Component({
  selector: 'app-prescription-instructions',
  templateUrl: './prescription-instructions.component.html',
  styleUrls: ['./prescription-instructions.component.css']
})
export class PrescriptionInstructionsComponent implements OnInit {
  UOMList: any[] = [];
  Loading: any = false;
  InstructionForm: FormGroup;
  Mode: any = 'List';
  submitted: any = false;
  IsActive: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any;
  AccessTab: any;
  HeaderNames: any;
  AgLoad: boolean = false
  Instructions: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  Currentpage: string;
  selectedgroup;
  SelectedID;
  constructor(
    private syscommonservice: SysCommonService,
    private toastr: ToastrService,
    private FB: FormBuilder,
    private prescriptionInstructionsService: PrescriptionInstructionsService,
    private cryptoAes: CryptoAes,
    private deleteservice: DeleteRecordsService,
    private tabledataservice: TableDataService,
  ) { }

  ngOnInit() {
   
    this.CreateForm();
    //this.BindPrescriptionInstructions();
    this.SetPermissions();
    this.AgGridColumns();
    this.BindInstructionTypes();
    this.Currentpage = "0";
    this.PageSize = "50";
  }
  get f() { return this.InstructionForm.controls; }
  BindInstructionTypes() {
    this.InstructionForm.get('InstructionGroup').enable();
    this.syscommonservice.getLookupByID(GenricTableIDByName.LBS_SOP_Instruction_Types).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CreateForm() {
    this.InstructionForm = this.FB.group({
      ID: [''],
      InstructionGroup: ['-1'],
      InstructionCode: ['', Validators.required],
      InstructionDescription: ['', Validators.required],
    })
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InstructionForm.enable();


      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InstructionForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InstructionForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Instruction Code', field: 'instructionCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Instruction Description', field: 'instructionDescription', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false, }
    ];
  }
  AddNew() {
    this.InstructionForm.enable();
    this.Mode = 'Add';
    this.IsActive = true;
  }
  Cancel() {
    this.InstructionForm.get('InstructionGroup').enable();
    this.Mode = 'List'; 
    this.InstructionForm.patchValue({
      ID: '',
      InstructionGroup: this.SelectedID,
      InstructionCode: '',
      InstructionDescription: ''
    });
    this.InstructionForm.markAsUntouched();
    this.InstructionForm.markAsPristine();
    this.submitted = false;
    this.BindInstructionTypesByID(this.SelectedID);
   // this.BindPrescriptionInstructions();
  }
 

  ResetForm() {
    this.InstructionForm.patchValue({
      ID: '',
      InstructionGroup: '-1',
      InstructionCode: '',
      InstructionDescription: ''
    });
    this.InstructionForm.markAsUntouched();
    this.InstructionForm.markAsPristine();
    this.submitted = false;
  }

  onTableChange(event) {
    console.log(event);
    if (event == "-1") {
      this.AgLoad = false;
      this.SelectedID = null;
      this.RowData = [];
    } else {
     // this.InstructionForm.get('InstructionGroup').enable();
      this.BindInstructionTypesByID(event)
     
    }

  }

  BindInstructionTypesByID(InstructionType) {
    this.SelectedID = InstructionType;
    this.AgGridColumns();
    this.AgLoad = false;
    this.prescriptionInstructionsService.getInstructionTypesByID(InstructionType).subscribe((resp: any) => {
      console.log(resp.data);
      this.RowData = resp.data.tabledata;
      this.InstructionForm.get('InstructionGroup').enable();
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindPrescriptionInstructions() {
    debugger
    this.AgLoad = false;
    this.Mode = "List";
    this.prescriptionInstructionsService.getPrescriptionInstructions().subscribe((resp: any) => {
      console.log(resp);
      this.Instructions = resp.data.instructions;
      this.RowData = resp.data.instructions;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Edit(ID): void {
    this.Mode = 'Edit';
    //this.InstructionForm.get('InstructionGroup').enable();
    this.BindInstructionsByID(ID);
  }
  BindInstructionsByID(ID) {
    this.prescriptionInstructionsService.getPrescriptionInstructionsByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let instructions: any = new LBS_SOP_PrescriptionInstructions();
        instructions = resp.data.instructions;

        this.InstructionForm.patchValue({
          ID: instructions.id,
          InstructionGroup: instructions.instructionGroup,
          InstructionCode: instructions.instructionCode,
          InstructionDescription: instructions.instructionDescription
         

        });
        if (!instructions.deleted) {
          this.InstructionForm.enable();
          this.IsActive = true;
        } else {
          //this.InstructionForm.get('InstructionGroup').enable();
          this.InstructionForm.disable();
          this.IsActive = false;
        }
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.InstructionForm.invalid) {
      return;
    }
    this.Loading = true;
    let instruction = new LBS_SOP_PrescriptionInstructions();
    instruction.CompanyID = this.CompanyID;
    instruction.InstructionGroup = this.InstructionForm.get('InstructionGroup').value;
    instruction.InstructionCode = this.InstructionForm.get('InstructionCode').value;
    instruction.InstructionDescription = this.InstructionForm.get('InstructionDescription').value;
    instruction.CreatedBY = localStorage.getItem('LoginID');
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      debugger;
      this.prescriptionInstructionsService.addPrescriptionInstructions(instruction).subscribe((resp: any) => {
        debugger;
        if (resp.isSuccess) {
          this.toastr.success('Prescription instructions  added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            //this.ResetForm();
          }
          else {
            let ID = resp.data.id;
            this.Edit(ID);
            this.BindInstructionTypesByID(this.SelectedID);
            //this.BindPrescriptionInstructions();
            this.Mode = 'Edit';
 

          }

          this.Loading = false;
          //this.ResetForm();
        }
        
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      debugger;
      instruction.ID = this.InstructionForm.get('ID').value;
      this.prescriptionInstructionsService.updatePrescriptionInstructions(instruction).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Prescription instructions  updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
           // this.ResetForm();
           // this.BindPrescriptionInstructions();
            this.BindInstructionTypesByID(this.SelectedID);
          }
          else {
            let ID = this.InstructionForm.get('ID').value;
            this.Edit(ID);
          }
        }
       
      }, (error) => {
        //console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
    } else if (colId == 'Delete') {
      debugger;
      this.onDeleteChecked(event.data.id)
    }
  }
  onDeleteChecked(ID) {
    this.deleteservice.deleteRecordsBYID(ID, 'LBS_SOP_PrescriptionInstructions', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInstructionTypesByID(this.SelectedID);
      //this.BindPrescriptionInstructions();
      //this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
