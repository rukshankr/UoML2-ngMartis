import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ObserveOnOperator } from "rxjs/internal/operators/observeOn";
//import { Observable } from "rxjs/Observable"

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  Login() {
    var observable = Observable.create((observer: any) => {
      observer.next("Hey guys!");
    });

    observable.subscribe((x: any) => console.log(x));

    console.log("Check!!");
  }
}
