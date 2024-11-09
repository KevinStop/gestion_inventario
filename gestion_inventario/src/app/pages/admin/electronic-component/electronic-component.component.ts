import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-electronic-component',
  standalone: true,
  imports: [],
  templateUrl: './electronic-component.component.html',
  styleUrl: './electronic-component.component.css'
})
export default class ElectronicComponentComponent implements OnInit{

  ngOnInit(): void {
    initFlowbite();
  }

}
