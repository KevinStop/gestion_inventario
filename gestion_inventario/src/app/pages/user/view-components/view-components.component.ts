import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-view-components',
  standalone: true,
  imports: [],
  templateUrl: './view-components.component.html',
  styleUrl: './view-components.component.css'
})
export default class ViewComponentsComponent {

  ngOnInit(): void {
    initFlowbite();
  }

}
