import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../user';

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  db: AngularFireDatabase; // A reference to the database. 

  me: User;

  currentUser: Observable<firebase.User>;  // An observable for the user that is logged in. 
  currentUserData: Observable<any[]>;      // An observable for the inventory corresponding to this component. 

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.db = db;
    this.currentUser = afAuth.authState;

    // this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
    //   if(res && res.uid) { // User logged in.
    //     // Assign this-component-scope properties to give to other components.
    //     this.userUid = res.uid;

    //     // Set path variable. 
    //     if(this.group.groupID == "personal") {
    //       this.path ='/users/'.concat(res.uid, '/', this.inventoryType);
    //     }
    //     else {
    //       this.path ='/groups/'.concat(this.group.groupID, '/', this.inventoryType);
    //     }

    //     this.currentUserData = db.list(this.path); // Attach observable to the correct path. 
    //     this.currentUserData.subscribe(snapshots => { // Begin observable's subscription. 
    //       this.inventory = [] as [InventoryItem]; // Clear inventory array. 
    //       snapshots.forEach(snapshot => { // Iterate over snapshots and initialize items. 
    //         var item = new InventoryItem(snapshot.checked, snapshot.name, snapshot.price, snapshot.uidString, db, this.path, snapshot.$key);
    //         this.inventory.push(item); // Put the items into the local array. 
    //       });
    //     })
    //   }
    //   else { // User not logged in.
    //     // Unassign all variables storing information about the user. 
    //     this.userUid = null;
    //     this.inventory = null;
    //     this.currentUserData = null;
    //   }
    // })
  }
  
  ngOnInit() {
  }

}
