import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFileName: string = 'No file chosen';

  category: string[] = ['Saree', 'Chudi', 'Jewell', 'Kids', 'Nighty'];

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Data passed for edit functionality
    private _coreService: CoreService
  ) {
    // Initialize the form with default validators
    this.empForm = this._fb.group({
      product: ['', Validators.required],
      description: ['', Validators.required],
      longdescription: ['', Validators.required],
      image: [''],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnInit(): void {
    // Populate form if editing an existing product
    if (this.data) {
      this.empForm.patchValue(this.data);
      this.imagePreview = this.data.image || null;
    }
  }

  // Handle file selection and generate image preview
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Update image preview
        this.empForm.patchValue({
          image: reader.result, // Save Base64 string in form control
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle form submission
  onFormSubmit(): void {
    if (this.empForm.invalid) {
      this._coreService.openSnackBar('Please fill all required fields!', 'OK');
      return;
    }

    const formData = this.empForm.value;

    if (this.data) {
      // Update existing product
      this._empService.updateEmployee(this.data.id, formData).subscribe({
        next: () => {
          this._coreService.openSnackBar('Product updated successfully!', 'OK');
          this._dialogRef.close(true); // Notify parent to refresh data
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this._coreService.openSnackBar('Error updating product!', 'Close');
        },
      });
    } else {
      // Add new product
      this._empService.addEmployee(formData).subscribe({
        next: () => {
          this._coreService.openSnackBar('Product added successfully!', 'OK');
          this._dialogRef.close(true); // Notify parent to refresh data
        },
        error: (err) => {
          console.error('Error adding product:', err);
          this._coreService.openSnackBar('Error adding product!', 'Close');
        },
      });
    }
  }

  // Close the dialog without saving
  onCancel(): void {
    this._dialogRef.close();
  }
}
