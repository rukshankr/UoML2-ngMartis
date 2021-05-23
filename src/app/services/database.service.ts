import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

export interface Asset {
	AssetID: string;
	Status: string;
	GPSLatitude: string;
	GPSLongitude: string;
	Region: string;
	Division: string;
	SubDivision: string;
	NearestMilePost: string;
	LastTestedDate: string;
}

export interface Test {
	TestID: string;
	DateIssued: string;
	AssetID: string;
	InspectorID: string;
	Result: string;
	SupervisorID: string;
	DateCompleted: string;
	Frequency: string;
	Priority: string;
	TestModID: string;
	comments: string;
}
export interface Repair {
	AssetID: string;
	EngineerID: string;
	CreatedDate: string;
	CompletedDate: string;
	comments: string;
}

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	
	constructor(
		private http: HttpClient
	){}

	//full db import 
	fullImportAll(): Promise<Object> {
		return this.http.get('https://martisapiversion1.herokuapp.com/sync/export').toPromise();
	}

	partialImportAll(last_modified: number): Promise<Object>{
		
		return this.http.get(`https://martisapiversion1.herokuapp.com/sync/partialexport?last_modified=${last_modified}`).toPromise();
			
	}

	//full db export
	fullExportAll(exported: Object): Observable <any> {
		return this.http.post("https://martisapiversion1.herokuapp.com/sync/fullimport",exported);
	  }

	//delete rows that should be deleted
	deleteDeletables() : Promise<Object>{
		return this.http.delete("https://martisapiversion1.herokuapp.com/sync/delete").toPromise();
	}
}
