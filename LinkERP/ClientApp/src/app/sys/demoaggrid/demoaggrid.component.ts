import { Component, OnInit } from '@angular/core';
import { OrganisationMaintenanceService } from '../services/organisation-maintenance.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LBSSYSCompany } from 'src/app/models/sys/lbs-sys-company';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { SysCommonService } from '../services/sys-common.service';
import { PurchaseTemplateDetailService } from 'src/app/pur/services/purchase-template-detail.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
 
@Component({
  selector: 'app-demoaggrid',
  templateUrl: './demoaggrid.component.html',
  styleUrls: ['./demoaggrid.component.css']
})
export class DemoaggridComponent implements OnInit {
  gridApi;
  gridColumnApi;
  searchValue;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  organisations: any[] = [];
  imageSrc:any;students:any;
  UOMList:any;
  inventoryList:any;
  constructor(private organisationMaintenanceService: OrganisationMaintenanceService, private adjustmentdetailService: InventoryAdjustmentDetailService,private sysCommonService: SysCommonService,
    private purchaseTemplateService: PurchaseTemplateDetailService ){
  }

  ngOnInit() {
    this.AgLoad = false;
    this.BindInventoryAdjustmentDetail();
    this.BindInventoryDetail();
    this.BindUOM();
}
     
BindInventoryAdjustmentDetail() {
  this.AgLoad = false; 
  this.adjustmentdetailService.getInventoryAdjustmentDetailByAdjustmentID('0F5D640B-8114-4E0B-A3CB-BA5D6DF91979').subscribe((resp: any) => {

      console.log(resp.data.inventoryadjustmentdetail); 
    this.RowData = resp.data.inventoryadjustmentdetail;
    this.AgLoad = true;
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
} 
BindUOM() {
  this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
    this.UOMList = resp.data.tabledata;
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}

BindInventoryDetail() {
  this.AgLoad = false;
  this.purchaseTemplateService.getInventories().subscribe((resp: any) => {
    this.inventoryList = resp.data.inventory;
    //this.RowData = resp.data.inventory;
    this.AgLoad = true;
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}

  BindOrganisations() { 
    
    this.organisationMaintenanceService.getCompanies().subscribe((resp: any) => {
      this.RowData = resp.data.companies;
      this.AgLoad = true;
    
      console.log(this.RowData)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  } 
  OnActionClick(event: any) {
    var colId = event.column.getId();
    console.log('OnActionClick', colId, event.data);
  }
  onProductChange(id,i){
    debugger;
    this.AgLoad=false;
    let index = this.inventoryList.findIndex(c => c.id == id);
    this.RowData[i].productID=id;
    if(index>=0){
      this.RowData[i].uom=this.inventoryList[index].unitOfMeasureID;
    }
    this.AgLoad=true;

  }

  addnew() {
    this.AgLoad = false;
    let object = {
      'companyID': "f1164f06-2deb-49b8-b249-6b239b2cbf5f",
      'adjustmentID': "0f5d640b-8114-4e0b-a3cb-ba5d6df91979",
      'productID': "",
      'uom': "",
      'quantity':0,
      'inOut': true,
      'cost': 0,
      'productName': "",
      'adjustmentNo': "",
      'id': "",
      'createdBY': null,
      'dateCreated': "0001-01-01T00:00:00",
      'deleted': false,
      'deletedBy': null,
      'deleteDate': "0001-01-01T00:00:00",
      'deleteStatus': "Active"
    }
    this.RowData.push(object);

    this.AgLoad = true;
  }
  UpdateChanges(){
    this.adjustmentdetailService.UpdateInventoryAdjustmentDetailList(this.RowData).subscribe((resp: any) => { 
      console.log(resp.data.inventoryadjustmentdetail); 
    //this.RowData = resp.data.inventoryadjustmentdetail;
    this.BindInventoryAdjustmentDetail();
    this.AgLoad = true;
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
  }
}
