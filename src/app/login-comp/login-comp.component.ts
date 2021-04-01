import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";

import { OktaAuthService } from "@okta/okta-angular";
import * as OktaSignIn from "@okta/okta-signin-widget";

@Component({
  selector: "app-secure",
  template: `
    <!-- Container to inject the Sign-In Widget -->
    <div id="okta-signin-container"></div>
  `,
})
export class LoginComponent implements OnInit {
  authService;
  widget = new OktaSignIn({
    el: "#okta-signin-container",
    baseUrl: "https://dev-44560058.okta.com",
    authParams: {
      pkce: true,
    },
    clientId: "0oag5ujmllTDi2zrM5d6",
    redirectUri: "http://localhost:8100/selection",
  });

  constructor(oktaAuth: OktaAuthService, router: Router) {
    this.authService = oktaAuth;

    // Show the widget when prompted, otherwise remove it from the DOM.
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        switch (event.url) {
          case "/login":
            break;
          case "/test":
            break;
          default:
            this.widget.remove();
            break;
        }
      }
    });
  }

  ngOnInit() {
    this.widget.showSignInAndRedirect().catch((err) => {
      throw err;
    });
  }
}
