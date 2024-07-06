import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../components/top-bar/top-bar.component';
import { IconService } from '../services/icon/icon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, AsyncPipe],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css'
})
export class RootComponent implements OnInit {
  constructor(
    private readonly iconService: IconService
  ) {
  }

  ngOnInit(): void {
    this.iconService.setIconSet();
  }
}
