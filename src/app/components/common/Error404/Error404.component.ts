import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Error404',
  templateUrl: './Error404.component.html',
  styleUrls: ['./Error404.component.css']
})
export class Error404Component implements OnInit {

  constructor() {
    alert('404')
  }

  ngOnInit() {
  }

}
