import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-acknowledge-page',
  templateUrl: './acknowledge-page.component.html',
  styleUrls: ['./acknowledge-page.component.css']
})
export class AcknowledgePageComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  navigateToInfo() {
    this.router.navigate(['/info']);
  }

}
