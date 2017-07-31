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
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})

export class SearchUsersComponent {
  NUMSEARCHRESULTS = 10;
  MINSEARCHLENGTH = 3;
  SEARCHFIELDS = ['name', 'handle'];

  @Input() userSelectedCallback: (User) => void; // Callback deprecated. 
  currentUserID: string; 
  db: AngularFireDatabase;
  searchResults = Array<User>();

  @Input() groupID;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    var currentUser = afAuth.authState;
    this.db = db;

    currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        this.currentUserID = res.uid;
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user.       
        this.currentUserID = null;
        this.db = null;
      }
    });

  }
  
  selectUser(user: User) {
    this.userSelectedCallback(user);
    console.log("callback reached.");
    // alert("Added user ".concat(user.name, " to your group"));
    // this.db.list('/groups/'.concat(this.groupID)).update('members', {[user.userID]: true}); // Add other members here. 
    // this.db.list('/users/'.concat(user.userID)).update('groups', {[this.groupID]: true});  // Add group to user.  
  }

  search(searchTerm: string) {
    // Clear the search results regardless of whether we
    // search or not.
    this.searchResults = [] as Array<User>;
    if(searchTerm.length < this.MINSEARCHLENGTH) {
      return;
    }
    // All search fields are lowercase, so lower the search term.
    searchTerm = searchTerm.toLowerCase();
    // Prefix search for the search term
    // (startAt and endAt are required for the prefix search)
    this.SEARCHFIELDS.forEach(field => {
      const query = this.db.list('/users', {
        query: {
          orderByChild: 'searchFields/'.concat(field),
          limitToFirst: this.NUMSEARCHRESULTS,
          startAt: searchTerm,
          endAt: searchTerm.concat('\u{f8ff}')
        }
      }).take(1);
      query.subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          // Multiply the debt by 1 since we want to retrieve THIS user's debt to them
          // The rest of these values are just what's required for the User constructor
          console.log(snapshot.photoURL);
          var user = new User(this.currentUserID, snapshot.$key, this.db, -1 * snapshot['debts'][this.currentUserID], snapshot.name, snapshot.handle, snapshot.photoURL);
          this.addToSearchResults(user);
        })
      })
    });
  }

    addToSearchResults(user: User) {
      var uids = this.searchResults.map(u => u.userID);
      // Append only if the user is not in the array (we check quickly by looking at userID, which is unique)
      if(uids.indexOf(user.userID) == -1) {
        this.searchResults.push(user);
        console.log(user.photoURL);
      }
    }

}
