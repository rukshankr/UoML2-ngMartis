import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { deleteDatabase } from 'src/assets/db-utils';
import { createSchema } from 'src/assets/martis-utils';

@Component({
  selector: 'app-repair-list',
  templateUrl: './repair-list.page.html',
  styleUrls: ['./repair-list.page.scss'],
})
export class RepairListPage implements OnInit {
  repairs = [];
  log: string = "";
  platform: string;
  handlerPermissions: any;
  initPlugin: boolean = false;

  constructor(private _sqlite: SqliteService, private alertCtrl: AlertController) {}

  async ngOnInit() {
    const showAlert = async (message: string) => {
      let msg = this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
      });
      (await msg).present();
    };
    try {
      await this.runTest();
      this.log += "\n$$$ runTest was successful\n";
    } catch (err) {
      this.log += "\n "+err.message;
      await showAlert(err.message);
    }
  }

  async runTest(): Promise<void> {
    try {
      let result: any = await this._sqlite.echo("Hello World");
      this.log += " from Echo " + result.value;
      // initialize the connection
      const db = await this._sqlite
                  .createConnection("martis", false, "no-encryption", 1);
      this.log +="\ndb connected " + db;

      // check if the databases exist
      // and delete it for multiple successive tests
      //await deleteDatabase(db);

      // open db testNew
      await db.open();
      this.log += "\ndb opened";
      // create tables in db
      // let ret: any = await db.execute(createSchema);
      // if (ret.changes.changes < 0) {
      //   return Promise.reject(new Error("Execute createSchema failed"));
      // }

      // create synchronization table 
      let ret: any = await db.createSyncTable();
      console.log('$$$ createSyncTable ret.changes.changes in db ' + ret.changes.changes)
      
      // set the synchronization date
      const syncDate: string = "2020-11-25T08:30:25.000Z";
      await db.setSyncDate(syncDate);

      // select all assets in db
      ret = await db.query("SELECT * FROM repair;");
      this.repairs = ret.values;
      if(ret.values.length !== 3) {
        return Promise.reject(new Error("Query 2 asset failed"));
      }
      this.log +="\nquery done.";
      // Close Connection MyDB        
      await this._sqlite.closeConnection("martis"); 
      this.log += "\n> closeConnection 'myDb' successful\n";

      return Promise.resolve();
    } catch (err) {
      this.log += "\nrejected";
      return Promise.reject(err);
    }
  }

}
