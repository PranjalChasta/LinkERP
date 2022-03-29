import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryProductPriceService } from '../../services/inventory-product-price.service';
import { LBSINVInventoryProductPrice } from 'src/app/models/inv/lbs-inv-inventory-product-price';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';

@Component({
  selector: 'app-inventory-product-price',
  templateUrl: './inventory-product-price.component.html',
  styleUrls: ['./inventory-product-price.component.css']
})
export class InventoryProductPriceComponent implements OnInit {
  @Input() InventryID: any;
  @Input() IsInventoryActive: boolean;
  Loading: any = false;
  InventoryProductPriceForm: FormGroup;
  @Output() onModeChange = new EventEmitter<any>();
  Mode: any = 'List';
  Submitted: any = false;
  BindInventoryProductPrice: any[] = [];
  AgLoad: boolean = false;
  CompanyId = localStorage.getItem('CompanyID');
  addreadonly: boolean;
  ProductPriceID: any;
  AccessTab:any;
  
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;

  constructor(private productservice: InventoryProductPriceService, private deleteRecordsService: DeleteRecordsService
    , private toastr: ToastrService,private cryptoAes: CryptoAes,
    private FB: FormBuilder) { }

  ngOnInit() {
  // this.AccessTab="price";
    this.BindInventoryProductPriceDetails();
  }
  

  BindInventoryProductPriceDetails() {
    this.Mode = "List";
    this.AgLoad = false;
    this.BindInventoryProductPrice = [];
    this.ProductPriceID ="";
    this.productservice.getInventoryProductPriceByInventryID(this.InventryID).subscribe((resp: any) => {
      console.log(resp);
      this.BindInventoryProductPrice = resp.data.inventorydetails[0];
      if (this.BindInventoryProductPrice) { 
        this.ProductPriceID = resp.data.inventorydetails[0].id;
      }
     // this.RowData = resp.data.inventorydetails;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
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
  
  
  
  Edit(ID) {
    
    this.productservice.getInventoryProductPriceByID(ID).subscribe((resp: any) => {
      console.log(resp);
      debugger;
      let rates: any = new LBSINVInventoryProductPrice();
      rates = resp.data.inventorydetails;
      this.InventoryProductPriceForm.patchValue({
        ID: rates.id,
        PriceLevel1: rates.priceLevel1_text,
        PriceLevel2: rates.priceLevel2_text,
        PriceLevel3: rates.priceLevel3_text,
        PriceLevel4: rates.priceLevel4_text,
        PriceLevel5: rates.priceLevel5_text,
        PriceLevel6: rates.priceLevel6_text,
        PriceLevel7: rates.priceLevel7_text,
        PriceLevel8: rates.priceLevel8_text,
        PriceLevel9: rates.priceLevel9_text,
        PriceLevel10: rates.priceLevel10_text,
        EnablCostPlusMarkup: rates.enablCostPlusMarkup,
        Percentage: rates.markupPercentage_text,
        PromotionType: rates.promotionType,
        Days: rates.promotionDays,
        PromotionDateFrom: rates.promotionDateFrom,
        PromotionDateTo: rates.promotionDateTo,
        PromotionTimeFrom: rates.promotionTimeFrom,
        PromotionTimeTo: rates.promotionTimeTo,
        Price: rates.promotionalPrice_text,
        QuantityBreak1: rates.quantityBreak1_text,
        QuantityBreak2: rates.quantityBreak2_text,
        QuantityBreak3: rates.quantityBreak3_text,
        QuantityBreak4: rates.quantityBreak4_text,
        QuantityBreak5: rates.quantityBreak5_text,
        PriceBreak1: rates.priceBreak1_text,
        PriceBreak2: rates.priceBreak2_text,
        PriceBreak3: rates.priceBreak3_text,
        PriceBreak4: rates.priceBreak4_text,
        PriceBreak5: rates.priceBreak5_text
      });
      this.Mode = 'Edit';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  OnDeletePrice(ID) {
    
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryProductPrice', localStorage.getItem('LoginID')).subscribe((resp: any) => {
     // this.toastr.success('Currency  details deleted successfully');
      this.BindInventoryProductPriceDetails();
      //this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  OnCancelPrice() {
    this.OnModeChanged();
  }
  OnAddPrice(InventoryProductPrice) {
    debugger;
    let _InventoryProductPrice = new LBSINVInventoryProductPrice();
    _InventoryProductPrice=InventoryProductPrice;
    _InventoryProductPrice.CompanyID = this.CompanyId;
    _InventoryProductPrice.ProductID = this.InventryID  
    if (this.ProductPriceID) {
      _InventoryProductPrice.ID=this.ProductPriceID;
      this.productservice.updateInventoryProductPrice(_InventoryProductPrice).subscribe((resp: any) => {

        this.toastr.success('Inventories updated successfully')
        {
          // this.ResetForm(); 
          this.BindInventoryProductPriceDetails();
          this.Mode = 'List';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    } else {

      
      this.productservice.addInventoryProductPrice(_InventoryProductPrice).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(' Inventory details added successfully');
          // alert(resp.message);
          //this.ResetForm();
          this.BindInventoryProductPriceDetails();
          this.Mode = 'List';
          this.Loading = false;
        }
        else {
          alert(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  OnModeChanged() {
    this.onModeChange.emit('List');
  }
  Back() {
    this.OnModeChanged();
  }
}
