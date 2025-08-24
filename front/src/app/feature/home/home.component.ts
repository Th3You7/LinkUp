import { Component } from '@angular/core';
import { AsideComponent } from './aside/aside.component';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsideComponent, MainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
