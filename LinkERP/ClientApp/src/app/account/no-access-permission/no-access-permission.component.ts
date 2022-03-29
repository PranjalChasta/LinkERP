import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
@Component({
  selector: 'app-no-access-permission',
  templateUrl: './no-access-permission.component.html',
  styleUrls: ['./no-access-permission.component.css']
})
export class NoAccessPermissionComponent implements OnInit {

  constructor(private router: Router,
    private accountService: AccountService) { }

  ngOnInit() {
    // this.accountService.updateLogOut(localStorage.getItem('LoginID')).subscribe((resp: any) => {

    // }, (error: any) => {

    // });
    // localStorage.removeItem('LoginID');
    // localStorage.removeItem('Token');
    // localStorage.removeItem('LoginName');
    // localStorage.removeItem('MenuPermissions');
    // localStorage.removeItem('ModulePermissions');
    // localStorage.removeItem('CompaniesPermissions');
    // localStorage.clear();
  }
  Cancel() {
    this.router.navigate(['/login']);
  }
}
