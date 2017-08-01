import { Component } from '@angular/core';

// These imports are all for Firebase.---------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { Group } from './group'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  currentUser: Observable<firebase.User>;
  currentUserData: Observable<any>;
  groups: [Group];
  userExists: boolean;
  db: AngularFireDatabase;
  matchingUsers: FirebaseListObservable<any>;
  dummy: string;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.currentUser = afAuth.authState;
    this.db = db;

    this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        //TODO: Remove this line once we've got photoURLs for most of our users
        this.db.object('/users/'.concat(res.uid,'/','photoURL')).set(res.photoURL);

        this.matchingUsers = this.db.list('/users/', { query: {
          orderByKey: !null,
          equalTo: res.uid
        }})
        this.matchingUsers.subscribe(snapshots => {
          this.userExists = snapshots.length != 0;
          this.dummy = this.userExists ? snapshots[0].$key : "user dne"
        })

        this.currentUserData = db.list('/users/'.concat(res.uid, '/groups/')); // Attach observable to path of my groups. 
        this.currentUserData.subscribe(snapshots => { // Begin observable's subscription. 
          console.log("refresh groups");
          this.groups = [] as [Group]; // Clear groups array. 
          var personalGroup = new Group('personal', db); // Put personal "group" before you start loading other groups.
          personalGroup.init();
          this.groups.push(personalGroup);

          snapshots.forEach(snapshot => { // Iterate over snapshots and write them to groups. 
            var item = new Group(snapshot.$key, db);
            item.init();
            this.groups.push(item); // Put the items into the local array. 
          });
        })
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user. 
        this.groups = null;
        this.currentUserData = null;
      }
    })
  }


  ngOnInit() {
    firebase.initializeApp(environment.firebase); // Maybe this doesn't go here. But it's working, so. 
  }
}
