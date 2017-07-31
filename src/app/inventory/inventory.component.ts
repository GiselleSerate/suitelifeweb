// Component displays list or pantry based on parameter. 

import { Component, Input, ViewChild, OnInit } from '@angular/core';
import 'rxjs/add/operator/take'
import { Observable } from 'rxjs/Observable';
import { InventoryItem } from '../inventoryItem';

// These imports are all for Firebase.---------
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------

import { UUID } from 'angular2-uuid';
import { Group } from '../group';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  @Input() inventoryType: string; // Either list or pantry. 
  @Input() group: Group; // A Group type instance. 

  userUid: string;    // User's authid, for passing to other components. 
  path: string;       // A path leading to this inventory in the database. 
  pairPath: string  // A path leading to the inventory's pair (list if inventoryType is pantry, pantry if inventoryType is list) in the database.

  db: AngularFireDatabase; // A reference to the database. 

  inventory: [InventoryItem]; // Local array of objects so that this component can iterate over them to do stuff to its own list. 
  
  currentUser: Observable<firebase.User>;  // An observable for the user that is logged in. 
  currentUserData: Observable<any[]>;      // An observable for the inventory corresponding to this component. 

  transferData: any;
  dragulaService: DragulaService;

  // @ViewChild('inventories'.concat(this.group.name, this.inventoryType)) meBag: any;

  constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth, dragulaService: DragulaService) {
    this.dragulaService = dragulaService;

    this.db = db;
    this.currentUser = afAuth.authState;

    this.currentUser.subscribe(res => {   // This callback block happens upon login or logout. 
      if(res && res.uid) { // User logged in.
        // Assign this-component-scope properties to give to other components.
        this.userUid = res.uid;

        // Quality hard-coding to get the corresponding pair's inventory type
        var pairInventoryType = null;
        if(this.inventoryType == "list") {
          pairInventoryType = "pantry";
        } else {
          pairInventoryType = "list";
        }
        // Set path variable. 
        if(this.group.groupID == "personal") {
          this.path ='/users/'.concat(res.uid, '/', this.inventoryType);
          this.pairPath = '/users/'.concat(res.uid, '/', pairInventoryType);
        }
        else {
          this.path ='/groups/'.concat(this.group.groupID, '/', this.inventoryType);
          this.pairPath ='/groups/'.concat(this.group.groupID, '/', pairInventoryType);
        }

        this.currentUserData = db.list(this.path); // Attach observable to the correct path. 
        this.currentUserData.subscribe(snapshots => { // Begin observable's subscription. 
          this.inventory = [] as [InventoryItem]; // Clear inventory array. 
          snapshots.forEach(snapshot => { // Iterate over snapshots and initialize items. 
            var item = new InventoryItem(snapshot.checked, snapshot.name, snapshot.price, snapshot.uidString, db, this.path, snapshot.$key);
            this.inventory.push(item); // Put the items into the local array. 
          });
        })
      }
      else { // User not logged in.
        // Unassign all variables storing information about the user. 
        this.userUid = null;
        this.inventory = null;
        this.currentUserData = null;
      }
    })
  }

  ngOnInit() {
    this.dragulaService.setOptions('inventories'.concat(this.group.groupID, this.inventoryType), {
      moves: function (el, container, handle) {
        return handle.classList.contains('handle');
      }
    });

    // dragulaService.drag.subscribe((value) => {
    //   console.log(`drag: ${value[0]}`);
    //   this.onDrag(value.slice(1));
    // });
    // dragulaService.drop.subscribe((value) => {
    //   console.log(`drop: ${value[0]}`);
    //   this.onDrop(value.slice(1));
    // });
    // dragulaService.over.subscribe((value) => {
    //   console.log(`over: ${value[0]}`);
    //   this.onOver(value.slice(1));
    // });
    // dragulaService.out.subscribe((value) => {
    //   console.log(`out: ${value[0]}`);
    //   this.onOut(value.slice(1));
    // });

    let that = this;

    this.dragulaService.dropModel.subscribe((args: any) => {
      let [bagName, el, target, source] = args;
      // console.log("Dropped inside bagName".concat(bagName));

      // We can only drop into one bag now so you might as well save only this one. 
      if(bagName == "inventories".concat(that.group.groupID, that.inventoryType)){ 
        this.saveAll();      
      //   console.log("IT ME Dropped inside bagName".concat(bagName));
      //   console.log("The id is ".concat(el.id));
      //   let element = el.id;
      //   for(let i = 0; i < that.inventory.length; i++){
      //     console.log("A FOR WHOA");
      //     let task = that.inventory[i];
      //     console.log("We compare: ".concat(task.uidString, " ", element));
      //     if(task.uidString == element){
      //       console.log("A MATCH WOHA");
      //       break;
      //     }
      //   }
      }
    });

  }

  addItem() {
    console.log("Adding new item.");

    var uid = UUID.UUID(); // Generate new UUID for the new item you are adding. 
    var newItem = new InventoryItem(false, "", 0, uid, this.db, this.path, this.inventory.length); // Create new item.
    newItem.save(); // Save new item to database. 
  }

  deleteSelected() {
    console.log("Deleting all the selected items.");

    var unselectedItems = this.inventory.filter(item => !item.checked);

    this.inventory = [] as [InventoryItem];  // Clear inventory. 
    this.db.object(this.path).remove();      // Remove the entire list object. 

    unselectedItems.forEach((item, index) => { // Iterate over unselected items. 
      item.index = index;          // Reindex. 
      item.save();                 // Save to database.
      this.inventory.push(item);   // Save locally. 
    });
    // TODO: Diagonose this bug
    // Inventory will have a duplicated last item -- bandaid remedy by popping
    this.inventory.pop();
  }

  selectAll() {
    console.log("Selecting all.");

    var set: boolean;

    if(this.inventory.every(item => item.checked)) { // If everything is checked, then uncheck everything.
      set = false;
    }
    else { // Else there are some things that are not checked, so check them.
      set = true;
    }

    this.inventory.map(item => { // Set or unset checks as determined above, and save to database. 
      item.checked = set;
      item.save();
    });
  }

  saveAll() {
    console.log("Saving all the items.");

    this.inventory.forEach((item, index) => { // Iterate over all items. 
      item.index = index;          // Reindex. 
      item.path = this.path;
      item.save();                 // Save to database.
    });
  }

  // private onDrag(args) {
  //   // let [e, el] = args;
  //   // do something
  // }

  // private onDrop(args) {
  //   // let [e, el] = args;
  //   // // do something
  //   this.saveAll();
  // }

  // private onOver(args) {
  //   // let [e, el, container] = args;
  //   // do something
  // }

  // private onOut(args) {
  //   // let [e, el, container] = args;
  //   // // do something
  // }

  checkOut() {
    // Get a reference to the selected items
    var selectedItems = this.inventory.filter(item => item.checked);
    // Remove the selected items
    this.deleteSelected();
    // Get the length of the pair's array in a somewhat janky manner
    // TODO: Get the array length locally
    var pair = this.db.object(this.pairPath, { preserveSnapshot: true }).take(1);
    pair
      .subscribe(snapshots => {
        // TODO: Not this. 
        var i = 0;
        snapshots.forEach(snapshot => {
          i++;
        });
        var startIndex = i + 1;
        console.log("Length of pair: ".concat(startIndex.toString()));
        selectedItems.forEach((item,index) => {
          item.index = index + startIndex;
          item.path = this.pairPath;
          // Deselected the items that you move over
          item.checked = false;
          item.save();
        })
    })
    
  }

}
