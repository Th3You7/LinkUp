import { Component } from '@angular/core';
import { AsideComponent } from './aside/aside.component';
import { MainComponent } from './main/main.component';
import { NavabrComponent } from '../../shared/components/navabr/navabr.component';
import { RightAsideComponent } from './right-aside/right-aside.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsideComponent,
    MainComponent,
    NavabrComponent,
    RightAsideComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
