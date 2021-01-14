import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
// import { TIMEOUT } from 'dns';
// import { type } from 'os';
// import { timer } from 'rxjs';

@Component({
	selector: 'app-selection',
	templateUrl: './selection.page.html',
	styleUrls: [ './selection.page.scss' ]
})
export class SelectionPage implements OnInit {
	constructor(public atrCtrl: AlertController) {}

	async showError(data: any) {
		let alert = this.atrCtrl.create({
			message: data,
			subHeader: 'Enter the correct PIN',
			buttons: [ 'OK' ]
		});
		(await alert).present();
	}

	async ionViewWillEnter() {
		let alert = this.atrCtrl.create({
			message: 'Enter PIN',
			inputs: [
				{
					name: 'pin',
					placeholder: 'Enter PIN',
					type: 'password'
				}
			],
			buttons: [
				{
					text: 'Forgot password',
					role: 'cancel',
					handler: async (data) => {
						console.log('You forgot password');
						let alert = this.atrCtrl.create({
							message: 'Forgot Password?',
							subHeader: 'Enter the email',
							inputs: [
								{
									name: 'email',
									placeholder: 'Enter email'
								}
							],
							buttons: [ 'OK' ]
						});
						(await alert).present();
					}
				},
				{
					text: 'Login',
					handler: (data) => {
						if (data.pin == '1234') {
							console.log('Success');
						} else {
							console.log('fail');
							this.showError('Invalid PIN');

							return false;
						}
					}
				}
			]
		});
		(await alert).present();
	}

	ngOnInit() {}
}
