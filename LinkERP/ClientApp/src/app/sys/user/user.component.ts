import { Component, OnInit, ViewChild } from '@angular/core';
import { LbsSysUser } from 'src/app/models/sys/lbs-sys-user';
import { FormGroup, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { UserService } from '../services/user.service';
import { OrganisationMaintenanceService } from '../services/organisation-maintenance.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ToastrService } from 'ngx-toastr';
import { WorkflowService } from '../services/workflow.service';
import { SysCommonService } from '../services/sys-common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { TerminalsService } from 'src/app/POS/services/terminals.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  UserForm: FormGroup;
  Users: any;
  InformationId: any;
  submitted: boolean;
  Mode: any = 'List';
  Companies: any;
  CurrentUserName: any;
  //addreadonly: boolean;
  readonly: boolean = false;
  //CompanyId = 'F1164F06-2DEB-49B8-B249-6B239B2CBF5F';
  CompanyID = localStorage.getItem('CompanyID');
  RecID = localStorage.getItem('RecID');
  NoteTypeID = localStorage.getItem('NoteTypeID');
  HeaderNames: any;
  TableName: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  PageSize: any;
  WareHouse: any;
  Authontications =
    [
      { id: 'L', name: 'Link Password' },
      { id: 'W', name: 'Windows' },
      { id: 'E', name: 'Either' }

    ];
  //imagepath:any;
  Loading: any = false;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  addreadonly: boolean;
  AccessTab: string;
  SelectedUserID: any;
  workflowdeatil: any;
  fileToUpload: any;
  FileName: any;
  FileType: any;
  imageSrc: any;
  IsActive: boolean;
  Currentpage: string;
  Terminals: any;
  ISAuthenticationModeWindows: boolean = true;

  constructor(private terminalsServcie: TerminalsService,
    private userService: UserService,
    private workflowservice: WorkflowService,
    private FB: FormBuilder,
    private organisationMaintenanceService: OrganisationMaintenanceService,
    private UserTypeFB: FormBuilder,
    private cryptoAes: CryptoAes,
    private toastr: ToastrService,
    private commonService: SysCommonService,
    private invcommon: InvCommonService,
    public modalService: BsModalService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.GeCompanyAccessByLoginID();
    this.PageSize = "50";
    this.Currentpage = "0";
    this.RecID = localStorage.getItem('LoginID');
    this.AccessTab = "Users";
    this.HeaderNames = "User";
    this.TableName = "LBS_SYS_Company"
    this.AgLoad = false;
    // this.BindOrganisations();
    this.BindWorkFlow();
    //this.BindWareHouse();
    this.GetTerminalsList();
    this.getUsers();

    this.CreateForm();
    this.SetPermissions();
    
    this.GridColumns();
  }
  CreateForm() {
    this.UserForm = this.UserTypeFB.group({
      LoginID: ['', Validators.required],
      LoginName: ['', Validators.required],
      Password: [''],
      AuthenticationMode: ['-1', CustomValidators.notEqual('-1')],
      WindowsUserName: [''],
      WareHouseID: ['00000000-0000-0000-0000-000000000000'],
      TerminalID: ['00000000-0000-0000-0000-000000000000'],
      DefaultCompanyID: ['00000000-0000-0000-0000-000000000000'],
      DiscountPercentValue: [false],
      Discount: ['0', Validators.required],
      LogOnStatus: [false],
      ForcePasswordChange: [false],
      ResetPassword: [true],
      EmailAddress: ['', [Validators.required, Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)]],
      PhoneNumber: [''],///^[6-9]\d{9}$///, [Validators.pattern(/^([+]?\d{1,20})$/)]
      MobileNumber: [''],//, [Validators.pattern(/^([+]?\d{1,20})$/)]
      TaxNumber: [''],
      LeaveWorkFlow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      TimeWorkFlow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      PerformanceWorkFlow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      PurchaseWorkFlow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      RequestWorkFlow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      TrainingWorkFlow: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      LoginAvator: [''],
    });
  }
  GridColumns() {
    this.ColumnDefs = [
      { headerName: 'Login ID', field: 'loginID', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Name', field: 'loginName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Default Organisation', field: 'name', sortable: true, filter: true },
      { headerName: 'Logged on Machine Name', field: 'logOnMachineName', sortable: true, filter: true },
      //{ headerName: 'Log Status', field: 'logStatus', sortable: true, filter: true },
      // { headerName: 'Phone Number', field: 'mobileNumber', sortable: true, filter: true },
      { headerName: 'Log On Status', field: 'logStatus', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "103");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.UserForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.UserForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.UserForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  get f() { return this.UserForm.controls; }
  getUsers() {
    this.AgLoad = false;
    this.Loading = true;
    this.userService.getUsers().subscribe((resp: any) => {
      this.Users = resp.data.users;
      this.RowData = resp.data.users;
      this.Loading = false;
      this.AgLoad = true;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSelectFile(event) {
    this.FileName = event.target.files[0].name;
    this.FileType = event.target.files[0].type;
    // To display the selected image before deciding to upload it.
    let reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      // Sets the html <img> tag to the image.
      this.fileToUpload = reader.result;
      this.imageSrc = null;
    }
  }

  BindWorkFlow() {
    this.commonService.getWorkflow().subscribe((resp: any) => {
      this.workflowdeatil = resp.data.workFlow;
      //this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindOrganisations() {
    this.Loading = true;
    this.organisationMaintenanceService.getCompanies().subscribe((resp: any) => {
      this.Companies = resp.data.companies;
      this.Loading = false;
      //console.log(this.organisations)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  okk(){
    
  }
  GeCompanyAccessByLoginID() {
   
    this.userService.geCompanyAccessByLoginID(this.SelectedUserID).subscribe((resp: any) => {
      this.Companies = resp.data.roleCompanyAccess;
    
      //console.log(this.organisations)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Allwarehouse(CompanyID){
    this.userService.geWarehouseAccessByLoginID(this.SelectedUserID,CompanyID).subscribe((resp: any) => {
      debugger;
    this.WareHouse = resp.data.roleCompanyAccess;
    });
  }
  onChangeCompany(CompanyID) {
    this.Allwarehouse(CompanyID);
  }
  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.UserForm.get('LoginID').enable();
    this.Mode = "List";
  }
  AddNew(): void {
    this.Mode = 'Add';
    this.SelectedUserID=null;
    this.UserForm.enable();
    this.addreadonly = false;
    this.IsActive = true;
    this.InformationId = '';
    this.CurrentUserName = '';
    this.CreateForm();
    this.UserForm.get('WindowsUserName').disable();
    this.GeCompanyAccessByLoginID();
  }

  Edit(ID): void {
    this.BindUserByID(ID);

    this.addreadonly = true;
  }
  BindUserByID(ID) {
    debugger;
    console.log(this.workflowdeatil)
    this.AccessTab = "Users";
    this.userService.getUserByID(ID).subscribe((resp: any) => {
      // this.imagepath= resp.data.users.loginAvator;

      if (resp.data.users.loginAvator) {
        this.imageSrc = resp.data.users.loginAvator;
      } else {
        this.imageSrc = null;
      }
      if (resp.isSuccess == true) {
        let user: any = new LbsSysUser();
        user = resp.data.users;
        this.SelectedUserID = user.loginID;
        this.DefaultCompanyID = user.defaultCompanyID;
        var Discount = user.discount.toFixed(Math.max(((user.discount + '').split(".")).length, 2));
        var defaultTerminalID = this.Terminals.findIndex(e => e.id == user.defaultTerminalID)
       // var defaultWarehouseID = this.WareHouse.findIndex(e => e.id == user.defaultWarehouseID);
        var leaveApprovalWorkFlow = this.workflowdeatil.findIndex(e => e.id == user.leaveApprovalWorkFlow);
        var timeApprovalWorkFlow = this.workflowdeatil.findIndex(e => e.id == user.timeApprovalWorkFlow);
        var performanceAppraisalWorkFlow = this.workflowdeatil.findIndex(e => e.id == user.performanceAppraisalWorkFlow);
        var purchaseApprovalWorkFlow = this.workflowdeatil.findIndex(e => e.id == user.purchaseApprovalWorkFlow);
        var purchaseRequestApprovalWorkFlow = this.workflowdeatil.findIndex(e => e.id == user.purchaseRequestApprovalWorkFlow);
        var trainingApprovalWorkFlow = this.workflowdeatil.findIndex(e => e.id == user.trainingApprovalWorkFlow);


        if (defaultTerminalID == -1 || defaultTerminalID == "-1") {
          user.defaultTerminalID = '00000000-0000-0000-0000-000000000000'
        }

        // if (defaultWarehouseID == -1 || defaultWarehouseID == "-1") {
        //   user.defaultWarehouseID = '00000000-0000-0000-0000-000000000000'
        // }
        if (leaveApprovalWorkFlow == -1 || leaveApprovalWorkFlow == "-1") {
          user.leaveApprovalWorkFlow = '00000000-0000-0000-0000-000000000000'
        }
        if (timeApprovalWorkFlow == -1 || timeApprovalWorkFlow == "-1") {
          user.timeApprovalWorkFlow = '00000000-0000-0000-0000-000000000000'
        }
        if (performanceAppraisalWorkFlow == -1 || performanceAppraisalWorkFlow == "-1") {
          user.performanceAppraisalWorkFlow = '00000000-0000-0000-0000-000000000000'
        }
        if (purchaseApprovalWorkFlow == -1 || purchaseApprovalWorkFlow == "-1") {
          user.purchaseApprovalWorkFlow = '00000000-0000-0000-0000-000000000000'
        }
        if (purchaseRequestApprovalWorkFlow == -1 || purchaseRequestApprovalWorkFlow == "-1") {
          user.purchaseRequestApprovalWorkFlow = '00000000-0000-0000-0000-000000000000'
        }
        if (trainingApprovalWorkFlow == -1 || trainingApprovalWorkFlow == "-1") {
          user.trainingApprovalWorkFlow = '00000000-0000-0000-0000-000000000000'
        }
        // if (user.defaultWarehouseID == '00000000-0000-0000-0000-000000000000') user.defaultWarehouseID = '00000000-0000-0000-0000-000000000000';
        // else
        //   user.defaultWarehouseID = user.defaultWarehouseID;
        // if (user.leaveApprovalWorkFlow == '00000000-0000-0000-0000-000000000000') user.leaveApprovalWorkFlow = '00000000-0000-0000-0000-000000000000';
        // else
        //   user.leaveApprovalWorkFlow = user.leaveApprovalWorkFlow;
        // if (user.timeApprovalWorkFlow == '00000000-0000-0000-0000-000000000000') user.timeApprovalWorkFlow = '00000000-0000-0000-0000-000000000000';
        // else
        //   user.timeApprovalWorkFlow = user.timeApprovalWorkFlow;
        // if (user.performanceAppraisalWorkFlow == '00000000-0000-0000-0000-000000000000') user.performanceAppraisalWorkFlow = '00000000-0000-0000-0000-000000000000';
        // else
        //   user.performanceAppraisalWorkFlow = user.performanceAppraisalWorkFlow;
        // if (user.purchaseApprovalWorkFlow == '00000000-0000-0000-0000-000000000000') user.purchaseApprovalWorkFlow = '00000000-0000-0000-0000-000000000000';
        // else
        //   user.purchaseApprovalWorkFlow = user.purchaseApprovalWorkFlow;
        // if (user.purchaseRequestApprovalWorkFlow == '00000000-0000-0000-0000-000000000000') user.purchaseRequestApprovalWorkFlow = '00000000-0000-0000-0000-000000000000';
        // else
        //   user.purchaseRequestApprovalWorkFlow = user.purchaseRequestApprovalWorkFlow;
        // if (user.trainingApprovalWorkFlow == '00000000-0000-0000-0000-000000000000') user.trainingApprovalWorkFlow = '00000000-0000-0000-0000-000000000000';
        // else
        //   user.trainingApprovalWorkFlow = user.trainingApprovalWorkFlow;
        this.UserForm.patchValue({
          LoginID: user.loginID,
          LoginName: user.loginName,
          Password: user.password,
          AuthenticationMode: user.authenticationMode,
          WindowsUserName: user.windowsUserName,
          DefaultCompanyID: user.defaultCompanyID,
          WareHouseID: user.defaultWarehouseID,
          TerminalID: user.defaultTerminalID,
          DiscountPercentValue: user.discountPercentValue,
          Discount: Discount,
          LogOnStatus: user.logOnStatus,
          EmailAddress: user.emailAddress,
          PhoneNumber: user.phoneNumber,
          MobileNumber: user.mobileNumber,
          TaxNumber: user.taxNumber,
          LeaveWorkFlow: user.leaveApprovalWorkFlow,
          TimeWorkFlow: user.timeApprovalWorkFlow,
          PerformanceWorkFlow: user.performanceAppraisalWorkFlow,
          PurchaseWorkFlow: user.purchaseApprovalWorkFlow,
          RequestWorkFlow: user.purchaseRequestApprovalWorkFlow,
          TrainingWorkFlow: user.trainingApprovalWorkFlow,
          LoginAvator: ''
        });
        debugger;
        if (!user.deleted) {
          this.UserForm.enable();
          this.IsActive = true;
        } else {
          this.UserForm.disable();
          this.IsActive = false;
        }
        this.UserForm.get('LoginID').disable();
        this.AuthenicationModeWindows(user.authenticationMode)
      }
      this.Mode = 'Edit';
    });
  }
  AuthenicationModeWindows(ID) {
    debugger;
    if (ID == "W" || ID == "E") {
      this.UserForm.get('WindowsUserName').enable();
    }
    else {
      this.UserForm.get('WindowsUserName').disable();
    }

  }
  onChangeAuthentication(event) {
    console.log(event.target.value)
    this.AuthenicationModeWindows(event.target.value);
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    debugger;
    if (this.UserForm.invalid) {
      return;
    }
    debugger;
    this.Loading = true;
    let users = new LbsSysUser();
    users.LoginID = this.UserForm.get('LoginID').value;
    users.LoginName = this.UserForm.get('LoginName').value;
    users.Password = this.UserForm.get('Password').value;
    users.AuthenticationMode = this.UserForm.get('AuthenticationMode').value;
    users.WindowsUserName = this.UserForm.get('WindowsUserName').value;
    users.DefaultWarehouseID = this.UserForm.get('WareHouseID').value;
    users.DefaultTerminalID = this.UserForm.get('TerminalID').value;
    users.DefaultCompanyID = this.UserForm.get('DefaultCompanyID').value;
    users.DiscountPercentValue = this.UserForm.get('DiscountPercentValue').value;
    users.ForcePasswordChange = this.UserForm.get('ForcePasswordChange').value;
    users.Discount = Number(this.UserForm.get('Discount').value);
    users.LogOnStatus = this.UserForm.get('LogOnStatus').value;
    users.EmailAddress = this.UserForm.get('EmailAddress').value;
    users.PhoneNumber = this.UserForm.get('PhoneNumber').value;
    users.MobileNumber = this.UserForm.get('MobileNumber').value;
    users.TaxNumber = this.UserForm.get('TaxNumber').value;
    users.LoginAvator = this.fileToUpload;//this.FileName;
    users.LeaveApprovalWorkFlow = this.UserForm.get('LeaveWorkFlow').value;
    users.TimeApprovalWorkFlow = this.UserForm.get('TimeWorkFlow').value;
    users.PerformanceAppraisalWorkFlow = this.UserForm.get('PerformanceWorkFlow').value;
    users.PurchaseApprovalWorkFlow = this.UserForm.get('PurchaseWorkFlow').value;
    users.PurchaseRequestApprovalWorkFlow = this.UserForm.get('RequestWorkFlow').value;
    users.TrainingApprovalWorkFlow = this.UserForm.get('TrainingWorkFlow').value;
    users.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.userService.AddUsers(users).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Users details saved successfully');
          // this.ResetForm();
          //this.getUsers();
          this.SelectedUserID = this.UserForm.get('LoginID').value;
          if (saveAction == 'Close') {
            this.Cancel();
            this.getUsers();
            this.Mode = 'List';
          }
          else {
            this.SelectedUserID = this.UserForm.get('LoginID').value;
            this.DefaultCompanyID = this.UserForm.get('DefaultCompanyID').value;
            this.InformationId = this.UserForm.get('LoginID').value;
            this.CurrentUserName = this.UserForm.get('LoginName').value;
            this.Mode = 'Edit';
            this.UserForm.get('LoginID').disable();
            this.getUsers();
            this.Loading = false;
          }
          this.Loading = false;
          this.GeCompanyAccessByLoginID();
        }
        else {
          this.toastr.warning('user name already exists');
          this.Loading = false;
          this.Loading = false;
        }
      });
    }
    else if (this.Mode == 'Edit') {
      users.LoginID = this.UserForm.get('LoginID').value;
      //users.LoginAvator= 'data:image/jpeg;base64,'+ this.imagepath;

      if (this.UserForm.get('LogOnStatus').value == false &&
        this.UserForm.get('LoginID').value == localStorage.getItem('LoginID')) {
        this.toastr.warning('Not allowed to disable Log On Status for self account');
        this.Loading = false;
        return;
      }

      // if (this.imageSrc) {
      //   users.LoginAvator = 'data:image/jpeg;base64,' + this.imageSrc;
      // }
      this.userService.UpdateUsers(users).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Users  details updated successfully');

          // this.ResetForm();
          this.getUsers();
          this.submitted = false;
          // this.Mode = 'List';
          // this.UserForm.get('LoginID').enable();
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.getUsers();
          }
          // else {
          //   this.Edit(this.UserForm.get('LoginID').value);
          // }
        } else {
          this.toastr.warning('user  already exists')
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }
  onDeleteChecked(ID) {
    this.Loading = true;
    if (localStorage.getItem('LoginID') != ID) {
      this.userService.deleteUserByID(ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.getUsers();
        }
        this.Loading = false;
      }, (error) => {
        this.Loading = false;
      });
    }
    else {
      this.Loading = false;
      this.toastr.warning('Logged-in users are not allowed to In-Activate self account');
    }
  }
  DefaultCompanyID
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.SelectedUserID = event.data.loginID;
      this.InformationId = event.data.loginID;
      this.CurrentUserName = event.data.name;
      this.DefaultCompanyID = event.data.defaultCompanyID;
      this.GeCompanyAccessByLoginID();
      this.Edit(event.data.loginID)
      this.UserForm.get('LoginID').disable();
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.loginID)
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
  // GetTerminalsList() {
  //   this.Loading = true;
  //   this.terminalsServcie.GetTerminalsList().subscribe((res: any) => {
  //     this.Terminals = res.data.terminals;
  //     this.Loading = false;
  //   }, (error) => {
  //     this.toastr.error('Problem with the sevice. Please try later : ' + error);
  //   });

  // }
  GetTerminalsList() {
    this.Loading = true;
    this.invcommon.getTerminals().subscribe((res: any) => {
      this.Terminals = res.data.terminals;
      this.Loading = false;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  ResetForm() {
    this.InformationId = '';
    this.CurrentUserName = '';
    this.UserForm.patchValue({
      LoginID: '',
      LoginName: '',
      Password: '',
      WindowsUserName: '',
      DefaultCompanyID: '00000000-0000-0000-0000-000000000000',
      DiscountPercentValue: false,
      Discount: 0,
      AuthenticationMode: '-1',
      EmailAddress: '',
      PhoneNumber: '',
      MobileNumber: '',
      TaxNumber: '',
      LogOnStatus: false,
      ForcePasswordChange: false,
      ResetPassword: false,
      LeaveWorkFlow: '00000000-0000-0000-0000-000000000000',
      TimeWorkFlow: '00000000-0000-0000-0000-000000000000',
      PerformanceWorkFlow: '00000000-0000-0000-0000-000000000000',
      PurchaseWorkFlow: '00000000-0000-0000-0000-000000000000',
      RequestWorkFlow: '00000000-0000-0000-0000-000000000000',
      TrainingWorkFlow: '00000000-0000-0000-0000-000000000000'
    });
    this.UserForm.get('LoginID').enable();
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

  ResetPassword() {
    debugger;
    this.Loading = true;
    this.userService.resetAndSendPasswordMail(this.UserForm.get('LoginID').value).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.toastr.success('Password Reset Successfully. The email sent to the registered email.');
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode == 0) ? null : event.charCode >= 46 && event.charCode <= 57;
  }
  // BindWareHouse() {
  //   // this.Loading = true; 
  //   this.invcommon.getWareHouse().subscribe((resp: any) => {
  //     this.WareHouse = resp.data.warehouse;
  //     //this.BindTaxCode=this.WareHouse.map(s => s.wareHouseName)
  //     //console.log(this.BindTaxCode);
  //     // this.Loading = false;

  //   }, (error) => {

  //     // this.Loading = false;

  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
}
