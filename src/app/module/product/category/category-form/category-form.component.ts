import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/providers/product/category.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeService } from 'src/app/providers/catalog/type.service';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ImageSnippet } from 'src/app/model/image-snippet';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  public pageHeading = 'Category Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  name;
  image: any;
  imageThumb: any;
  selectedFile: ImageSnippet;
  type;
  typeId;
  types;
  category;
  categoryId;
  categories;
  isLoading = false;

  public form: FormGroup;
  public formErrors = {
    name: '',
    type: '',
    category: '',
    image: '',
  };

  constructor(
    public masterService: CategoryService,
    public typeService: TypeService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/categories']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
      name: [this.name, Validators.required],
      typeId: [this.typeId],
      type: [this.type, Validators.required],
      categoryId: [this.categoryId],
      category: [this.category, Validators.required],
      image: [this.image],
    });

    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        true
      );
    });

    this.getAutocomplete();
    this.getCategoryAutocomplete();
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

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.typeId.setValue(event.option.value.id);
  }

  getCategoryAutocomplete() {
    const constant = new Constant();
    this.form
      .get('category')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.masterService
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
          this.categories = res.data;
        }
      });
  }

  onCategorySelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.form.controls.categoryId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.name = response.data.name;
          this.image = response.data.image;
          this.imageThumb = response.data.image_thumb;
          this.type = {
            id: response.data.type_id,
            name: response.data.type
          };
          this.typeId = response.data.type_id;
          this.category = {
            id: response.data.parent_id,
            name: response.data.parent
          };
          this.categoryId = response.data.parent_id;
        }
      },
      err => {
        console.error(err);
      }
    );
  }


  public onSubmit() {
    // mark all fields as touched
    this.formService.markFormGroupTouched(this.form);
    if (this.form.valid) {
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
            this.router.navigate(['/categories']);
          }

          this.snackBar.open(response.message, 'X', {
            duration: 2000,
          });
        },
        err => {
          console.error(err);
        }
      );
    } else {
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        false
      );
    }
  }


}
