import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/providers/product/product.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from 'src/app/helper/constant';
import { startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TypeService } from 'src/app/providers/catalog/type.service';
import { ManufactureService } from 'src/app/providers/product/manufacture.service';
import { TaxClassService } from 'src/app/providers/tax/tax-class.service';
import { LengthService } from 'src/app/providers/unit/length.service';
import { WeightService } from 'src/app/providers/unit/weight.service';
import { AttributeService } from 'src/app/providers/product/attribute.service';
import { CategoryService } from 'src/app/providers/product/category.service';
import { ImageSnippet } from 'src/app/model/image-snippet';
import { CustomerGroupService } from 'src/app/providers/customer/customer-group.service';
import { Dateformat } from 'src/app/helper/dateformat';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  selectedCategories = [];
  selectedProducts = [];
  showError = false;
  errorMessage = '';

  categories: any = [];
  attributes: any = [];
  customerGroups: any = [];
  prices: any = [];
  products: any = [];

  public productAttributes: FormArray;
  public productPrices: FormArray;

  public pageHeading = 'Product Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  typeId: any;
  type: { id: any; name: any; };
  types: any;
  manufactureId: any;
  manufacture: { id: any; name: any; };
  manufactures: any;
  code: any;
  model: any;
  sku: any;
  name: any;
  priceType: any;
  priceTypes: { value: string; text: string; }[];
  price: any;
  mrp: any;
  image: any;
  imageThumb: any;
  selectedFile: ImageSnippet;
  description: any;
  text: any;
  taxClass: { id: any; name: any; };
  taxClassId: any;
  taxClasses: any;
  lengthClass: { id: any; name: any; };
  lengthClassId: any;
  lengthClasses: any;
  length: any;
  width: any;
  height: any;
  weightClass: { id: any; name: any; };
  weightClassId: any;
  weightClasses: any;
  weight: any;
  minimum: any;
  shipping: boolean;
  inventory: boolean;
  isLoading = false;

  public formErrors = {
    image: '',
    type: '',
    manufacture: '',
    code: '',
    model: '',
    sku: '',
    name: '',
    priceType: '',
    price: '',
    mrp: '',
    description: '',
    text: '',
    taxClass: '',
    lengthClass: '',
    length: '',
    width: '',
    height: '',
    weightClass: '',
    weight: '',
    minimum: '',
    shipping: '',
    inventory: '',
  };

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  // product prices
  get formPriceData() {
    return (this.fourthFormGroup.get('productPrices') as FormArray).controls;
  }

  createPrice(customerGroupId, price, start, end): FormGroup {
    return this.formBuilder.group({
      customerGroupId: new FormControl(customerGroupId),
      price: new FormControl(price),
      start: new FormControl(new Date(start)),
      end: new FormControl(new Date(end)),
    });
  }

  addPrice(): void {
    this.productPrices = <FormArray>this.fourthFormGroup.controls['productPrices'];
    this.productPrices.push(this.createPrice('', '', '', ''));
  }

  delPrice(index: number): void {
    const arrayControl = <FormArray>this.fourthFormGroup.controls['productPrices'];
    arrayControl.removeAt(index);
  }
  // end product prices

  // product attributes
  get formAttributeData() {
    return (this.fourthFormGroup.get('productAttributes') as FormArray).controls;
  }

  createAttribute(attributeId, text): FormGroup {
    return this.formBuilder.group({
      attributeId: new FormControl(attributeId),
      text: new FormControl(text),
    });
  }

  addAttribute(): void {
    this.productAttributes = <FormArray>this.fourthFormGroup.controls['productAttributes'];
    this.productAttributes.push(this.createAttribute('', ''));
  }

  delAttribute(index: number): void {
    const arrayControl = <FormArray>this.fourthFormGroup.controls['productAttributes'];
    arrayControl.removeAt(index);
  }

  // end product attributes

  onResetSelection() {
    this.selectedCategories = [];
  }

  constructor(
    private formBuilder: FormBuilder,
    public masterService: ProductService,
    public typeService: TypeService,
    public manufactureService: ManufactureService,
    public taxClassService: TaxClassService,
    public lengthService: LengthService,
    public weightService: WeightService,
    public attributeService: AttributeService,
    public categoryService: CategoryService,
    public customerGroupService: CustomerGroupService,
    private formService: FormService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,

  ) {

    const constant = new Constant();
    this.priceTypes = constant.priceTypes;


  }

  getId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ? this.activatedRoute.snapshot.paramMap.get('id') : 'new';
    return id;
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }


    this.getCategories();
    this.getProducts();
    this.getAttributes();
    this.getCustomerGroups();

    this.firstFormGroup = this.formBuilder.group({
      image: [this.image],
      type: [this.type, Validators.required],
      typeId: [this.typeId, Validators.required],
      manufacture: [this.manufacture, Validators.required],
      manufactureId: [this.manufactureId, Validators.required],
      code: [this.code, Validators.required],
      model: [this.model, Validators.required],
      sku: [this.sku, Validators.required],
      name: [this.name, Validators.required],
      priceType: [this.priceType, Validators.required],
      price: [this.price, Validators.required],
      mrp: [this.mrp, Validators.required],
      taxClass: [this.taxClass, Validators.required],
      taxClassId: [this.taxClassId, Validators.required],
      minimum: [this.minimum, Validators.required],
      shipping: [this.shipping, Validators.required],
      inventory: [this.inventory, Validators.required],
    });

    this.secondFormGroup = this.formBuilder.group({
      description: [this.description, Validators.required],
      text: [this.text, Validators.required],
    });

    this.thirdFormGroup = this.formBuilder.group({
      lengthClassId: [this.lengthClassId, Validators.required],
      lengthClass: [this.lengthClass, Validators.required],
      length: [this.length, Validators.required],
      width: [this.width, Validators.required],
      height: [this.height, Validators.required],
      weightClass: [this.weightClass, Validators.required],
      weightClassId: [this.weightClassId, Validators.required],
      weight: [this.weight, Validators.required],
    });

    this.fourthFormGroup = this.formBuilder.group({
      category: [this.selectedCategories],
      product: [this.selectedProducts],
      productAttributes: this.formBuilder.array([]),
      productPrices: this.formBuilder.array([])
    });

    this.setErrors();

    this.getTypeAutocomplete();
    this.getManufactureAutocomplete();
    this.getTaxClassAutocomplete();
    this.getLengthAutocomplete();
    this.getWeightAutocomplete();
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

  getCategories() {
    this.categoryService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.categories.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getProducts() {
    this.masterService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.products.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getCustomerGroups() {
    this.customerGroupService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.customerGroups.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getAttributes() {
    this.attributeService.list({}).subscribe(response => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < response.data.length; index++) {
        this.attributes.push({
          name: response.data[index].name,
          value: response.data[index].id,
        });
      }
    });
  }

  getTypeAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
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

  getManufactureAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('manufacture')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.manufactureService
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
          this.manufactures = res.data;
        }
      });
  }

  getTaxClassAutocomplete() {
    const constant = new Constant();
    this.firstFormGroup
      .get('taxClass')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.taxClassService
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
          this.taxClasses = res.data;
        }
      });
  }

  getLengthAutocomplete() {
    const constant = new Constant();
    this.thirdFormGroup
      .get('length')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.lengthService
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
          this.lengthClasses = res.data;
        }
      });
  }

  getWeightAutocomplete() {
    const constant = new Constant();
    this.thirdFormGroup
      .get('weight')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        tap(() => (this.isLoading = true)),
        switchMap(value =>
          this.weightService
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
          this.weightClasses = res.data;
        }
      });
  }

  onTypeSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.firstFormGroup.controls.typeId.setValue(event.option.value.id);
  }
  onManufactureSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.firstFormGroup.controls.manufactureId.setValue(event.option.value.id);
  }
  onTaxClassSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.firstFormGroup.controls.taxClassId.setValue(event.option.value.id);
  }
  onLengthClassSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.thirdFormGroup.controls.lengthClassId.setValue(event.option.value.id);
  }
  onWeightClassSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.thirdFormGroup.controls.weightClassId.setValue(event.option.value.id);
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }

  getDetail(id: string) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.typeId = response.data.type_id;
          this.type = {
            id: response.data.type_id,
            name: response.data.type
          };
          this.manufactureId = response.data.manufacture_id;
          this.manufacture = {
            id: response.data.manufacture_id,
            name: response.data.manufacture
          };
          this.code = response.data.code;
          this.model = response.data.model;
          this.sku = response.data.sku;
          this.name = response.data.name;
          this.image = response.data.image;
          this.imageThumb = response.data.image_thumb;
          this.priceType = response.data.price_type;
          this.price = response.data.price;
          this.mrp = response.data.mrp;
          this.description = response.data.description;
          this.text = response.data.text;
          this.taxClassId = response.data.tax_class_id;
          this.taxClass = {
            id: response.data.tax_class_id,
            name: response.data.tax_class
          };
          this.lengthClassId = response.data.length_class_id;
          this.lengthClass = {
            id: response.data.length_class_id,
            name: response.data.length_class
          };
          this.length = response.data.length;
          this.width = response.data.width;
          this.height = response.data.height;
          this.weightClassId = response.data.weight_class_id;
          this.weightClass = {
            id: response.data.weight_class_id,
            name: response.data.weight_class
          };
          this.weight = response.data.weight;
          this.minimum = response.data.minimum;
          this.shipping = response.data.shipping ? true : false;
          this.inventory = response.data.inventory ? true : false;

          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < response.data.categories.length; index++) {
            this.selectedCategories.push(response.data.categories[index].id);
          }
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < response.data.related_products.length; index++) {
            this.selectedProducts.push(response.data.related_products[index].id);
          }


          this.productAttributes = this.fourthFormGroup.get('productAttributes') as FormArray;

          if (response.data.attributes) {
            response.data.attributes.forEach(element => {
              this.productAttributes.push(
                this.createAttribute(
                  element.attribute_id,
                  element.text
                )
              );
            });
          }
          this.productPrices = this.fourthFormGroup.get('productPrices') as FormArray;

          if (response.data.prices) {
            response.data.prices.forEach(element => {
              this.productPrices.push(
                this.createPrice(
                  element.customer_group_id,
                  element.price,
                  element.start,
                  element.end,
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

  setErrors() {
    this.formErrors = this.formService.validateForm(
      this.firstFormGroup,
      this.formErrors,
      false
    );
    this.formErrors = this.formService.validateForm(
      this.secondFormGroup,
      this.formErrors,
      false
    );
    this.formErrors = this.formService.validateForm(
      this.thirdFormGroup,
      this.formErrors,
      false
    );
  }

  markFormGroupTouched() {
    this.formService.markFormGroupTouched(this.firstFormGroup);
    this.formService.markFormGroupTouched(this.secondFormGroup);
    this.formService.markFormGroupTouched(this.thirdFormGroup);
  }

  isFormValid() {
    let status = false;
    if (this.firstFormGroup.valid) {
      status = true;
    } else if (this.secondFormGroup.valid) {
      status = true;
    } else if (this.thirdFormGroup.valid) {
      status = true;
    }

    return status;
  }


  public onSubmit() {
    // mark all fields as touched
    this.markFormGroupTouched();
    if (this.isFormValid()) {

      const dateformat = new Dateformat();

      const prices = [];
      if (this.fourthFormGroup.value.productPrices) {
        this.fourthFormGroup.value.productPrices.forEach(element => {
          prices.push({
            customerGroupId: element.customerGroupId,
            price: element.price,
            start: dateformat.dateConvert(element.start),
            end: dateformat.dateConvert(element.end),
          });
        });
      }

      const data = {
        image: this.firstFormGroup.value.image,
        typeId: this.firstFormGroup.value.typeId,
        manufactureId: this.firstFormGroup.value.manufactureId,
        code: this.firstFormGroup.value.code,
        model: this.firstFormGroup.value.model,
        sku: this.firstFormGroup.value.sku,
        name: this.firstFormGroup.value.name,
        priceType: this.firstFormGroup.value.priceType,
        price: this.firstFormGroup.value.price,
        mrp: this.firstFormGroup.value.mrp,
        taxClassId: this.firstFormGroup.value.taxClassId,
        minimum: this.firstFormGroup.value.minimum,
        shipping: this.firstFormGroup.value.shipping,
        inventory: this.firstFormGroup.value.inventory,

        description: this.secondFormGroup.value.description,
        text: this.secondFormGroup.value.text,

        lengthClassId: this.thirdFormGroup.value.lengthClassId,
        length: this.thirdFormGroup.value.length,
        width: this.thirdFormGroup.value.width,
        height: this.thirdFormGroup.value.height,
        weightClassId: this.thirdFormGroup.value.weightClassId,
        weight: this.thirdFormGroup.value.weight,

        categories: this.fourthFormGroup.value.category,
        productAttributes: this.fourthFormGroup.value.productAttributes,

        prices,
        relatedProducts: this.fourthFormGroup.value.product
      };


      this.masterService.save(data, this.getId()).subscribe(
        response => {
          if (!response.status) {
            if (response.result) {
              response.result.forEach((element: { id: any; text: any; }) => {
                this.formErrors[`${element.id}`] = element.text;
              });
            }
          } else {
            // this.form.reset();
            this.router.navigate(['/products']);
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
      this.setErrors();
    }
  }

}
