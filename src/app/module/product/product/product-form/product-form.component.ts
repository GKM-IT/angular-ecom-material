import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/providers/product/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/providers/form/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  public pageHeading = 'product Form';
  public data: any;
  public status: any;
  public message: any;
  public messageTitle: string;
  hide = true;
  typeId;
  type;
  types;
  manufactureId;
  manufacture;
  manufactures;
  code;
  model;
  sku;
  name;
  priceType;
  priceTypes = [
    {
      value: 'FIXED',
      text: 'Fixed',
    },
    {
      value: 'WEIGHT',
      text: 'Weight',
    },
    {
      value: 'LENGTH',
      text: 'Length',
    },
    {
      value: 'HOUR',
      text: 'Hour',
    },
  ];
  price;
  image;
  description;
  text;
  taxClass;
  taxClassId;
  taxClasses;
  lengthClass;
  lengthClassId;
  lengthClasses;
  length;
  width;
  height;
  weightClass;
  weightClassId;
  weightClasses;
  weight;
  minimum;
  shipping;
  inventory;


  public form: FormGroup;
  public formErrors = {
    type: '',
    manufacture: '',
    code: '',
    model: '',
    sku: '',
    name: '',
    priceType: '',
    price: '',
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

  constructor(
    public masterService: ProductService,
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
    this.router.navigate(['/products']);
  }

  ngOnInit() {

    if (this.getId() !== 'new') {
      this.getDetail(this.getId());
    }

    this.form = this.formBuilder.group({
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
      description: [this.description, Validators.required],
      text: [this.text, Validators.required],
      taxClass: [this.taxClass, Validators.required],
      taxClassId: [this.taxClassId, Validators.required],
      lengthClass: [this.lengthClass, Validators.required],
      length: [this.length, Validators.required],
      width: [this.width, Validators.required],
      height: [this.height, Validators.required],
      weightClass: [this.weightClass, Validators.required],
      weightClassId: [this.weightClassId, Validators.required],
      weight: [this.weight, Validators.required],
      minimum: [this.minimum, Validators.required],
      shipping: [this.shipping, Validators.required],
      inventory: [this.inventory, Validators.required],
    });

    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        true
      );
    });
  }

  getDetail(id) {
    this.masterService.detail(id).subscribe(
      response => {
        if (response.status) {
          this.typeId = response.data.type_id;
          this.manufactureId = response.data.manufacture_id;
          this.code = response.data.code;
          this.model = response.data.model;
          this.sku = response.data.sku;
          this.name = response.data.name;
          this.priceType = response.data.price_type;
          this.price = response.data.price;
          this.name = response.data.name;
          this.description = response.data.description;
          this.text = response.data.text;
          this.taxClassId = response.data.tax_class_id;
          this.lengthClassId = response.data.length_class_id;
          this.length = response.data.length;
          this.width = response.data.width;
          this.height = response.data.height;
          this.weightClassId = response.data.weight_class_id;
          this.weight = response.data.weight;
          this.minimum = response.data.minimum;
          this.shipping = response.data.shipping ? true : false;
          this.inventory = response.data.inventory ? true : false;
        }
      },
      err => {
        console.error(err);
      }
    );
  }


  public onSubmit() {
    console.log(this.form.value);
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
      this.formErrors = this.formService.validateForm(
        this.form,
        this.formErrors,
        false
      );
    }
  }

}
