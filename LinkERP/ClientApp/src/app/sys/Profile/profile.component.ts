import { Component, Input, OnInit, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProfileService } from '../services/profile.service';

declare const openCity: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private countryService: ProfileService,private countryStateService:ProfileService,private countryCityService:ProfileService) {  }
display = "none";
newPrivatedatamodel:any=[];
newServicemodel:any=[];
Countries:any=[];
CountryStates:any=[];
StateCity:any=[];
CountryDetails:any;
StateDetails:any;
CityDetails:any;


  ngOnInit() {
    
      this.countryService.getcheckboxcountries().subscribe((resp:any)=>{
        this.Countries=resp.data.countriescheck; 
      });

      
  }
  onClick() {
    openCity();
  }
  onOptionsSelectedCountry(value:any){
    debugger
    console.log("the selected value is " + value);  
      this.CountryDetails=this.newPrivatedatamodel.CountryDetails;
      this.newPrivatedatamodel.CountryName = this.CountryDetails.name;
      console.log(this.CountryDetails);
    

     this.countryStateService.getStateByCountryID(this.CountryDetails.countryID).subscribe((resp: any) => {
      this.CountryStates = resp.data.countrystates;
      
     });
 
  }
  onOptionsSelectedState(value:any){
    console.log("the selected value is " + value);  
      this.StateDetails=this.newPrivatedatamodel.StateDetails;
      this.newPrivatedatamodel.StateName = this.StateDetails.name;
      console.log(this.StateDetails);

    debugger
    this.countryCityService.getCityByStateID(this.StateDetails.stateID).subscribe((resp:any)=>{
      this.StateCity=resp.data.citydetails;
      console.log(this.StateCity);
    });

  }
  onOptionsSelecteCity(value:any){
    console.log("the selected value is " + value);  
    this.CityDetails=this.newPrivatedatamodel.CityDetails;
    this.newPrivatedatamodel.CityName = this.CityDetails.name;
    console.log(this.CityDetails);

  }
  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }
  onSave(f: NgForm){
    // console.log("hii");
    debugger
    this.display = "none";
    this.newPrivatedatamodel.comment=f.value;
    console.log(this.newPrivatedatamodel.comment);
    this.display = "none";
   

  }
  
  resetform(){
    this.newPrivatedatamodel=[];
    this.newServicemodel=[];
  }  

  dataprivate(){
    debugger
    console.log("from private model=",this.newPrivatedatamodel);
    this.resetform();
  }
  dataservice(){
    console.log("from service model=",this.newServicemodel);
    this.resetform();
  }

}
