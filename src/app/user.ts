// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
// import { environment } from '../environments/environment';
// import * as firebase from 'firebase/app';
// import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { Observable } from 'rxjs/Observable';

export class User {
  currentUserID: string; // The current user's id. 
  userID: string;
  debt: number;
  db: AngularFireDatabase; // Through AngularFire.
  name: string;
  handle: string;

  constructor(currentUserID: string, userID: string, debt: number, db: AngularFireDatabase) { // If you don't need the debt, set it to 0. It shouldn't mess anything up. 
    this.currentUserID = currentUserID;
    this.userID = userID;
    this.debt = debt;
    this.db = db;
    // From the userID, I can calculate the other properties of the user in question. For now, I will initialize them to an default string so it fails semi-gracefully. 
    this.name = "waiting";
    this.handle = "waiting";
  }

  init() { // Initialize the user immediately following construction. Remember to call me! 
    this.db.object('/users/'.concat(this.userID)).subscribe(snapshot => { // Begin observable's subscription. 
      // Set the user's properties. 
      this.name = snapshot.name;
      this.handle = snapshot.handle;
    })
  }

  save() { // Why would I need this function??
    console.log("Saving debt with: ".concat(this.name,", uid: ",this.userID,", amount: ",this.debt.toString()));

    var myKey = this.userID as string; // For some reason putting this.userID doesn't really work in the .update function. It is angery. 

    // Send update to the database. 
    this.db.object('/users/'.concat(this.currentUserID,'/debts')).update({
      myKey: this.debt
    });
  }

  // A debt amount (which is an INT OF CENTS) to add to the debts. 
  // This is an amount that you are PAYING BACK. 
  // This means that if you will add this POSITIVE amount to the balance in my debts and this NEGATED amount to the other person's. 
  addDebt(amount: number) { 
    // Update my debt tree. 
    this.db.object('/users/'.concat(this.currentUserID,'/debts/',this.userID)).$ref.ref.transaction(debt => debt + amount);
    // Update their debt tree. 
    this.db.object('/users/'.concat(this.userID,'/debts/',this.currentUserID)).$ref.ref.transaction(debt => debt + amount);
  }

  formatDebt(): string { // Formats debt with dollar sign and negative as a string. 
    var clean = this.debt;
    var sign = ""

    if(this.debt < 0) {
      clean = -this.debt;
      sign = "-"
    }

    return sign+"$"+(clean/100).toFixed(2);
  }

  colorDebt() {
    var color: string;
    var assignedClass: string;
    if(this.debt == 0) {
      color = 'color: gray';
      assignedClass = 'debt-zero';
    }
    else if(this.debt > 0) {
      color = 'color: red';
      assignedClass = 'debt-positive';
    }
    else {
      color = 'color: green';
      assignedClass = 'debt-negative';
    }
    return assignedClass;
  }

}
