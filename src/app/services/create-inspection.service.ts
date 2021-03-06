import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Posts } from "../pages/create-inspection/create-inspection.page";

@Injectable({
  providedIn: "root",
})
export class InspectionService {
  /**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
  constructor(private http: HttpClient) {}

  ////////////////if this doesn't work, it's not an error here, but in the API//////////////////////
  post(opost: Posts): Observable<any> {
    return this.http.post(
      "https://martisapiversion1.herokuapp.com/test/createNewTest",
      opost
    );
  }

  getLatestTest(): Observable<any> {
    return this.http.get(
      "https://martisapiversion1.herokuapp.com/test/getLatestTest"
    );
  }

  getInspectors(): Observable<any> {
    return this.http.get(
      "https://martisapiversion1.herokuapp.com/user/getInspectors"
    );
  }

  getManagers(): Observable<any> {
    return this.http.get(
      "https://martisapiversion1.herokuapp.com/user/getManagers"
    );
  }
}
