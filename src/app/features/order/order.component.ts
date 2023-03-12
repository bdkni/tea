import { Component } from '@angular/core';
import {ProductService} from "../../shared/services/product.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private http: HttpClient) {
  }

  modal: boolean = false;
  orderButton: boolean = false;

  signInForm = new FormGroup({
    product: new FormControl(''),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[А-ЯA-z]{1}[а-яa-z]{1,19}$/)
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[А-ЯA-z]{1}[а-яa-z]{1,19}$/)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^([+]?[0-9\s-\(\)]{11})*$/i),
    ]),
    country: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-zА-яЁё]*$/)
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.pattern( /^[А-яA-ZЕёa-zа-я0-9\-\s/]*$/)
    ]),
    zip: new FormControl('', [
      Validators.required,
      Validators.pattern(/[0-9]{6}/)
    ]),
    comment: new FormControl(''),
  })

  get name() {return this.signInForm.get('name');}
  get last_name() {return this.signInForm.get('last_name');}
  get phone() {return this.signInForm.get('phone');}
  get country() {return this.signInForm.get('country');}
  get address() {return this.signInForm.get('address');}
  get zip() {return this.signInForm.get('zip');}

  private subscription: Subscription | null = null;
  private subscriptionOrder: Subscription | null = null;

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe((params) =>  {
      if(params['product']) {
        this.signInForm.patchValue({
          product: params['product'],
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscriptionOrder?.unsubscribe();
  }

  public createOrder() {
    this.subscriptionOrder = this.postData()
      .subscribe(response => {
        if(response.success) {
          this.modal = true;
          this.signInForm.reset();
        } else {
          this.orderButton = true;
        }
      })
  }

  postData() {
    return this.http.post<{ success: boolean, message?: string }>(environment.apiURL + 'order-tea', this.signInForm.value);
  }

  closePopup() {
    this.modal = false;
  }

}
