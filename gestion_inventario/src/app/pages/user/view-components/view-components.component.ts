import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { ComponentService } from '../../../services/component.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-view-components',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-components.component.html',
  styleUrls: ['./view-components.component.css'],
})
export default class ViewComponentsComponent implements OnInit {
  components: any[] = [];
  selectedQuantities: any = {};

  constructor(
    private componentService: ComponentService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getComponents();
    this.loadSelectedComponents();
  }

  // Obtener todos los componentes
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

  // Método para manejar la cantidad seleccionada de cada componente
  onQuantityChange(componentId: number, quantity: number): void {
    this.selectedQuantities[componentId] = quantity;
    this.updateSelectedComponents(); // Actualizar la lista de componentes seleccionados
  }

  // Cargar los componentes seleccionados desde localStorage
  loadSelectedComponents(): void {
    const storedComponents = JSON.parse(localStorage.getItem('selectedComponents') || '[]');
    this.selectedQuantities = storedComponents.reduce((acc: any, component: any) => {
      acc[component.id] = component.quantity;
      return acc;
    }, {});
  }

  // Actualizar los componentes seleccionados en localStorage
  updateSelectedComponents(): void {
    for (let componentId in this.selectedQuantities) {
      const quantity = this.selectedQuantities[componentId];
      const component = this.components.find((c) => c.id === +componentId);
      if (component) {
        this.requestService.addSelectedComponentToStorage(component, quantity);
      }
    }
  }

  // Método para agregar un componente a la lista de seleccionados
  addToSelectedList(component: any): void {
    const quantity = this.selectedQuantities[component.id];
    if (quantity && quantity > 0) {
      this.requestService.addSelectedComponentToStorage(component, quantity);
    }
  }
}