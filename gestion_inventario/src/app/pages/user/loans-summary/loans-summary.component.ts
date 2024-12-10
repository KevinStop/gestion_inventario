import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import { UserService } from '../../../services/user.service';
import { initFlowbite } from 'flowbite';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-loans-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageModule],
  templateUrl: './loans-summary.component.html',
  styleUrls: ['./loans-summary.component.css'],
})
export default class LoansSummaryComponent implements OnInit {
  selectedComponents: any[] = [];
  totalAmount: number = 0;
  selectedQuantities: { [id: number]: number } = {};
  selectedFile: File | undefined = undefined;
  description: string = '';

  constructor(private requestService: RequestService, private userService: UserService) { }

  ngOnInit(): void {
    initFlowbite();
    this.loadSelectedComponents();
  }

  // Cargar los componentes seleccionados desde el servicio
  loadSelectedComponents(): void {
    // Obtener los componentes desde el servicio
    this.selectedComponents = this.requestService.getSelectedComponents();

    // Asegurarnos de que las cantidades estén actualizadas
    this.selectedComponents.forEach(component => {
      if (this.selectedQuantities[component.id] !== undefined) {
        component.quantity = this.selectedQuantities[component.id];
      } else {
        this.selectedQuantities[component.id] = component.quantity;
      }
    });

    // Calcular el total
    this.calculateTotal();
  }

  // Eliminar un componente de la lista
  removeComponent(componentId: number): void {
    // Filtramos el componente seleccionado
    this.selectedComponents = this.selectedComponents.filter(
      (component) => component.id !== componentId
    );

    // Actualizamos los componentes en el servicio
    this.requestService.setSelectedComponents(this.selectedComponents);

    // Volvemos a calcular el total
    this.calculateTotal();
  }

  // Actualizar la cantidad de un componente
  updateQuantity(componentId: number, quantity: number): void {
    const component = this.selectedComponents.find(
      (comp) => comp.id === componentId
    );

    // Si se encuentra el componente, actualizamos la cantidad
    if (component) {
      component.quantity = quantity;
      this.selectedQuantities[componentId] = quantity;

      // Actualizamos los componentes seleccionados en el servicio
      this.requestService.setSelectedComponents(this.selectedComponents);

      // Calculamos el total nuevamente
      this.calculateTotal();
    }
  }

  // Calcular el total de los componentes seleccionados
  calculateTotal(): void {
    this.totalAmount = this.selectedComponents.reduce((acc, component) => {
      return acc + (component.quantity || 0); // Sumar la cantidad de cada componente
    }, 0);
  }

  // Enviar la solicitud de préstamo
  submitRequest(): void {
    const requestData = {
      description: this.description,
    };

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

    if (transformedRequestDetails.length === 0) {
      console.error('No hay componentes válidos para enviar.');
      return;
    }

    this.requestService.createRequest(requestData, transformedRequestDetails, this.selectedFile).subscribe(
      (response) => {
        console.log('Solicitud enviada correctamente:', response);
        this.requestService.setSelectedComponents([]);
        this.selectedComponents = [];
        this.totalAmount = 0;
        this.selectedFile = undefined;
        this.description = '';

        // Limpiar el campo de archivo en el DOM
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
      },
      (error) => {
        console.error('Error al enviar la solicitud:', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos PNG, JPG, JPEG y PDF.');
        event.target.value = '';
      } else {
        this.selectedFile = file;
      }
    }
  }

}