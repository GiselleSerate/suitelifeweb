import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{

  @Input() checked;
  @Input() name;
  @Input() price;
  @Input() index;
  @Input() uidString;
  @Input() inventoryType;
  @Input() userUid;
  db: AngularFireDatabase;

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
    this.db = db;
  }

  ngOnInit() {
  }

  save() {
    console.log("Saving item with name: ".concat(this.name,", uid: ",this.uidString),", index: ",this.index)
    this.db.object("/users/".concat(this.userUid,"/",this.inventoryType,"/",this.index)).update({
      "checked": this.checked,
      "name": this.name,
      "price": this.price,
      "uidString": this.uidString
    })
  }
}
