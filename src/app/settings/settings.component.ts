import { Component, Input, OnInit } from '@angular/core';

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
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  SETTINGSKEYS = {'single': ['handle','name','location', 'paymentLink'], 'multiple': ['dietaryPreferences']};
  SETTINGSNAMES = {'handle': 'Handle', 'name': 'Name', 'location': 'Location', 'paymentLink': 'Payment Link'};
  VALIDATESETTINGS = {'paymentLink': this.validatePaymentLink}
  UNIQUESETTINGS = ['handle'];
  currentUser: Observable<firebase.User>;
  currentUserID: string;
  singlePropertySettings = {};
  multiplePropertySettings = {};
  db: AngularFireDatabase;
  photoURL: string;
  userCreated: boolean; // TODO: Bandaid for now, to hide this component if it is user creation. 

  @Input() isUserCreation: boolean; // Is this for user creation or is it a vanilla settings menu? 
  
  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.currentUser = afAuth.authState;
    this.db = db;
    this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        this.currentUserID = res.uid;
        this.photoURL = res.photoURL;
        this.SETTINGSKEYS['single'].forEach(key => {
          // Fetches changes constantly -- when things get updated, their value is changed immediately.
          // To undo, append .take(1); to the line below
          var property = db.object('/users/'.concat(res.uid,'/',key), { preserveSnapshot: true })
          property.subscribe(snapshot => {
            // TODO: Don't use magic keys here -- figure out how to
            // get the value that isn't idiotic.
            this.singlePropertySettings[key] = snapshot.A.B;
          })
        })
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user.       
        this.singlePropertySettings = {};
        this.multiplePropertySettings = {};
      }
    })
  }   

  ngOnInit() {
    this.userCreated = !this.isUserCreation;
  }
  
  updateSingleProperty(key: string) {
    var currentPropertyValue = this.singlePropertySettings[key];
    // Validate those keys which require validation
    if(Object.keys(this.VALIDATESETTINGS).indexOf(key) != -1){
      // Test against the validation method
      if(! this.VALIDATESETTINGS[key](currentPropertyValue)) {
        alert(key.concat(' is invalid.'));
        return;
      }
    }
    // If the key is supposed to be unique, make sure it is
    if(this.UNIQUESETTINGS.indexOf(key) != -1){
      const query = this.db.list('/users', {
        query: {
          orderByChild: 'searchFields/'.concat(key),
          equalTo: currentPropertyValue,
          limitToFirst: 1
        }
      }).take(1);
      query.subscribe(results => {
        // We're only getting one result anyways so take the first
        const result = results[0];
        // If someone has this property AND it isn't the current user
        if(result != null && result.$key != this.currentUserID){
          // Don't change and let them know that they can't take that property.
          alert(key.concat(' already taken. Please choose another.')); 
        } else {
          // Update the property
          this.db.object('/users/'.concat(this.currentUserID,'/',key)).set(currentPropertyValue);
          // Also create a searchable field which is the key but lowercase
          this.db.object('/users/'.concat(this.currentUserID,'/searchFields/',key)).set(currentPropertyValue.toLowerCase());
          alert("Saved ".concat(key));
        }
      })
    // If the key doesn't need to be unique, don't bother querying
    } else {
        // Update the property
        this.db.object('/users/'.concat(this.currentUserID,'/',key)).set(currentPropertyValue);
        // Also create a searchable field which is the key but lowercase
        this.db.object('/users/'.concat(this.currentUserID,'/searchFields/',key)).set(currentPropertyValue.toLowerCase());
        alert("Saved ".concat(key));
    }
  }

  updateAllProperties() {
    for(let key of this.SETTINGSKEYS['single']) {
      this.updateSingleProperty(key); // TODO: Alerts every single time. 
    }
    // Save photoURL, which we are currently not letting people edit
    this.db.object('/users/'.concat(this.currentUserID,'/','photoURL')).set(this.photoURL);
    this.userCreated = true;
  }

  selectUser(user: User) {
    console.log(user);
  }
  validatePaymentLink(link: string) {
    // Supported payment services: venmo.com, paypal.me
    return /https?:\/\/(venmo.com|paypal.me)\/\S+\/?/i.test(link)
  }
}
