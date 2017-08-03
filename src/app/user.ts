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
  photoURL: string;
  paymentLink: string;
  DEFAULTPHOTOURL = "/assets/iconWBg.svg";

  constructor(currentUserID: string, userID: string, db: AngularFireDatabase)
  constructor(currentUserID: string, userID: string, db: AngularFireDatabase, debt: number)
  constructor(currentUserID: string, userID: string, db: AngularFireDatabase, debt: number, name: string, handle: string, photoURL: string)
  constructor(currentUserID: string, userID: string, db: AngularFireDatabase, debt: number, name: string, handle: string, photoURL: string, paymentLink: string)
  constructor(currentUserID: string, userID: string, db: AngularFireDatabase, debt?: number, name?: string, handle?: string, photoURL?: string, paymentLink?: string) { // If you don't need the debt, set it to 0. It shouldn't mess anything up. 
    this.currentUserID = currentUserID;
    this.userID = userID;
    this.debt = debt == null ? 0 : debt;
    this.db = db;
    // From the userID, I can calculate the other properties of the user in question. For now, I will initialize them to an default string so it fails semi-gracefully. 
    this.name = name == null ? "Loading..." : name;
    this.handle = handle == null ? "Loading..." : handle;
    this.photoURL = photoURL == null ? this.DEFAULTPHOTOURL : photoURL;
    this.paymentLink = paymentLink == null ? "" : paymentLink;
    // TODO: Call init() in constructor?
  }


  init() { // Initialize the user immediately following construction. Remember to call me! 
    this.db.object('/users/'.concat(this.userID, "/name/")).subscribe(snapshot => { // Begin observable's subscription. 
      // Set the user's properties. 
      this.name = snapshot.$value;
    })
      this.db.object('/users/'.concat(this.userID, "/handle/")).subscribe(snapshot => { // Begin observable's subscription. 
      // Set the user's properties. 
      this.handle = snapshot.$value;
    })
      this.db.object('/users/'.concat(this.userID, "/photoURL/")).subscribe(snapshot => { // Begin observable's subscription. 
      // Set the user's properties. 
      this.photoURL= snapshot.$value;
        if (this.photoURL == null) {
          this.photoURL = this.DEFAULTPHOTOURL;
        }
    })     
      this.db.object('/users/'.concat(this.userID, "/paymentLink/")).subscribe(snapshot => { // Begin observable's subscription. 
      this.paymentLink = snapshot.$value;
    })
  }

  save() { // Why would I need this function??
    console.log("Saving debt with: ".concat(this.name,", uid: ",this.userID,", amount: ",this.debt.toString()));

    var myKey = this.userID as string; // For some reason putting this.userID doesn't really work in the .update function. It is angery. 

    // Send update to the database. 
    this.db.object('/users/'.concat(this.currentUserID,'/debts')).update({
      // debt is stored locally as a float of money, so we need to multiply by 100
      myKey: this.debt
    });
  }

  // A debt amount (which is actually a float of dollars) to add to the debts. 
  // To maintain the int of cents, we multiply our debt (currently a float of dollars) by 100
  // This is an amount that you are PAYING BACK. 
  // This means that if you will add this POSITIVE amount to the balance in my debts and this NEGATED amount to the other person's. 
  addDebt(amount: number) { 
    // Update my debt tree. 
    this.db.object('/users/'.concat(this.currentUserID,'/debts/',this.userID)).$ref.ref.transaction(debt => debt - (amount*100));
    // Update their debt tree. 
    this.db.object('/users/'.concat(this.userID,'/debts/',this.currentUserID)).$ref.ref.transaction(debt => debt + (amount*100));
  }

  addCentsDebt(amount: number) { // Does the same thing as addDebt but takes in an INT of CENTS.
    // Update my debt tree. 
    this.db.object('/users/'.concat(this.currentUserID,'/debts/',this.userID)).$ref.ref.transaction(debt => debt - amount);
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
