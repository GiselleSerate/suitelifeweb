import { Component, OnInit, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';

// These imports are all for Firebase.---------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { Group } from '../group'

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.css']
})
export class GroupsEditComponent implements OnInit {
  @Input() groups: [Group];
  showAddGroup: boolean;
  newGroup: Group;
  db: AngularFireDatabase;
  currentUser: Observable<firebase.User>;
  afAuth: AngularFireAuth;
  globalGroupsRef: FirebaseListObservable<any>;
  myGroupsRef: FirebaseListObservable<any>;
  myID: string;

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {     
    this.currentUser = afAuth.authState;

    this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        this.myID = res.uid;
        this.globalGroupsRef = db.list('/groups/'); // Attach observable to the global path. 
        this.myGroupsRef = db.list('/users/'.concat(res.uid, '/groups/')); // Attach observable to my internal path.         
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user. 
        this.globalGroupsRef = null;
        this.myGroupsRef = null;
        this.myID = null;
      }
    })



    this.showAddGroup = false;
    this.db = db;
    this.localInitNewGroup();
  }

  ngOnInit() {

  }

  localInitNewGroup() {
    this.newGroup = new Group(UUID.UUID(), this.db); // Generate new UUID. 
    this.newGroup.name = "";
  }

  filterGroups() { // I filter here so that we know groups already exists. 
    if(this.groups == null) {
      return null;
    }
    else {
      return this.groups.filter(input => input.groupID != 'personal') as [Group];
    }
  }

  addGroup() {
    this.showAddGroup = true;
  }

  saveNewGroup() {
    const groupID = this.newGroup.groupID;
    const myID = this.myID;

    this.globalGroupsRef.update(this.newGroup.groupID, {name: this.newGroup.name, members: {'this.myID': true}}); // Add the group. Add other members here. 
    this.myGroupsRef.update(this.newGroup.groupID, true);                                               // Add group to me.

    this.localInitNewGroup(); // Generate new new group because you just saved the one above. 
  }

}
