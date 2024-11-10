import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-electronic-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './electronic-component.component.html',
  styleUrls: ['./electronic-component.component.css'],
  providers: [ApiService]
})
export default class ElectronicComponentComponent implements OnInit {
  componentData = {
    name: '',
    category: '',
    quantity: 0,
    description: '',
    is_active: false,
    createdAt: null,
    updatedAt: null 
  };

  components: any[] = [];

  constructor(private ApiService: ApiService) {}

  ngOnInit(): void {
    initFlowbite();
    this.loadComponents();
  }

  // Método para cargar los componentes desde la API
  loadComponents() {
    this.ApiService.getComponents().subscribe({
      next: (response) => {
        this.components = response;
      },
      error: (error) => {
        console.error('Error al obtener los componentes', error);
      }
    });
  }

  createComponent() {
    this.ApiService.createComponent(this.componentData).subscribe({
      next: response => {
        console.log('Componente creado:', response);
      },
      error: error => {
        console.error('Error al crear el componente:', error);
      }
    });
  }
}
