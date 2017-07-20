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

import { UUID } from 'angular2-uuid';

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

  key: string;

  db: AngularFireDatabase;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.db = db;
    this.currentUser = afAuth.authState;
    this.currentUser.subscribe(res => {
      if(res && res.uid) {
        console.log("User logged in.");
        console.log(res.uid);
        this.userUid = res.uid;
        this.inventory = [] as [InventoryItem];
        this.key ='/users/'.concat(res.uid, '/', this.inventoryType);
        this.currentUserData = db.list(this.key);
        this.currentUserData
          .subscribe(snapshots => {
            this.inventory = [] as [InventoryItem];
            snapshots.forEach(snapshot => {
              var item = new InventoryItem(snapshot.checked, snapshot.name, snapshot.price, snapshot.uidString, db, this.key, snapshot.$key);
              this.inventory.push(item);
            });
          })
      }
      else {
        console.log("User not logged in.");
        this.userUid = null;
        this.inventory = null;
        this.currentUserData = null;
      }
    })
  }

  addItem() {
    console.log("Adding new item.");
    var uid = UUID.UUID();
    var newItem = new InventoryItem(false, "", 0, uid, this.db, this.key, this.inventory.length);
    newItem.save();
  }

  deleteSelected() {
    console.log("Deleting all the selected items.");
    var selectedItems = this.inventory.filter(item => !item.checked);

    this.inventory = [] as [InventoryItem];
    this.db.object(this.key).remove();

    selectedItems.forEach((item, index) => {
      item.index = index;
      item.save();
      this.inventory.push(item);
    });
  }

  selectAll() {
    console.log("Selecting all.");
    var set: boolean;
    if(this.inventory.every(item => item.checked)) { // If everything is checked.
      set = true;
    }
    else {
      set = false;
    }
    this.inventory.map(item => {
      item.checked = true;
      item.save();
    });
  }

}
