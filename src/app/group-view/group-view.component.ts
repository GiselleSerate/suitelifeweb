import { Component, OnInit, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

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
  currentUser: Observable<firebase.User>;
  myID: string;
  dragulaService: DragulaService;

  constructor(db: AngularFireDatabase, afAuth: AngularFireAuth, dragulaService: DragulaService ) { 
    this.db = db;
    this.visible = false;
    this.currentUser = afAuth.authState;
    this.dragulaService = dragulaService;

    this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        this.myID = res.uid;  
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user. 
        this.myID = null;
      }
    })
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

  intendLeave() {
    if(confirm("Are you sure you want to leave the group ".concat(this.group.name,"? This cannot be undone."))) {
      this.leaveGroup();
    }
  }

  leaveGroup() {
    console.log("I'm leaving you for someone else");
    this.db.object('/groups/'.concat(this.group.groupID,'/members/', this.myID)).remove(); // Remove me from group.
    this.db.object('/users/'.concat(this.myID,'/groups/',this.group.groupID)).remove();  // Remove group from me.  
    this.dragulaService.destroy('inventories'.concat(this.group.groupID,'pantry'));
    this.dragulaService.destroy('inventories'.concat(this.group.groupID,'list'));
  }

  // Callback needs to be generated because of the way that `this` works in JS, see https://stackoverflow.com/a/20279485/5309823
  // The gist of it is that I create an explicit reference to `this` in order for it to be called properly
  generateSelectUserCallback() {
    var that = this;
    return function(user: User) {
      alert("Added user ".concat(user.name, " to the group ", that.localName));
      this.db.object('/groups/'.concat(that.group.groupID,'/members/',user.userID)).set(true); // Add user to group
      this.db.object('/users/'.concat(user.userID,'/groups/',that.group.groupID)).set(true);  // Add group to user.  
    }
  }

}
