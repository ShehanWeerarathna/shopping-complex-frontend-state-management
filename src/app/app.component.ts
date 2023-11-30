import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shopping-complex-frontend';
  isNavbarCollapsed = true;

  toggleNavBar(){
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  closeNavBar(){
    this.isNavbarCollapsed = true;
  }
}
