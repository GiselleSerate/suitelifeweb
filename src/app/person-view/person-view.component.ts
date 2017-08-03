import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { SafePipe } from '../safe.pipe'

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.css']
})
export class PersonViewComponent implements OnInit {

  @Input() person: User;
  isFocused: boolean;
  pendingDebt: number;

  constructor() { 
    this.isFocused = false;
    this.pendingDebt = null;
  }

  ngOnInit() {
  }

  toggleFocus() { // Toggle focus.
    this.isFocused = !this.isFocused;
  }

  setFocus(focus: boolean) {
    this.isFocused = focus;
  }

  submitDebt() {
    if(this.pendingDebt == null){
      alert("The amount you are trying to modify this debt by is invalid. No change will be made.");
    } else {
      // If the amount is valid, add it.
      this.person.addDebt(this.pendingDebt);
    }
    this.pendingDebt = null;
    this.isFocused = false;
  }

  formatPendingDebt() {
    this.pendingDebt = parseFloat(this.pendingDebt.toFixed(2));
  }

}
