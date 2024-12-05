import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import { UserService } from '../../../services/user.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-loans-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans-summary.component.html',
  styleUrls: ['./loans-summary.component.css'],
})
export default class LoansSummaryComponent implements OnInit {
  selectedComponents: any[] = []; 
  totalAmount: number = 0; 

  constructor(private requestService: RequestService, private userService: UserService) { }

  ngOnInit(): void {
    initFlowbite();
    this.loadSelectedComponents();
  }

  // Cargar los componentes seleccionados desde el servicio
  loadSelectedComponents(): void {
    this.selectedComponents = this.requestService.getSelectedComponents();
    this.calculateTotal(); 
  }

  // Eliminar un componente de la lista
  removeComponent(componentId: number): void {
    this.selectedComponents = this.selectedComponents.filter(
      (component) => component.componentId !== componentId
    );
    this.requestService.setSelectedComponents(this.selectedComponents); // Actualizar en localStorage
    this.calculateTotal();
  }

  // Actualizar la cantidad de un componente
  updateQuantity(componentId: number, quantity: number): void {
    const component = this.selectedComponents.find(
      (comp) => comp.componentId === componentId
    );
    if (component) {
      component.quantity = quantity;
      this.requestService.setSelectedComponents(this.selectedComponents);
      this.calculateTotal(); 
    }
  }

  // Calcular el total de los componentes seleccionados
  calculateTotal(): void {
    this.totalAmount = this.selectedComponents.reduce((acc, component) => {
      return acc + component.quantity;
    }, 0);
  }

  // Enviar la solicitud de préstamo
  submitRequest(): void {
    const requestData = {
      description: 'Descripción de la solicitud',
    };
  
    console.log('Datos de la solicitud:', requestData);
    console.log('Componentes seleccionados:', this.selectedComponents);
    if (!this.selectedComponents || this.selectedComponents.length === 0) {
      console.error('No hay componentes seleccionados para enviar.');
      return;
    }
    const transformedRequestDetails = this.selectedComponents
      .filter(component => component.quantity > 0)
      .map(component => ({
        componentId: component.id,
        quantity: component.quantity
      }));
  
    // Opcional: Validar que queden componentes después del filtrado
    if (transformedRequestDetails.length === 0) {
      console.error('No hay componentes válidos para enviar.');
      return;
    }
  
    this.requestService.createRequest(requestData, transformedRequestDetails).subscribe(
      (response) => {
        console.log('Solicitud enviada correctamente:', response);
        localStorage.removeItem('selectedComponents');
      },
      (error) => {
        console.error('Error al enviar la solicitud:', error);
      }
    );
  }
  
}
