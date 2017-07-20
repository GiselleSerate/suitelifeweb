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
  key: string;

  constructor(checked: boolean, name: string, price: number, uidString: string, db: AngularFireDatabase, key: string) {
    this.checked = checked;
    this.name = name;
    this.price = price;
    this.uidString = uidString;
    this.db = db;
    this.key = key;
  }

  slowSave(delay: number) {
    setTimeout( () => this.save(),delay);
  }

  save() {
    console.log("Saving item with name: ".concat(this.name,", uid: ",this.uidString));
    this.db.object(this.key).update({
      "checked": this.checked,
      "name": this.name,
      "price": this.price,
      "uidString": this.uidString
    });
  }

  remove() {
    this.db.object(this.key).remove();
  }
}
