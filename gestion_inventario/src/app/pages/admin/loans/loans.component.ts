import { Component } from '@angular/core';
import { initFlowbite, Modal} from 'flowbite';


@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.css'
})
export default class LoansComponent {
  createProductModal: Modal | undefined;

  ngOnInit(): void {
    initFlowbite();
  }

}
