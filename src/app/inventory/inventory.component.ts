// Component displays list or pantry based on parameter. 

import { Component, Input} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InventoryItem } from '../inventoryItem';

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { UUID } from 'angular2-uuid';
import { Group } from '../group'

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  @Input() inventoryType: string; // Either list or pantry. 
  @Input() group: Group; // A Group type instance. 

  userUid: string;  // User's authid, for passing to other components. 
  path: string;     // A path leading to this inventory in the database. 

  db: AngularFireDatabase; // A reference to the database. 

  inventory: [InventoryItem]; // Local array of objects so that this component can iterate over them to do stuff to its own list. 
  
  currentUser: Observable<firebase.User>;  // An observable for the user that is logged in. 
  currentUserData: Observable<any[]>;      // An observable for the inventory corresponding to this component. 

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.db = db;
    this.currentUser = afAuth.authState;

    this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        // Assign this-component-scope properties to give to other components.
        this.userUid = res.uid;

        // Set path variable. 
        if(this.group.groupID == "personal") {
          this.path ='/users/'.concat(res.uid, '/', this.inventoryType);
        }
        else {
          this.path ='/groups/'.concat(this.group.groupID, '/', this.inventoryType);
        }

        this.currentUserData = db.list(this.path); // Attach observable to the correct path. 
        this.currentUserData.subscribe(snapshots => { // Begin observable's subscription. 
          this.inventory = [] as [InventoryItem]; // Clear inventory array. 
          snapshots.forEach(snapshot => { // Iterate over snapshots and initialize items. 
            var item = new InventoryItem(snapshot.checked, snapshot.name, snapshot.price, snapshot.uidString, db, this.path, snapshot.$key);
            this.inventory.push(item); // Put the items into the local array. 
          });
        })
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user. 
        this.userUid = null;
        this.inventory = null;
        this.currentUserData = null;
      }
    })
  }

  addItem() {
    console.log("Adding new item.");

    var uid = UUID.UUID(); // Generate new UUID for the new item you are adding. 
    var newItem = new InventoryItem(false, "", 0, uid, this.db, this.path, this.inventory.length); // Create new item.
    newItem.save(); // Save new item to database. 
  }

  deleteSelected() {
    console.log("Deleting all the selected items.");

    var unselectedItems = this.inventory.filter(item => !item.checked);

    this.inventory = [] as [InventoryItem];  // Clear inventory. 
    this.db.object(this.path).remove();      // Remove the entire list object. 

    unselectedItems.forEach((item, index) => { // Iterate over unselected items. 
      item.index = index;          // Reindex. 
      item.save();                 // Save to database.
      this.inventory.push(item);   // Save to local array. 
    });
  }

  selectAll() {
    console.log("Selecting all.");

    var set: boolean;

    if(this.inventory.every(item => item.checked)) { // If everything is checked, then uncheck everything.
      set = true;
    }
    else { // Else there are some things that are not checked, so check them.
      set = false;
    }

    this.inventory.map(item => { // Set or unset checks as determined above, and save to database. 
      item.checked = set;
      item.save();
    });
  }

}
