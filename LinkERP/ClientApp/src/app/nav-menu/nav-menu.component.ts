import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { CryptoAes } from '../directives/crypto-aes';


//import * as $ from 'jquery';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  SelectedCompany: any;
  SystemSettingsSubMenu: any = false;
  InventorySubMenu: any = false;
  posSubMenu: any = false;
  PurchaseSubMenu: any = false;
  DocSubMenu: any = false;
  ACRSubMenu: any = false;
  MenuPermissions: any;
  ModulePermissions: any;
  CompanyPermissions: any;
  IsSYS: boolean = false;
  IsINV: boolean = false;
  IsPUR: boolean = false;
  IsPOS: boolean = false;
  IsDoc: boolean = false;
  IsAcr: boolean = false;
  IsKitchen: boolean = false;
  imageSrc: any;
  SelectedCompanyName;
  constructor(private router: Router, private accountService: AccountService, private cryptoAes: CryptoAes) {

  }
  LoginName: any;
  ngOnInit() {
    this.LoginName = localStorage.getItem('LoginName');
    if (localStorage.getItem('LoginAvator')) {
      this.imageSrc = 'data:image/jpeg;base64,' + localStorage.getItem('LoginAvator');
    } else {
      this.imageSrc = 'assets/images/avtar.png'
    }

    this.Getpermissions();
    /* if (localStorage.getItem('LoginID') == null) {
      this.router.navigate(['/login']);
    }
    else {
      this.LoginName = localStorage.getItem('LoginName');
    }

    if (localStorage.getItem('CompanyID') == null) {
      localStorage.setItem('ID','F1164F06-2DEB-49B8-B249-6B239B2CBF5F');
    }

    if (localStorage.getItem('CompanyID') == null) {
      localStorage.setItem('CompanyID','F1164F06-2DEB-49B8-B249-6B239B2CBF5F');
    }
    if (localStorage.getItem('CompanyId') == null) {
      localStorage.setItem('CompanyId','F1164F06-2DEB-49B8-B249-6B239B2CBF5F');
    }

    if (localStorage.getItem('StyleMatrixID') == null) {
      localStorage.setItem('StyleMatrixID', 'D40D080F-A5D7-4A04-9AD0-2028D846DAE6');
    }
    if (localStorage.getItem('WarehouseID') == null) {
      localStorage.setItem('WarehouseID', 'D0454214-D3BB-44D2-B5FD-1B83A3556393');
    }
    if (localStorage.getItem('TableID') == null) {
      localStorage.setItem('TableID', '4FE7E4BD-CA18-4EB7-96F1-49D3F58208DB');
    }


    if (localStorage.getItem('TableID') == null) {
      localStorage.setItem('TableID', 'ca973ce8-8cdd-4c3b-81a5-c09257c56a01');
    }
    if (localStorage.getItem('StyleMatrixID') == null) {
      localStorage.setItem('StyleMatrixID', 'D40D080F-A5D7-4A04-9AD0-2028D846DAE6');
    }
    if (localStorage.getItem('WarehouseID') == null) {
      localStorage.setItem('WarehouseID', 'D0454214-D3BB-44D2-B5FD-1B83A3556393');
    }
    if (localStorage.getItem('TableID') == null) {
      localStorage.setItem('TableID', '4FE7E4BD-CA18-4EB7-96F1-49D3F58208DB');
    }


    if (localStorage.getItem('TableID') == null) {
      localStorage.setItem('TableID', 'ca973ce8-8cdd-4c3b-81a5-c09257c56a01');
    } */
    // $(function () {
    //   var rvnMenu = $("#navbar").rvnm({
    //     theme: 'dark-lesb',
    //     //mode: 'mobile',
    //          responsive: false,
    //   });
    //   rvnMenu.setTheme('dark-ruby');
    // });

    // $(function() {
    //   if ( $(window).width() > 1023){
    //     $(".nav-menu").click(function(){
    //       $("#navbar").toggleClass("rvnm-minimal");
    //       $(".rvnm-wrapper").toggleClass("full-width");
    //       $(".footer").toggleClass("footer-width");

    //       $('.rvnm-collapseable').addClass('rvnm-expandable').removeClass('rvnm-collapseable');
    //       $('.rvnm-expandable').find("ul").css('display','');
    //     });
    //   }
    //   else{
    //     $(".nav-menu").click(function(){
    //       $("#navbar").toggleClass("rvnm-mobile-expand");

    //     });
    //   }
    // });
  }
  onCompanyChangetest(event) {
    console.log(event);
  }
  Getpermissions() {
    debugger;
    let Str_MenuPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let DecyMenus = this.cryptoAes.DecryptString(Str_MenuPermissions);
    this.MenuPermissions = JSON.parse(DecyMenus);

    let Str_ModulePermissions = JSON.parse(localStorage.getItem('ModulePermissions'));
    let DecyModules = this.cryptoAes.DecryptString(Str_ModulePermissions);
    this.ModulePermissions = JSON.parse(DecyModules);

    let Str_CompaniesPermissions = JSON.parse(localStorage.getItem('CompaniesPermissions'));
    let DecyCompanies = this.cryptoAes.DecryptString(Str_CompaniesPermissions);
    this.CompanyPermissions = JSON.parse(DecyCompanies);
    // this.ModulePermissions=JSON.parse(localStorage.getItem('ModulePermissions'));
    //  this.CompanyPermissions=JSON.parse(localStorage.getItem('CompaniesPermissions')); 
    console.log(this.MenuPermissions);
    console.log(this.ModulePermissions);
    console.log(this.CompanyPermissions);

    let SYS = this.ModulePermissions.find(ob => ob['moduleID'] === 'SYS');
     let INV = this.ModulePermissions.find(ob => ob['moduleID'] === 'INV');
     let PUR = this.ModulePermissions.find(ob => ob['moduleID'] === 'PUR');
     let HRM = this.ModulePermissions.find(ob => ob['moduleID'] === 'HRM');
     let POS = this.ModulePermissions.find(ob => ob['moduleID'] === 'POS');
     let DOC = this.ModulePermissions.find(ob => ob['moduleID'] === 'DOC');
     let ACR = this.ModulePermissions.find(ob => ob['moduleID'] === 'ACR');
    // let KITCHENVIEW = this.ModulePermissions.find(ob => ob['moduleID'] === 'KITCHENVIEW');
    this.IsSYS = false;
    this.IsINV = false;
    this.IsPUR = false;
    this.IsKitchen = false;
    if (SYS) {
      this.IsSYS = true;
    }
     if (INV) {
       this.IsINV = true;
     }

     if (PUR) {
       this.IsPUR = true;
     }
     if (POS) {
       this.IsPOS = true;
     }
     if (DOC) {
       this.IsDoc = true;
     }
     if(ACR)
     {
       this.IsAcr=true;
     }
    // if (KITCHENVIEW) {
    //   this.IsKitchen = true;
    // }
    console.log(SYS);
    this.SelectedCompany = localStorage.getItem('CompanyID');
    let CompanyName = this.CompanyPermissions.find(ob => ob['id'] === this.SelectedCompany);
    if (CompanyName) {
      this.SelectedCompanyName = CompanyName.name;
    }

  }
  isExpanded = false;
  IsCheck() {
    return false;
  }
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  LogOut() {
    this.accountService.updateLogOut(localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // localStorage.removeItem('LoginID');
      // localStorage.removeItem('Token');
      // localStorage.removeItem('LoginName');
      // localStorage.removeItem('MenuPermissions');
      // localStorage.removeItem('ModulePermissions');
      // localStorage.removeItem('CompaniesPermissions');
      // localStorage.clear();
      // this.router.navigate(['/login']);
    }, (error: any) => {

    });

    localStorage.removeItem('LoginID');
    localStorage.removeItem('Token');
    localStorage.removeItem('LoginName');
    localStorage.removeItem('MenuPermissions');
    localStorage.removeItem('ModulePermissions');
    localStorage.removeItem('CompaniesPermissions');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  onCompanyChange(ID) {
    if (ID != "00000000-0000-0000-0000-000000000000")

      this.accountService.getMenuPermissions(localStorage.getItem('LoginID'), ID).subscribe((menudata: any) => {
        debugger;

        console.log(menudata);
        let Str_menuPermissions = JSON.stringify(menudata.menuPermissions);
        let Encymenus = this.cryptoAes.EncryptString(Str_menuPermissions);
        localStorage.setItem('MenuPermissions', JSON.stringify(Encymenus));

        let Str_modulePermissions = JSON.stringify(menudata.modulePermissions);
        let Encymodules = this.cryptoAes.EncryptString(Str_modulePermissions);
        localStorage.setItem('ModulePermissions', JSON.stringify(Encymodules));

        let Str_companiesPermissions = JSON.stringify(menudata.companiesPermissions);
        let Encycompanies = this.cryptoAes.EncryptString(Str_companiesPermissions);
        localStorage.setItem('CompaniesPermissions', JSON.stringify(Encycompanies));
        localStorage.setItem('CompanyID', ID);
        //localStorage.setItem('CompaniesPermissions',JSON.stringify(menudata.companiesPermissions));
        this.Getpermissions();
        this.router.navigate(['/home']);
        this.SelectedCompany = ID;
       
      }, (error) => {

        //   console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
}
