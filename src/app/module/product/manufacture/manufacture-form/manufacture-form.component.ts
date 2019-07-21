import { Component, OnInit } from '@angular/core';
import { ManufactureService } from 'src/app/providers/product/manufacture.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageSnippet } from 'src/app/model/image-snippet';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manufacture-form',
  templateUrl: './manufacture-form.component.html',
  styleUrls: ['./manufacture-form.component.css']
})
export class ManufactureFormComponent implements OnInit {

  public pageHeading = 'Manufacture Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  name;
  mobileMenu;
  top;
  bottom;
  sortOrder;
  image: any;
  imageThumb: any;
  selectedFile: ImageSnippet;


  public form: FormGroup;
  public formErrors = {
    name: '',
    image: '',
    mobileMenu: '',
    top: '',
    bottom: '',
    sortOrder: '',
  };

  constructor(
    public masterService: ManufactureService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/manufactures']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      name: [this.name, Validators.required],
      image: [this.image],
      mobileMenu: [this.mobileMenu],
      top: [this.top],
      bottom: [this.bottom],
      sortOrder: [this.sortOrder],
    });

    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.name = response.data.name;
          this.image = response.data.image;
          this.imageThumb = response.data.image_thumb;
          this.mobileMenu = response.data.mobileMenu;
          this.top = response.data.top;
          this.bottom = response.data.bottom;
          this.sortOrder = response.data.sortOrder;
        }
      },
      err => {
        console.error(err);
      }
    );
  }


  uploadImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.masterService.imageUpload(this.selectedFile.file).subscribe(
        (res) => {
          console.log(res);

          this.image = res.data.base_path;
          this.imageThumb = res.data.full_path;
        },
        (err) => {
          console.log(err);
        });
    });

    reader.readAsDataURL(file);
  }

  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.form,
      this.formErrors,
      false
    );
  }

  public onSubmit() {
    // mark all fields as touched
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
      this.spinner.show();
      this.masterService.save(this.form.value, this.getId()).subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any; }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          } else {
            this.form.reset();
            this.router.navigate(['/manufactures']);
          }
          this.spinner.hide();
          this.snackBar.open(response.message, 'X', {
            duration: 2000,
          });
        },
        err => {
          console.error(err);
        }
      );
    } else {
      this.setErrors();
    }
  }

}
