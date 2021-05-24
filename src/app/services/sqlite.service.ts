import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
	CapacitorSQLite,
	SQLiteDBConnection,
	SQLiteConnection,
	capSQLiteSet,
	capSQLiteChanges,
	capEchoResult,
	capSQLiteResult
} from '@capacitor-community/sqlite';
import { Coords } from '../pages/inspection-list/inspection-list.page';

@Injectable()
export class SqliteService {
	sqlite: SQLiteConnection;
	isService: boolean = false;
	platform: string;

	constructor() {}
	/**
     * Plugin Initialization
     */
	initializePlugin(): Promise<boolean> {
		return new Promise((resolve) => {
			this.platform = Capacitor.getPlatform();
			console.log('*** platform ' + this.platform);
			const sqlitePlugin: any = CapacitorSQLite;
			this.sqlite = new SQLiteConnection(sqlitePlugin);
			this.isService = true;
			console.log('$$$ in service this.isService ' + this.isService + ' $$$');
			resolve(true);
		});
	}
	/**
 * Echo a value
 * @param value 
 */
	async echo(value: string): Promise<capEchoResult> {
		console.log('&&&& in echo this.sqlite ' + this.sqlite + ' &&&&');
		if (this.sqlite != null) {
			return await this.sqlite.echo(value);
		} else {
			return null;
		}
	}
	/**
 * addUpgradeStatement
 * @param database 
 * @param fromVersion 
 * @param toVersion 
 * @param statement 
 * @param set 
 */
	async addUpgradeStatement(
		database: string,
		fromVersion: number,
		toVersion: number,
		statement: string,
		set?: capSQLiteSet[]
	): Promise<void> {
		if (this.sqlite != null) {
			try {
				await this.sqlite.addUpgradeStatement(database, fromVersion, toVersion, statement, set ? set : []);
				return Promise.resolve();
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open for ${database}`));
		}
	}
	/**
 * Create a connection to a database
 * @param database 
 * @param encrypted 
 * @param mode 
 * @param version 
 */
	async createConnection(
		database: string,
		encrypted: boolean,
		mode: string,
		version: number
	): Promise<SQLiteDBConnection> {
		if (this.sqlite != null) {
			try {
				const db: SQLiteDBConnection = await this.sqlite.createConnection(database, encrypted, mode, version);
				if (db != null) {
					return Promise.resolve(db);
				} else {
					return Promise.reject(new Error(`no db returned is null`));
				}
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open for ${database}`));
		}
	}
	/**
 * Close a connection to a database
 * @param database 
 */
	async closeConnection(database: string): Promise<void> {
		if (this.sqlite != null) {
			try {
				await this.sqlite.closeConnection(database);
				return Promise.resolve();
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open for ${database}`));
		}
	}
	/**
 * Retrieve an existing connection to a database
 * @param database 
 */
	async retrieveConnection(database: string): Promise<SQLiteDBConnection> {
		if (this.sqlite != null) {
			try {
				return Promise.resolve(await this.sqlite.retrieveConnection(database));
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open for ${database}`));
		}
	}
	/**
 * Retrieve all existing connections
 */
	async retrieveAllConnections(): Promise<Map<string, SQLiteDBConnection>> {
		if (this.sqlite != null) {
			try {
				const myConns = await this.sqlite.retrieveAllConnections();
				let keys = [ ...myConns.keys() ];
				keys.forEach((value) => {
					console.log('Connection: ' + value);
				});
				return Promise.resolve(myConns);
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open`));
		}
	}
	/**
 * Close all existing connections
 */
	async closeAllConnections(): Promise<void | capSQLiteResult> {
		if (this.sqlite != null) {
			try {
				return Promise.resolve(await this.sqlite.closeAllConnections());
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open`));
		}
	}
	/**
 * Import from a Json Object
 * @param jsonstring 
 */
	async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
		if (this.sqlite != null) {
			try {
				return Promise.resolve(await this.sqlite.importFromJson(jsonstring));
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open`));
		}
	}
	/**
 * Is Json Object Valid
 * @param jsonstring Check the validity of a given Json Object
 */
	async isJsonValid(jsonstring: string): Promise<capSQLiteResult> {
		if (this.sqlite != null) {
			try {
				return Promise.resolve(await this.sqlite.isJsonValid(jsonstring));
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open`));
		}
	}
	/**
 * Copy databases from public/assets/databases folder to application databases folder
 */
	async copyFromAssets(): Promise<void | capSQLiteResult> {
		if (this.sqlite != null) {
			try {
				return Promise.resolve(await this.sqlite.copyFromAssets());
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			return Promise.reject(new Error(`no connection open`));
		}
	}

	haversine(empCoords: Coords, assetCoords: Coords): number {
		function deg2rad(deg) {
			return deg * (Math.PI / 180);
		}
		var lat1: number = empCoords.latitude;
		var lat2: number = assetCoords.latitude;
		var lon1: number = empCoords.longitude;
		var lon2: number = assetCoords.longitude;

		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2 - lat1); // deg2rad func
		var dLon = deg2rad(lon2 - lon1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c * 1000; // Distance in meters
		return d;
	}
}
