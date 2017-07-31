import { Component, Input } from '@angular/core';

// These imports are all for Firebase.---------
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { User } from '../user';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})

export class UserViewComponent {
  @Input() userID: string;
  @Input() user: User;
  db: AngularFireDatabase;
  currentUserID: string;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    var currentUser = afAuth.authState;
    this.db = db;

    currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        this.currentUserID = res.uid;
        // Don't bother signing in if the user exists
        if (!this.user){
          this.db.object('/users/'.concat(this.userID)).subscribe(snapshot => {
            this.user = new User(this.currentUserID, this.userID, this.db, NaN, snapshot.name, snapshot.handle, snapshot.photoURL);
          })
        }
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user.       
        this.db = null;
        this.currentUserID = null; 
        this.user = null;
      }
    });

  }

}
