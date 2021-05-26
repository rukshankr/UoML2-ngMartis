import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Posts } from '../pages/create-asset/create-asset.page';

// Typescript custom enum for search types (optional)
export enum SearchType {
	all = '',
	movie = 'movie',
	series = 'series',
	episode = 'episode'
}

@Injectable({
	providedIn: 'root'
})
export class AssetService {
	/**
   * Constructor of the Service with Dependency Injection
   * @param http The standard Angular HttpClient to make requests
   */
	constructor(private http: HttpClient) {}

	////////////////if this doesn't work, it's not an error here, but in the API//////////////////////
	post(opost: Posts): Observable<any> {
		return this.http.post('https://martisapiversion1.herokuapp.com/asset/createNewAsset', opost);
	}

	getAssets(): Observable<any> {
		return this.http.get('https://martisapiversion1.herokuapp.com/asset/getAssets');
	}

	getLatestAsset(): Observable<any> {
		return this.http.get('https://martisapiversion1.herokuapp.com/asset/getLatestAsset');
	}

	getTestNoForAssets(page: number): Observable<any> {
		return this.http.get(`https://martisapiversion1.herokuapp.com/asset/getAssetsTests?page=${page}&limit=5`);
	}

	getAssignedTestsByAssetID(AssetID): Observable<any> {
		return this.http.get(`https://martisapiversion1.herokuapp.com/test/getTestsByAssetID?AssetID=${AssetID}`);
	  }
	
	getAssignedRepairsByAssetID(AssetID): Observable<any> {
		return this.http.get(`https://martisapiversion1.herokuapp.com/repair/getRepairsByAssetID?AssetID=${AssetID}`);
	  }

	setAssetAsFunctional(AssetID):Observable <any> {
		return this.http.patch(`https://martisapiversion1.herokuapp.com/asset/setAssetAsFunctional`,{assetId: AssetID})
	}
}
