import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { ComponentService } from '../../../services/component.service';

@Component({
  selector: 'app-view-components',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-components.component.html',
  styleUrl: './view-components.component.css'
})
export default class ViewComponentsComponent implements OnInit{
  components: any[] = [];

  constructor(private componentService: ComponentService) {}

  ngOnInit(): void {
    initFlowbite();

    this.getComponents();
  }

  getComponents(): void {
    this.componentService.getComponents().subscribe(
      (data) => {
        this.components = data.components;
      },
      (error) => {
        console.error('Error al obtener los componentes:', error);
      }
    );
  }  

}
