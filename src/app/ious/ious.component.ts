import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { User } from '../user';

@Component({
  selector: 'app-ious',
  templateUrl: './ious.component.html',
  styleUrls: ['./ious.component.css']
})
export class IousComponent implements OnInit {

  db: AngularFireDatabase; // A reference to the database. 

  people: [User]; // Local array of people so that this component can access all debtors/debtees.  
  
  currentUser: Observable<firebase.User>;  // An observable for the user that is logged in. 
  currentUserData: Observable<any[]>;      // An observable for the people list. 

  path: string; // Stores the database reference to the debts part of the tree. 

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.db = db;
    this.currentUser = afAuth.authState;

    this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.

        this.path ='/users/'.concat(res.uid, '/debts');

        this.currentUserData = db.list(this.path); // Attach observable to the correct path. 
        this.currentUserData.subscribe(snapshots => { // Begin observable's subscription. 
		      this.people = [] as [User]; // Clear inventory array. 
		      snapshots.forEach(snapshot => { // Iterate over snapshots and initialize items. 
		        var item = new User(res.uid, snapshot.$key, snapshot.$value, this.db);
		        item.init();
		        this.people.push(item); // Put the items into the local array. 
		      });
		    })
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user. 
        this.people = null;
        this.currentUserData = null;
      }
    })
  }

  ngOnInit() {
  }

}
