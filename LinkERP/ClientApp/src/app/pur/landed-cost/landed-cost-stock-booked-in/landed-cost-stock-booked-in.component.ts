import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LandedCostShipmentBookingService } from '../../services/landed-cost-shipment-booking.service';

@Component({
  selector: 'app-landed-cost-stock-booked-in',
  templateUrl: './landed-cost-stock-booked-in.component.html',
  styleUrls: ['./landed-cost-stock-booked-in.component.css']
})
export class LandedCostStockBookedInComponent implements OnInit {
  @Input() CostID;
  @Input() WarehouseLocation;
  @Output() cancleButtonClick = new EventEmitter();
  stockBookedIn: any;
  displayStockList: boolean;
  constructor(
    private toastr: ToastrService,
    private landedCostBookingService: LandedCostShipmentBookingService,
  ) { }

  ngOnInit() {
    this.GetLandedCostBooking();
  }
  
  GetLandedCostBooking() {
    this.landedCostBookingService.getLandedCostShipmentBookingByCostID(this.CostID).subscribe((resp: any) => {
      this.stockBookedIn = resp.data.landedcostBooking;
      this.displayStockList=true;
      console.log(this.stockBookedIn);
      
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancel(){
    this.cancleButtonClick.emit();
  }
}
