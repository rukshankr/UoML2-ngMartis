import { Component, OnInit } from '@angular/core';
import { DatabaseService, Asset } from 'src/app/services/database.service';

@Component({
  selector: 'app-repair-list',
  templateUrl: './repair-list.page.html',
  styleUrls: ['./repair-list.page.scss'],
})
export class RepairListPage implements OnInit {

  constructor(
    private db: DatabaseService
  ) { }

  assets: Asset []= [];
  databaseReady : boolean = false;
  assetsGotten: boolean = false;
  dErr : string;

  ngOnInit() {
    this.db.getDatabaseState().subscribe((rdy) => {
      if (rdy) {
        this.databaseReady =true;

        this.db.getAssets().subscribe((a) => {
          this.assetsGotten = true;
          this.assets = a;
        });
      }
    });
    this.dErr = this.db.databaseErr;
  }

}
