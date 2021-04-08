import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";

import { OktaAuthService } from "@okta/okta-angular";
import * as OktaSignIn from "@okta/okta-signin-widget";

@Component({
  selector: "app-secure",
  // template: `
  //   <!-- Container to inject the Sign-In Widget -->
  //   <div id="okta-signin-container"></div>
  // `,
  templateUrl: "./login-comp.component.html",
  styleUrls: ["./login-comp.component.scss"],
})
export class LoginComponent implements OnInit {
  //authService;
  // widget = new OktaSignIn({
  //   el: "#okta-signin-container",
  //   baseUrl: "https://dev-44560058.okta.com",
  //   authParams: {
  //     pkce: true,
  //   },
  //   clientId: "0oag5ujmllTDi2zrM5d6",
  //   redirectUri: "http://localhost:8100/login/callback",
  //   postLogoutRedirectUri: "http://localhost:4200/login",
  // });

  constructor(private oktaAuth: OktaAuthService, router: Router) {}
  //   this.authService = oktaAuth;
  //   //Show the widget when prompted, otherwise remove it from the DOM.
  //   router.events.forEach((event) => {
  //     if (event instanceof NavigationStart) {
  //       switch (event.url) {
  //         case "/login":
  //           break;
  //         case "/test":
  //           break;
  //         default:
  //           this.widget.remove();
  //           break;
  //       }
  //     }
  //   });
  // }

  isAuthenticated: boolean;
  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  }
  //   this.widget.showSignInAndRedirect().catch((err) => {
  //     throw err;
  //   });
  // }

  login() {
    this.oktaAuth.signInWithRedirect({
      originalUri: "/selection",
    });
  }
}
