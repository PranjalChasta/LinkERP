import { Component, Input, OnInit } from '@angular/core';
import { ARServicesService } from '../../../Services/arservices.service';

@Component({
  selector: 'app-previous-tranction',
  templateUrl: './previous-tranction.component.html',
  styleUrls: ['./previous-tranction.component.css']
})
export class PreviousTranctionComponent implements OnInit {

  constructor(private aRServicesService:ARServicesService) { }
  @Input() ReceiptDetailID:any;
  PreviousTranction:any[]=[];
  ngOnInit() {
    this.Getprevioustranction();
  }
  Getprevioustranction()
  {
    this.aRServicesService.getprevioustranction(this.ReceiptDetailID).subscribe((resp: any) => {
   //this.CurrentShiftID=resp.data.id;
  //  this.CurrentShiftNo=resp.data.shiftNo;
  this.PreviousTranction=resp.data.receipt;
  console.log(resp.data.receipt)
   console.log(resp)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
