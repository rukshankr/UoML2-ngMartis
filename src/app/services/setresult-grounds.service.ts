import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Posts } from '../grounds-test/grounds-test.page';

@Injectable({
	providedIn: 'root'
})
export class SetresultGroundsService {
	constructor(private http: HttpClient) {}

	patch(opost: Posts): Observable<any> {
		return this.http.patch('https://martisapiversion1.herokuapp.com/test/setresult', opost);
	}
	post(opost: Posts): Observable<any> {
		return this.http.post('https://martisapiversion1.herokuapp.com/test/createNewTest', opost);
	}
}
