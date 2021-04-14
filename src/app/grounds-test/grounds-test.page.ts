import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { SetresultGroundsService } from '../services/setresult-grounds.service';

import { ActivatedRoute } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
	selector: 'app-grounds-test',
	templateUrl: './grounds-test.page.html',
	styleUrls: [ './grounds-test.page.scss' ]
})
export class GroundsTestPage implements OnInit {
	opost = new Posts();

	assetid: String;
	testid: String;
	desktop: boolean;

	createTestForm = this.formBuilder.group({
		AssetID: [ '', [ Validators.required, Validators.pattern('^A[0-9]{3}'), Validators.maxLength(4) ] ],
		TestID: [ '', [ Validators.required, Validators.pattern('^T[0-9]{3}'), Validators.maxLength(4) ] ],
		comment: [ '' ],
		Result: [ '' ],
		DateCompleted: [ '' ]
	});

	constructor(
		private formBuilder: FormBuilder,
		private setresult: SetresultGroundsService,
		private alertCtrl: AlertController,
		private route: ActivatedRoute,
		private plt: Platform,
		private _sqlite: SqliteService
	) {}

	get assetID() {
		return this.createTestForm.get('AssetID');
	}
	get testID() {
		return this.createTestForm.get('TestID');
	}
	get comment() {
		return this.createTestForm.get('comment');
	}
	get result() {
		return this.createTestForm.get('Result');
	}
	get date() {
		return this.createTestForm.get('DateCompleted');
	}

	ngOnInit() {
		console.log(this.route.snapshot.params.assetid);
		this.assetid = this.route.snapshot.params.assetid;
		this.testid = this.route.snapshot.params.testid;
		if (this.plt.is("mobile") || this.plt.is("android") || this.plt.is("ios")) {
			this.desktop = false;
		  } else if (this.plt.is("desktop")) {
			this.desktop = true;
		  }
	}

	async onSave() {
		this.opost = this.createTestForm.value;

		if(this.desktop){

		console.log('Page Saved', this.opost);

		this.setresult.patch(this.opost).subscribe((data) => {
			console.log('Post method success?: ', data);
			if (data) {
				this.showAlert(true);
			} else {
				this.showAlert(false);
			}
		});
	}
	else{
		try{
			//connect
			const db = await this._sqlite.createConnection("martis",false,"no-encryption",1);
			  
			  //open
			  await db.open();
			  
			  //insert
			  let sqlcmd: string = 'UPDATE test SET Result = ?, DateCompleted = ?, comments = ? WHERE TestID = ?';
			  var p = this.opost;
			  let postableChanges = [
				p.Result,
				p.DataCompleted,
				p.comments,
				p.TestID
			  ];
			  let ret: any = await db.run(sqlcmd, postableChanges);
	  
			  //check update
			  if (ret.changes.changes !== 1) {
				return Promise.reject(new Error("Execution failed"));
			  }
			  
			  // Close Connection Martis
			  await this._sqlite.closeConnection("martis");
	  
			  await this.showAlert(true);
			  return Promise.resolve();
			} catch (err) {
				// Close Connection Martis
				await this._sqlite.closeConnection("martis");
			  await this.showAlert(false, err.message);
			}
	}
	}
	async showAlert(val, msg?) {
		await this.alertCtrl
			.create({
				header: 'Result',
				message: val ? 'Test info added Successfully' : 'Error: '+ msg,
				buttons: [
					{
						text: 'OK',
						handler: () => {
							this.createTestForm.reset();
						}
					}
				]
			})
			.then((res) => res.present());
	}
}

export class Posts {
	AssetID: string;
	TestID: string;
	DataCompleted: string;
	comments: string;
	Result: string;
}
