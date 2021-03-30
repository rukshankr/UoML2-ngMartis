import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Posts } from '../repair-form/repair-form.page';

@Injectable({
	providedIn: 'root'
})
export class CreateRepairService {
	constructor(private http: HttpClient) {}

	put(opost: Posts): Observable<any> {
		return this.http.put('https://martisapiversion1.herokuapp.com/repair/addCompletedDateAndComments', opost);
	}
}
