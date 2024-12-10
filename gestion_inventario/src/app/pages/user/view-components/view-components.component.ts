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
  selectedQuantities: { [key: number]: number } = {};

  constructor(
    private componentService: ComponentService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getComponents();
    this.loadSelectedComponents();
  }

  // Obtener solo los componentes activos
  getComponents(): void {
    this.componentService.getComponents().subscribe(
      (data) => {
        // Filtrar los componentes activos
        this.components = data.components.filter((component: any) => component.isActive);
      },
      (error) => {
        console.error('Error al obtener los componentes:', error);
      }
    );
  }

  // Método para manejar la cantidad seleccionada de cada componente
  onQuantityChange(componentId: number, quantity: number): void {
    const component = this.components.find(comp => comp.id === componentId);
    if (component) {
      if (quantity > component.quantity) {
        // Si la cantidad supera la disponible, se ajusta al máximo permitido
        this.selectedQuantities[componentId] = component.quantity;
        alert(`La cantidad no puede exceder el máximo disponible (${component.quantity}).`);
      } else {
        // Si la cantidad es válida, la actualizamos
        this.selectedQuantities[componentId] = quantity;
      }
    }
  }  

  // Cargar los componentes seleccionados desde localStorage
  loadSelectedComponents(): void {
    const storedComponents = JSON.parse(localStorage.getItem('selectedComponents') || '[]');
    this.selectedQuantities = storedComponents.reduce((acc: any, component: any) => {
      acc[component.id] = component.quantity;
      return acc;
    }, {});
  }

  // Método para agregar un componente a la lista de seleccionados
  addToSelectedList(component: any): void {
    const quantity = this.selectedQuantities[component.id];
    if (quantity && quantity > 0) {
      // Solo agregar al carrito si la cantidad es válida (mayor a 0)
      this.requestService.addSelectedComponentToStorage(component, quantity);
    } else {
      console.error('Cantidad inválida para agregar');
    }
  }
}
