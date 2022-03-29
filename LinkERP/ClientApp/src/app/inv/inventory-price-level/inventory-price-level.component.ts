import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryPriceLevelService } from '../services/inventory-price-level.service';
import { LBSINVInventoryPriceLevel } from 'src/app/models/inv/lbs-inv-inventory-price-level';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';

@Component({
  selector: 'app-inventory-price-level',
  templateUrl: './inventory-price-level.component.html',
  styleUrls: ['./inventory-price-level.component.css']
})
export class InventoryPriceLevelComponent implements OnInit {
  InventoryLevelForm: FormGroup;
  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  submitted: boolean;
  Loading: any = false;
  CompanyId=localStorage.getItem('CompanyID');
  inventorylevel: any;
  read_Access:boolean;
  write_Access:boolean;
  delete_Access:boolean;
  all_Access:boolean;
  AccessTab:string;
  HeaderNames:any;
  SelectedPrice: any;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(
    private InvetoryPriceLevelFB: FormBuilder,
    private inventoryPriceLevelService: InventoryPriceLevelService,
    private toastr: ToastrService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.AccessTab='Price';
    this.HeaderNames='Price';
    this.BindInventoryPriceLevel();
    this.PageSize = "50";
    this.InventoryLevelForm = this.InvetoryPriceLevelFB.group({
      ID: [''],
      PriceLevel: ['',Validators.required],
      Description: [''],
    });
    this.Currentpage = "0";
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Price Level', field: 'priceLevel', sortable: true, filter: true, cellStyle: { textAlign: 'left' },},
      { headerName: 'Description', field: 'description', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
     // { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false },    
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
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "203");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryLevelForm .enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryLevelForm .disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryLevelForm .disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  get f() { return this.InventoryLevelForm.controls; }

  BindInventoryPriceLevel()
  {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.inventoryPriceLevelService.getInventoryPriceLevel().subscribe((resp: any) => {      
     this.inventorylevel = resp.data.inventoryPriceLevel;
     this.RowData = resp.data.inventoryPriceLevel;
     
     this.AgLoad = true; 
     this.Loading = false; 
   }, (error) => {
     console.error('Problem with the sevice. Please try later : ' + error);
   });
  }

  AddNew(): void {
    this.Mode = 'Add';
    this.InventoryLevelForm.get('PriceLevel').enable();
    this.IsActive = true;
  }

  Edit(ID): void {
   this.BindInventoryPriceLevelByID(ID);
    this.Mode = 'Edit';
  }

  BindInventoryPriceLevelByID(ID) {
    this.inventoryPriceLevelService.getInventoryPriceLevelByID(ID).subscribe((resp: any) => {      
      if (resp.isSuccess == true) {
        let inventorys: any = new LBSINVInventoryPriceLevel();
        inventorys = resp.data.inventoryPriceLevel;
        this.InventoryLevelForm.patchValue({
          ID: inventorys.id,
          PriceLevel: inventorys.priceLevel,
          Description: inventorys.description,         
        });
        if (!inventorys.deleted) {
          this.InventoryLevelForm.enable();
          this.IsActive = true;
        } else {
          this.InventoryLevelForm.disable();
          this.IsActive = false;
        }
        this.InventoryLevelForm.get('PriceLevel').disable();
      }
    });
  }

  Cancel(): void {
    this.ResetForm();
    this.BindInventoryPriceLevel();
    this.Mode = "List";
  }

  //To save the State details to database table by calling the API service
onSave(saveAction) {  
  debugger;
  this.submitted = true;
  if (this.InventoryLevelForm.invalid) {
    return;
  }
  this.Loading = true;
  let inventory= new LBSINVInventoryPriceLevel();
  inventory.PriceLevel = this.InventoryLevelForm.get('PriceLevel').value;
  inventory.Description= this.InventoryLevelForm.get('Description').value;
  inventory.CreatedBY = localStorage.getItem('LoginID');
  inventory.CompanyID = this.CompanyId;

  if (this.Mode == 'Add') {
    this.inventoryPriceLevelService.addInventoryPriceLevel(inventory).subscribe((resp: any) => {
      if (resp.isSuccess) {       
        this.toastr.success('InventoryPriceLevel details saved successfully');
        this.ResetForm();
        this.BindInventoryPriceLevel();
        this.Mode = 'List';
        this.Loading = false;        
      }
    }
    );
  }
  else if (this.Mode == 'Edit') {
    inventory.ID = this.InventoryLevelForm.get('ID').value;
    this.inventoryPriceLevelService.updateInventoryPriceLevel(inventory).subscribe((resp: any) => {
      if (resp.isSuccess) {
        if (saveAction == 'Close') {
          this.Cancel(); 
          this.ResetForm();
          
          this.Mode = 'List';

        } else {
          let ID=this.InventoryLevelForm.get('ID').value;
          this.ResetForm();
          this.BindInventoryPriceLevelByID(ID);
        }
        this.toastr.success('InventoryPriceLevel details updated successfully');
        this.Loading = false;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
  OnActionClick(event: any) {    
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedPrice=event.data.id;
      this.Edit(event.data.id)
    } else if (colId == 'Delete') {
       this.onDeleteChecked(event.data.id)
    }
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
  ResetForm() {
    this.InventoryLevelForm.patchValue({
      ID: '',
      PriceLevel: '',
      Description: '',
    });
  }

  //Delete the record
onDeleteChecked(ID) {
  this.Loading = true;
  this.inventoryPriceLevelService.deleteInventoryPriceLevelByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {    
    if (resp.isSuccess == true) {
      this.BindInventoryPriceLevel();
    }
    this.Loading = false;
  }, (error) => {
    this.Loading = false;
    // console.error('Problem with the sevice. Please try later : ' + error.message);
  });
}

}
