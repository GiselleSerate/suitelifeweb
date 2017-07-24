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
    this.person.addDebt(this.pendingDebt);
    this.pendingDebt = null;
    this.isFocused = false;
  }

  formatPendingDebt() {
    this.pendingDebt = parseFloat(this.pendingDebt.toFixed(2));
  }

}
