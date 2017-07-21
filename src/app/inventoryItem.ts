// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------


export class InventoryItem {
  checked: boolean;
  name: string;
  price: number;
  uidString: string;
  db: AngularFireDatabase;
  path: string;   // A path leading to the item that does not include its index (which is contained within the parameter index). 
  index: number; // The index of the item in the list. 

  constructor(checked: boolean, name: string, price: number, uidString: string, db: AngularFireDatabase, path: string, index: number) {
    this.checked = checked;
    this.name = name;
    this.price = price/100;
    this.uidString = uidString;
    this.db = db;
    this.path = path;
    this.index = index;
  }

  slowSave(delay: number) { // An implementation of saving to imitate arbitrary latency. 
    setTimeout( () => this.save(),delay);
  }

  save() {
    console.log("Saving item with name: ".concat(this.name,", uid: ",this.uidString));
    console.log(this.price);

    // Truncates the price before storing and also turns the decimal displayed into an int of cents. 
    this.price = Math.floor(this.price * 100); 

    console.log(this.price);

    // Send update to the database. 
    this.db.object(this.path.concat('/', this.index.toString())).update({
      "checked": this.checked,
      "name": this.name,
      "price": this.price,
      "uidString": this.uidString
    });
  }

  // Remove this object from the database. 
  // Only call if you have made sure that this won't mess up the indices of the list. 
  remove() { 
    this.db.object(this.path.concat('/', this.index.toString())).remove();
  }
}
