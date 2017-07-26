import { Component, OnInit, Input } from '@angular/core';

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

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.css']
})
export class GroupsEditComponent implements OnInit {
  @Input() groups: [Group];

  // filteredGroups: [Group];

  constructor() { 
  }

  ngOnInit() {
    // this.filteredGroups = this.groups.filter(input => input.groupID == 'personal');
  }

}
