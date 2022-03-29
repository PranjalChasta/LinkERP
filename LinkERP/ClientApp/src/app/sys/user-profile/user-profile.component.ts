import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/sys/user-profile/user';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  @ViewChild('ProfilePhoto') ProfilePhotoVariable: ElementRef;

  UserForm: FormGroup;
  ProfilImage: any;
  Loading: boolean = false;
  submitted = false;
  constructor(
    private FB: FormBuilder,
    private userProfileService: UserProfileService,
    private toastr: ToastrService,
    private router: Router) { }

  get f() { return this.UserForm.controls; }

  ngOnInit() {
    this.UserForm = this.FB.group({
      LoginID: [''],
      LoginName: [''],
      PhoneNumber: [''],//, [Validators.pattern(/^([+]?\d{1,20})$/)]
      EmailAddress: ['', [Validators.required, CustomValidators.email]],
      MobileNumber: [''],//, [Validators.pattern(/^([+]?\d{1,20})$/)]
      TaxNumber: [''],
      LoginAvator: [''],
    });
    this.BindUserDetails();
  }
  UserDetails: any;

  BindUserDetails() {
    debugger;
    this.Loading = true;
    this.userProfileService.getUserByLoginID(localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        debugger;
        this.UserDetails = resp.data.user;
        if (this.UserDetails.loginAvator != null) {
          this.ProfilImage = 'data:image/jpeg;base64,' + this.UserDetails.loginAvator;
        }
        else {
          this.ProfilImage = 'assets/images/no-user-image.jpg';
        }
        this.UserForm.patchValue({
          LoginID: this.UserDetails.loginID,
          LoginName: this.UserDetails.loginName,
          PhoneNumber: this.UserDetails.phoneNumber,
          EmailAddress: this.UserDetails.emailAddress,
          MobileNumber: this.UserDetails.mobileNumber,
          TaxNumber: this.UserDetails.taxNumber,
          LoginAvator: this.UserDetails.loginAvator,
        });
        this.Loading = false;


        // this.ProfilImage = this.UserDetails.loginAvator == null ? 'assets/images/no-user-image.jpg' : 'data:image/jpeg;base64,' + this.UserDetails.loginAvator;
      }
    }, (error) => {
      this.Loading = false;
    });
  }

  OnUpdateProfile() {

    this.submitted = true;

    if (this.UserForm.invalid) {
      return;
    }

    this.Loading = true;
    let user: any = new User();

    user.LoginID = this.UserForm.get('LoginID').value;
    user.LoginName = this.UserForm.get('LoginName').value;
    user.EmailAddress = this.UserForm.get('EmailAddress').value;
    user.PhoneNumber = this.UserForm.get('PhoneNumber').value;
    user.MobileNumber = this.UserForm.get('MobileNumber').value;
    user.TaxNumber = this.UserForm.get('TaxNumber').value;
    user.LoginAvator = this.UserForm.get('LoginAvator').value; //this.base64textString;

    this.userProfileService.updateUser(user).subscribe((resp: any) => {

      if (resp.isSuccess) {
        this.toastr.success('Profile updated successfully');
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;

    });

  }
  onSelectFile(evt) {

    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
      this.ProfilePhotoVariable.nativeElement.value = '';
    }
  }
  base64textString: any;

  handleReaderLoaded(e) {
    var binaryString = e.target.result;
    this.base64textString = btoa(binaryString);

    this.ProfilImage = 'data:image/jpeg;base64,' + this.base64textString;
    console.log(this.ProfilImage);
    console.log(btoa(binaryString));
    // let imageData = this.convertDataURIToBinary(this.base64textString);
    this.UserForm.patchValue({
      LoginAvator: this.base64textString
    });
  }
  BASE64_MARKER = ';base64,';
  convertDataURIToBinary(dataURI) {
    debugger;
    var base64Index = dataURI.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    //var raw = atob(base64);
    var rawLength = base64.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = base64.charCodeAt(i);
    }
    return array;
  }
  DeleteProfilePhoto() {
    debugger;
    this.UserForm.patchValue({
      LoginAvator: null
    });
    this.ProfilImage = 'assets/images/no-user-image.jpg';
  }
  Cancel() {
    this.router.navigate(['/home']);
    // this.BindUserDetails();
  }
}
