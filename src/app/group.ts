// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
// import { environment } from '../environments/environment';
// import * as firebase from 'firebase/app';
// import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { Observable } from 'rxjs/Observable';

export class Group {
  groupID: string;
  db: AngularFireDatabase; // Through AngularFire.
  name: string;

  constructor(groupID: string, db: AngularFireDatabase) { // If you don't need the debt, set it to 0. It shouldn't mess anything up. 
    this.groupID = groupID;
    this.db = db;
    this.name = "waiting"; // Until we have something from the database (retrieved in init), give a default value.
  }

  init() {
      if(this.groupID == 'personal') {
      this.name = 'Personal';
    }
    else {
      this.db.object('/groups/'.concat(this.groupID)).subscribe(snapshot => { // Begin observable's subscription. 
        // Set the user's properties. 
        this.name = snapshot.name;
      })
    }
  }
  
}
