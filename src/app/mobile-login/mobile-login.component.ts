import { Component, OnInit } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { DeviceAuthService } from '../services/device-auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
	selector: 'app-mobile-login',
	templateUrl: './mobile-login.component.html',
	styleUrls: [ './mobile-login.component.scss' ]
})
export class MobileLoginComponent implements OnInit {
	Deviceid;
	availableDevice;
	newPinForm = this.formBuilder.group({
		Pin: [ '', [ Validators.required, Validators.pattern('^[0-9]{4}'), Validators.maxLength(4) ] ],
		EMPID: [ '', [ Validators.required, Validators.pattern('^EMP[0-9]{3}'), Validators.maxLength(6) ] ]
	});
	constructor(
		private uniqueDeviceID: UniqueDeviceID,
		private deviceAuth: DeviceAuthService,
		private formBuilder: FormBuilder,
		private toastController: ToastController,
		private router: Router
	) {}

	ngOnInit() {
		this.getUniqueDeviceID();
		this.deviceAuth.getDevice(this.Deviceid).subscribe((device) => {
			this.availableDevice = device.data[0].PIN;
			console.log(device.data[0]);
		});
	}

	getUniqueDeviceID() {
		this.uniqueDeviceID
			.get()
			.then((uuid: any) => {
				console.log(uuid);
				this.Deviceid = uuid;
			})
			.catch((error: any) => {
				console.log(error);
				this.Deviceid = error;
			});
	}

	async onSave() {
		console.log(this.newPinForm.value.Pin);
		const toast = await this.toastController.create({
			message: 'There was an error. Please try Again',
			duration: 2000
		});
		this.deviceAuth
			.setPin(this.Deviceid, this.newPinForm.value.Pin, this.newPinForm.value.EMPID)
			.subscribe((data) => {
				console.log(Object.keys(data.message).length);
				if (Object.keys(data.message).length == 0) {
					toast.present();
					this.newPinForm.reset();
				} else {
					this.router.navigateByUrl('/selection');
				}
			});
	}
}
