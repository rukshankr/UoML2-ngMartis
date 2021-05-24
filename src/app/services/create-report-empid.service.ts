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
export class CreateReportEmpidService implements AutoCompleteService {
  labelAttribute = "name";
  formValueAttribute = "numericCode";

  constructor(private http: HttpClient) {}

  getResults(keyword: string) {
    if (!keyword) {
      return false;
    }

    return this.http
      .get("https://restcountries.eu/rest/v2/name/" + keyword)
      .pipe(
        map((result: any[]) => {
          return result.filter((item) => {
            return item.name.toLowerCase().startsWith(keyword.toLowerCase());
          });
        })
      );
  }

  post(opost: Posts): Observable<any> {
    return this.http.post(
      "https://martisapiversion1.herokuapp.com/report/getReports",
      opost
    );
  }

  getEmps(): Observable<any> {
    return this.http.get(
      "https://martisapiversion1.herokuapp.com/user/getEmps"
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
