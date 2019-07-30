import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BannerService } from 'src/app/providers/catalog/banner.service';
import {
  startWith,
  debounceTime,
  tap,
  switchMap,
  finalize
} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TypeService } from 'src/app/providers/catalog/type.service';
import { Constant } from 'src/app/helper/constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManufactureService } from 'src/app/providers/product/manufacture.service';
import { ProductService } from 'src/app/providers/product/product.service';
import { CategoryService } from 'src/app/providers/product/category.service';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit {
  public pageHeading = 'Banner Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;


  public imageGroup: FormArray;
  selectedFile: ImageSnippet;

  name;
  type;
  typeId;
  types;
  reference;
  referenceId;
  references = [];
  referenceTypes = [];
  isLoading = false;

  public form: FormGroup;
  public imageForm: FormGroup;
  public formErrors = {
    name: '',
    type: '',
    reference: '',
    referenceId: '',
  };

  constructor(
    public masterService: BannerService,
    public manufactureService: ManufactureService,
    public categoryService: CategoryService,
    public productService: ProductService,
    public typeService: TypeService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) { }

  get formData() {
    return (this.imageForm.get('images') as FormArray).controls;
  }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
      ? this.activatedRoute.snapshot.paramMap.get('id')
      : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/banners']);
  }

  createImage(name, image, imageThumb, link, sortOrder, reference, referenceId): FormGroup {
    this.references.push({});
    return this.formBuilder.group({
      reference: new FormControl(reference),
      referenceId: new FormControl(referenceId),
      name: new FormControl(name),
      image: new FormControl(image),
      image_thumb: new FormControl(imageThumb),
      link: new FormControl(link),
      sort_order: new FormControl(sortOrder)
    });
  }

  addImage(): void {
    this.imageGroup = <FormArray>this.imageForm.controls.images;
    this.imageGroup.push(this.createImage('', '', '', '', '', '', ''));
  }

  delImage(index: number): void {
    const arrayControl = <FormArray>this.imageForm.controls.images;
    arrayControl.removeAt(index);
  }

  onReferenceChange(value, index) {
    if (typeof value === 'string') {
      this.getReference(value, index);
    }
  }


  getReference(reference, refIndex) {
    let referenceArray = [];
    if (reference === 'manufacture') {
      this.manufactureService.list({}).subscribe(response => {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < response.data.length; index++) {
          referenceArray.push({
            name: response.data[index].name,
            value: response.data[index].id,
          });
        }
      });
    } else if (reference === 'category') {
      this.categoryService.list({}).subscribe(response => {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < response.data.length; index++) {
          referenceArray.push({
            name: response.data[index].name,
            value: response.data[index].id,
          });
        }
      });
    } else if (reference === 'product') {
      this.productService.list({}).subscribe(response => {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < response.data.length; index++) {
          referenceArray.push({
            name: response.data[index].name,
            value: response.data[index].id,
          });
        }
      });
    } else {
      referenceArray = [];
    }

    this.references[refIndex] = referenceArray;
  }

  ngOnInit() {
    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }
    this.referenceTypes.push(
      {
        name: 'Manufacture',
        value: 'manufacture'
      },
      {
        name: 'Category',
        value: 'category'
      },
      {
        name: 'Product',
        value: 'product'
      },
      {
        name: 'Featured Product',
        value: 'featured_product'
      },
      {
        name: 'Special Product',
        value: 'special_product'
      }
    );

    this.form = this.formBuilder.group({
      name: [this.name, Validators.required],
      typeId: [this.typeId],
      type: [this.type, Validators.required],
    });

    this.imageForm = this.formBuilder.group({
      images: this.formBuilder.array([])
    });


    this.form.valueChanges.subscribe(data => {
      this.setErrors();
    });

    this.getAutocomplete();
  }

  getAutocomplete() {
    const constant = new Constant();
    this.form
      .get('type')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.typeService
            .list({
              search: value,
              pageSize: constant.autocompleteListSize,
              pageIndex: 0,
              sort_by: 'name'
            })
            .pipe(finalize(() => (this.isLoading = false)))
        )
      )
      .subscribe(res => {
        if (res.status) {
          this.types = res.data;
        }
      });
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.name = response.data.name;
          this.type = {
            id: response.data.type_id,
            name: response.data.type
          };
          this.typeId = response.data.type_id;

          this.imageGroup = this.imageForm.get('images') as FormArray;

          if (response.data.images) {
            response.data.images.forEach((element, index) => {
              this.onReferenceChange(element.type, index);
              this.imageGroup.push(
                this.createImage(
                  element.name,
                  element.image,
                  element.image_thumb,
                  element.link,
                  element.sort_order,
                  element.type,
                  element.type_id,
                )
              );
            });
          }
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  isFormValid() {
    let status = false;
    if (this.form.valid) {
      status = true;
    } else if (this.imageForm.valid) {
      status = true;
    }

    return status;
  }

  public onSubmit() {
    // mark all fields as touched
    this.formService.markFormGroupTouched(this.form);
    if (this.isFormValid()) {
      this.spinner.show();

      const data = {
        name: this.form.value.name,
        typeId: this.form.value.typeId,
        images: this.imageForm.value.images,
      };

      console.log(data);

      this.masterService.save(data, this.getId()).subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          } else {
            this.form.reset();
            this.router.navigate(['/banners']);
          }
          this.spinner.hide();
          this.snackBar.open(response.message, 'X', {
            duration: 2000
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

  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.form,
      this.formErrors,
      false
    );
  }

  uploadImage(e: any, control: any) {
    const file: File = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.masterService.imageUpload(this.selectedFile.file).subscribe(
        res => {
          control.value.image = res.data.base_path;
          control.value.image_thumb = res.data.full_path;
        },
        err => {
          console.log(err);
        }
      );
    });

    reader.readAsDataURL(file);
  }
}
