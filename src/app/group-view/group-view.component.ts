import { Component, OnInit, Input } from '@angular/core';

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
import { User } from '../user'

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css']
})
export class GroupViewComponent implements OnInit {

  @Input() group: Group;
  visible: boolean;
  localName: string;
  localID: string;
  db: AngularFireDatabase;

  constructor(db: AngularFireDatabase) { 
    this.db = db;
    this.visible = false;
  }

  ngOnInit() {
  }

  toggleVisible() {
    this.visible = !this.visible;
    this.localName = this.group.name;
    this.localID = this.group.groupID;
  }

  updateName() {
    this.group.name = this.localName;
    alert(this.localID);
  }

  selectUser(user: User) {
    alert("Added user ".concat(user.name, " to the group ", this.localID, " ", this.localName));
    this.db.list('/groups/').update(this.localID, {members: {[user.userID]: true}}); // Add other members here. 
    this.db.list('/users/'.concat(user.userID)).update('groups', {[this.localID]: true});  // Add group to user.  
  }
}
