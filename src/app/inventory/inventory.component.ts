// Component displays list or pantry based on parameter. 

import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

  currentUserData: FirebaseListObservable<any[]>;
  currentUser: Observable<firebase.User>;
  selectUid: string;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.currentUser = afAuth.authState;
    this.currentUser.subscribe(res => {
      if(res && res.uid) {
        console.log("User logged in.");
        console.log(res.uid);
        this.currentUserData = db.list('/users/'.concat(res.uid, '/', this.inventoryType));
      }
      else {
        console.log("User not logged in.")
        this.currentUserData = null;
        console.log(this.currentUserData)
      }
    })
  }

  onSelect(uid: string) {
    this.selectUid = uid;
  }
}