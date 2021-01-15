import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { InspectionService } from "src/app/services/create-inspection.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-create-inspection',
  templateUrl: './create-inspection.page.html',
  styleUrls: ['./create-inspection.page.scss'],
})
export class CreateInspectionPage implements OnInit {
  results: object[]; 

  inspectionPost = new InspectionPosts();

  get testId(){
    return this.createInspectionForm.get('TestID');
  };
  get insId(){
    return this.createInspectionForm.get('InspectorID');
  };
  get supId(){
    return this.createInspectionForm.get('SupervisorID');
  };
  get assetId(){
    return this.createInspectionForm.get('AssetID');
  }

  public errorMessage = {
    testID: [
      {type: 'required', message: 'Test ID is required'},
      {type: 'pattern', message: 'Must be in the form: T000'}
    ],
    empID: [
      {type: 'required', message: 'Employee ID is required'},
      {type: 'pattern', message: 'Must be in the form: EMP000'}
    ],
    assetID: [
      {type: 'required', message: 'Asset ID is required'},
      {type: 'pattern', message: 'Must be in the form: A000'}
    ]
  };


  createInspectionForm = this.formBuilder.group({
    TestID: [null ,[Validators.required,Validators.pattern('^T[0-9]{3}')]],
    AssetID: ["",[Validators.required,Validators.pattern('^A[0-9]{3}')]],
    InspectorID: ["",[Validators.required,Validators.pattern('^EMP[0-9]{3}')]],
    SupervisorID: ["",[Validators.required,Validators.pattern('^EMP[0-9]{3}')]],
    Frequency: [""],
    TestModuleID: ["",[Validators.required,Validators.pattern('^TM[0-9]{3}')]],
    Priority: [""]
  });

  constructor(
    private formBuilder: FormBuilder,
    private inspectionService: InspectionService,
    private geolocation: Geolocation,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  onSave() {
    this.inspectionPost = this.createInspectionForm.value;

    console.log("Page Saved", this.inspectionPost);

     this.inspectionService.post(this.inspectionPost).subscribe((data) => {
      console.log("Post method success?: ", data.reply);
      if(data.reply === "Error"){
        this.showAlert(false);
      }else{
        this.showAlert(true);
      }
    });



}

async showAlert(val){
  await this.alertCtrl.create({
    header: "Result",
    message: val ? "Test added Sucessfully": "Error",
    buttons: [{
      text: "OK",
      handler: () =>{
        this.createInspectionForm.reset();
      }
    }]
  }).then(res => res.present())
}

}

export class InspectionPosts {
  TestID: string;
  AssetID: string;
  InspectorID: string;
  SupervisorID: string;
  Frequency: string;
  TestModID: string;
  Priority: string;
}