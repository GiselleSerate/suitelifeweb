import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() checked;
  @Input() name;
  @Input() price;
  @Input() select;

  constructor() { }

  ngOnInit() {
  }

}
