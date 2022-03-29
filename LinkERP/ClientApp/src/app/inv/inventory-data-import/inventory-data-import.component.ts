import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryDataImportService } from '../services/inventory-data-import.service';
import { ToastrService } from 'ngx-toastr';
import { stringify } from 'querystring';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from 'rxjs/internal/scheduler/Action';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-inventory-data-import',
  templateUrl: './inventory-data-import.component.html',
  styleUrls: ['./inventory-data-import.component.css']
})
export class InventoryDataImportComponent implements OnInit {

  InventoryDataImportForm: FormGroup;

  constructor(private FB: FormBuilder,
    private inventoryDataImportService: InventoryDataImportService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.InventoryDataImportForm = this.FB.group({
      ImportType: ['-1', [CustomValidators.notEqual('-1')]],
      ExcelFile: ['', [Validators.required]]
    });
  }
  selectedFile: File = null;
  get f() { return this.InventoryDataImportForm.controls; }
  onFileChange(event) {
    debugger;
    if (event.target.files && event.target.files.length) {
      this.selectedFile = <File>event.target.files[0];

      this.InventoryDataImportForm.patchValue({
        ExcelFile: this.selectedFile
      });
    }
  }
  @ViewChild('DataFile') DataFileVariable: ElementRef;

  Submitted: any = false;
  SubmitAction: any = '';
  onDataUpload() {
    debugger;
    this.Submitted = true;
    if (this.SubmitAction == 'Download') {
      const datafile = this.InventoryDataImportForm.get('ExcelFile');
      datafile.clearValidators();
      datafile.updateValueAndValidity();
    } else if (this.SubmitAction == 'Upload') {
      const datafile = this.InventoryDataImportForm.get('ExcelFile');
      datafile.setValidators([Validators.required]);
      datafile.updateValueAndValidity();
    }

    if (this.InventoryDataImportForm.invalid) {
      return;
    }

    if (this.SubmitAction == 'Download') {
      this.inventoryDataImportService.downloadTemplate(this.InventoryDataImportForm.get('ImportType').value).subscribe((resp: any) => {
        var newBlob = new Blob([resp], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        var link = document.createElement('a');
        link.href = data;
        if (this.InventoryDataImportForm.get('ImportType').value == 'Category') {
          link.download = "Category-Details.xlsx";
        }
        else if (this.InventoryDataImportForm.get('ImportType').value == 'SubCategory') {
          link.download = "Sub-Category-Details.xlsx";
        }
        else if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryMaster') {
          link.download = "Inventory-Master-Details.xlsx";
        }
        else if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryDetails') {
          link.download = "Inventory-Details.xlsx";
        }
        else if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryBarcodes') {
          link.download = "Inventory-Barcodes.xlsx";
        } 
        else if (this.InventoryDataImportForm.get('ImportType').value == 'ProductPrice') {
          link.download = "Product-Price.xlsx";
        }
        else if (this.InventoryDataImportForm.get('ImportType').value == 'LocationPrice') {
          link.download = "Location-Price.xlsx";
        } 
        else if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryKitItems') {
          link.download = "Inventory-KIT-Items.xlsx";
        }
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
        }, 100);
      }, (error: any) => {

      });
    }
    else {
      if (this.InventoryDataImportForm.get('ImportType').value == 'Category') {
        this.ImportCategory();
      }
      else if (this.InventoryDataImportForm.get('ImportType').value == 'SubCategory') {
        this.ImportSubCategory();
      }
      else if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryMaster') {
        this.ImportInventoryMaster();
      }
      else if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryDetails') {
        this.ImportInventoryDetails();
      }
      else if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryBarcodes') {
        this.ImportInventoryBarcodes();
      }
    }
  }

  ImportCategory() {
    let input = new FormData();
    input.append('CategoryExcelFile', this.InventoryDataImportForm.get('ExcelFile').value);

    if (this.InventoryDataImportForm.get('ImportType').value == 'Category') {
      this.inventoryDataImportService.importCategory(input).subscribe((resp: any) => {

        try {
          // if (resp.isSuccess) {
          //   this.DataFileVariable.nativeElement.value = '';
          //   this.toastr.success('Data imported successfully..!')
          // } else {
          //   this.toastr.error(resp.message);
          //   this.DataFileVariable.nativeElement.value = '';
          // }

          if (resp.isSuccess) {
            this.toastr.success('Data imported successfully..!')
          } else {
            this.toastr.error(resp.message);
          }
          this.ResetForm();


        } catch (error) {

        }
      }, (error: HttpErrorResponse) => {
        debugger;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  ImportSubCategory() {
    let input = new FormData();
    input.append('SubCategoryExcelFile', this.InventoryDataImportForm.get('ExcelFile').value);

    if (this.InventoryDataImportForm.get('ImportType').value == 'SubCategory') {
      this.inventoryDataImportService.importSubCategory(input).subscribe((resp: any) => {

        try {

          if (resp.isSuccess) {
            this.toastr.success('Data imported successfully..!')
          } else {
            this.toastr.error(resp.message);
          }
          this.ResetForm();

        } catch (error) {

        }
      }, (error: HttpErrorResponse) => {
        debugger;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  ImportInventoryMaster() {
    let input = new FormData();
    input.append('InventoryMasterExcelFile', this.InventoryDataImportForm.get('ExcelFile').value);

    if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryMaster') {
      this.inventoryDataImportService.importInventoryMaster(input).subscribe((resp: any) => {

        try {

          if (resp.isSuccess) {
            this.toastr.success('Data imported successfully..!')
          } else {
            this.toastr.error(resp.message);
          }
          this.ResetForm();

        } catch (error) {

        }
      }, (error: HttpErrorResponse) => {
        debugger;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  ImportInventoryDetails() {
    let input = new FormData();
    input.append('InventoryDetailsExcelFile', this.InventoryDataImportForm.get('ExcelFile').value);

    if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryDetails') {
      this.inventoryDataImportService.importInventoryDetails(input).subscribe((resp: any) => {

        try {

          if (resp.isSuccess) {
            this.toastr.success('Data imported successfully..!')
          } else {
            this.toastr.error(resp.message);
          }
          this.ResetForm();

        } catch (error) {

        }
      }, (error: HttpErrorResponse) => {
        debugger;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  ImportInventoryBarcodes() {
    let input = new FormData();
    input.append('InventoryBarcodesExcelFile', this.InventoryDataImportForm.get('ExcelFile').value);

    if (this.InventoryDataImportForm.get('ImportType').value == 'InventoryBarcodes') {
      this.inventoryDataImportService.importInventoryBarcodes(input).subscribe((resp: any) => {

        try {

          if (resp.isSuccess) {
            this.toastr.success('Data imported successfully..!')
          } else {
            this.toastr.error(resp.message);
          }
          this.ResetForm();

        } catch (error) {

        }
      }, (error: HttpErrorResponse) => {
        debugger;
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }

  ResetForm() {
    this.Submitted = false;
    this.InventoryDataImportForm.patchValue({
      ImportType: '-1',
      ExcelFile: ''
    });
    this.DataFileVariable.nativeElement.value = '';
  }

}
