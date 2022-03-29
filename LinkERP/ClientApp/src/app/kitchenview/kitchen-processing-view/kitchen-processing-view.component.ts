import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KitchenviewService } from '../kitchenview.service';
@Component({
  selector: 'app-kitchen-processing-view',
  templateUrl: './kitchen-processing-view.component.html',
  styleUrls: ['./kitchen-processing-view.component.css']
})
export class KitchenProcessingViewComponent implements OnInit {
  AgLoad: any;
  Loading: any;
  RowData: any;
  ColumnDefs: any;
  Mode: any = 'List';
  submitted: boolean; 
  CompanyId = localStorage.getItem('CompanyID');
 
  KitchenProcessingForm: FormGroup;
  constructor(
    private kitchenviewService: KitchenviewService
  ) { }
  ngOnInit() {
    //this.getKitchenProccessingView();
    this.getReadyOrders();
    this.AgGridColumns();
    this.getNewOrders();
     this.AgGridCols();
    this.getProgressOrders();
   
   
    this.AgGridColss();
    this.AgLoad = false;
    this.Mode = "List";
  }
  refreshPage() {
    this.KitchenProcessingForm.reset();
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'New Orders', field: 'new', sortable: true, filter: true, checkboxSelection: false, },
     // { headerName: 'Processing', field: 'status', sortable: true, filter: true },
    ];
  }
  ColumnDefss: any;
  AgGridCols() {
    this.ColumnDefss = [
      { headerName: 'Processing', field: 'inProgress', sortable: true, filter: true, checkboxSelection: false, },
      // { headerName: 'Processing', field: 'status', sortable: true, filter: true },
    ];
  }
  ColumnDefsss: any;
  AgGridColss() {
    this.ColumnDefss = [
      { headerName: 'Ready', field: 'ready', sortable: true, filter: true, checkboxSelection: false, },
      // { headerName: 'Processing', field: 'status', sortable: true, filter: true },
    ];
  }
  
  //Kitchen: any;
  //getKitchenProccessingView() {
  
  //  this.Loading = true;
  //  this.AgLoad = false;
  //  this.kitchenviewService.getKitchenProcessingView().subscribe((resp: any) => {     
  //    this.RowData = resp.data.kitchen;
  //    this.Kitchen = resp.data.kitchen;
  //    this.AgLoad = true;
  //    this.Loading = false;
  //    this.refreshPage();
  //  }, (error) => {
  //    this.Loading = false;
  //    console.error('Problem with the sevice. Please try later : ' + error);
  //  });
  //}
  Kitchens: any;
  ReadyOrders: any;
  getReadyOrders() {
    this.Loading = true;
    this.AgLoad = false;
    this.kitchenviewService.getReadyOrders().subscribe((resp: any) => {
      this.ReadyOrders = resp.data.kitchen;
      this.Kitchens = resp.data.kitchen;
      this.AgLoad = true;
      this.Loading = false;
      this.refreshPage();
    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  New: any;
  NewOrders: any;
  getNewOrders() {
    this.Loading = true;
    this.AgLoad = false;
    this.kitchenviewService.getNewOrders().subscribe((resp: any) => {
      this.NewOrders = resp.data.kitchen;
      this.New = resp.data.kitchen;
      this.AgLoad = true;
      this.Loading = false;
      this.refreshPage();
    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Progress: any;
  ProcessingOrders: any;
  getProgressOrders() {
    this.Loading = true;
    this.AgLoad = false;
    this.kitchenviewService.getProgressOrders().subscribe((resp: any) => {
      this.ProcessingOrders = resp.data.kitchen;
      this.Progress = resp.data.kitchen;
      this.AgLoad = true;
      this.Loading = false;
      this.refreshPage();
    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
