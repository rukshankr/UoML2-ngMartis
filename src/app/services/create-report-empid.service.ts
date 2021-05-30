import { Injectable } from "@angular/core";

import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Posts } from "../pages/report-generation/report-generation.page";
import { Aposts } from "../report-generation-asset/report-generation-asset.page";

import { AutoCompleteService } from "ionic4-auto-complete";

@Injectable({
  providedIn: "root",
})
export class CreateReportEmpidService {
  labelAttribute = "name";
  formValueAttribute = "numericCode";

  constructor(private http: HttpClient) {}

  post(opost: Posts): Observable<any> {
    return this.http.post(
      "https://martisapiversion1.herokuapp.com/report/getReports",
      opost
    );
  }

  getEmps(): Observable<any> {
    return this.http.get(
      "https://martisapiversion1.herokuapp.com/user/getInspectors"
    );
  }

  getAssets(): Observable<any> {
    return this.http.get(
      "https://martisapiversion1.herokuapp.com/asset/getAssets"
    );
  }

  getAssetReport(opost: Aposts): Observable<any> {
    return this.http.post(
      "https://martisapiversion1.herokuapp.com/report/getAssetReports",
      opost
    );
  }
}
