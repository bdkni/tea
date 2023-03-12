import { Component } from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  private subscriptionPopup: Subscription | null = null;
  public observable: Observable<boolean>;
  modal: boolean = false;

  constructor() {
    this.observable = new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.modal = true);
      }, 10000);
    });
  }

  ngOnInit() {
    console.log(environment.production)
    this.subscriptionPopup = this.observable.subscribe((param: boolean) => {
      console.log(param);
    });
  }

  ngOnDestroy() {
    this.subscriptionPopup?.unsubscribe();
  }

  closePopup() {
    this.modal = false;
  }
}
