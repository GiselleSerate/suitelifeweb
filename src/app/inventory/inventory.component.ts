// Component displays list or pantry based on parameter. 

import { Component, Input} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InventoryItem } from '../inventoryItem'

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  @Input() inventoryType: string;
  userUid: string;
  inventory: [InventoryItem];
  
  currentUser: Observable<firebase.User>;
  currentUserData: Observable<any[]>;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.currentUser = afAuth.authState;
    this.currentUser.subscribe(res => {
      if(res && res.uid) {
        console.log("User logged in.");
        console.log(res.uid);
        this.userUid = res.uid;
        this.inventory = [] as [InventoryItem];
        var key ='/users/'.concat(res.uid, '/', this.inventoryType);
        this.currentUserData = db.list(key);
        this.currentUserData
          .subscribe(snapshots => {
            this.inventory = [] as [InventoryItem];
            snapshots.forEach(snapshot => {
              var itemKey = key.concat("/",snapshot.$key);
              var item = new InventoryItem(snapshot.checked, snapshot.name, snapshot.price, snapshot.uidString, db, itemKey);
              this.inventory.push(item);
            });
          })
      }
      else {
        console.log("User not logged in.")
        this.userUid = null;
        this.inventory = null;
        this.currentUserData = null;
      }
    })
  }

}
