import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css'
})
export default class RequestComponent {

  ngOnInit(): void {
    initFlowbite();
  }

}
