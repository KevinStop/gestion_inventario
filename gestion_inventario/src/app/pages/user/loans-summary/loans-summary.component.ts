import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-loans-summary',
  standalone: true,
  imports: [],
  templateUrl: './loans-summary.component.html',
  styleUrl: './loans-summary.component.css'
})
export default class LoansSummaryComponent {

  ngOnInit(): void {
    initFlowbite();
  }

}
