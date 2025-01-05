import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import { UserService } from '../../../services/user.service';
import { initFlowbite } from 'flowbite';
import { ImageModule } from 'primeng/image';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loans-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImageModule, RouterLink],
  templateUrl: './loans-summary.component.html',
  styleUrls: ['./loans-summary.component.css'],
})
export default class LoansSummaryComponent implements OnInit {
  formGroup: FormGroup; // FormGroup para gestionar el formulario
  selectedComponents: any[] = [];
  totalAmount: number = 0;
  selectedFile: File | undefined = undefined;

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private fb: FormBuilder // FormBuilder para crear el formulario
  ) {
    // Inicializamos el FormGroup con validaciones
    this.formGroup = this.fb.group({
      typeRequest: ['', Validators.required], // Tipo de préstamo requerido
      returnDate: [
        '',
        [Validators.required, this.dateValidator] // Fecha de retorno requerida y válida
      ],
      comprobante: ['', Validators.required], // Comprobante requerido
      description: [''], // Descripción opcional
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.loadSelectedComponents();
  }

  // Cargar los componentes seleccionados desde el servicio
  loadSelectedComponents(): void {
    this.selectedComponents = this.requestService.getSelectedComponents();
    this.calculateTotal();
  }

  // Validar si hay componentes seleccionados
  hasSelectedComponents(): boolean {
    return this.selectedComponents.length > 0;
  }

  // Custom Validator para fechas
  dateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return { invalidDate: true }; // Devuelve un error si la fecha es menor a hoy
    }
    return null; // Sin errores
  }

  // Actualizar la cantidad de un componente
  updateQuantity(componentId: number, quantity: number): void {
    // Validar que la cantidad sea válida (mayor a 0)
    if (quantity < 1) {
      alert('La cantidad no puede ser menor a 1.');
      return;
    }

    // Actualizar la cantidad en selectedComponents
    const component = this.selectedComponents.find((comp) => comp.id === componentId);
    if (component) {
      component.quantity = quantity;
    }

    // Actualizar en el servicio y recalcular el total
    this.requestService.setSelectedComponents(this.selectedComponents);
    this.calculateTotal();
  }

  // Eliminar un componente de la lista
  removeComponent(componentId: number): void {
    this.selectedComponents = this.selectedComponents.filter(
      (component) => component.id !== componentId
    );
    this.requestService.setSelectedComponents(this.selectedComponents);
    this.calculateTotal();
  }

  // Calcular el total de los componentes seleccionados
  calculateTotal(): void {
    this.totalAmount = this.selectedComponents.reduce((acc, component) => acc + (component.quantity || 0), 0);
  }

  // Enviar la solicitud de préstamo
  submitRequest(): void {
    // Validar si el formulario es válido y si hay componentes seleccionados
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      return;
    }
    if (!this.hasSelectedComponents()) {
      alert('Debe seleccionar al menos un componente.');
      return;
    }

    const formData = {
      ...this.formGroup.value, // Incluye los datos del formulario, incluyendo la descripción
      selectedComponents: this.selectedComponents
        .filter((component) => component.quantity > 0)
        .map((component) => ({
          componentId: component.id,
          quantity: component.quantity,
        })),
    };

    if (formData.selectedComponents.length === 0) {
      alert('Debe seleccionar al menos un componente válido.');
      return;
    }

    // Llamada al servicio para enviar la solicitud
    this.requestService.createRequest(formData, formData.selectedComponents, this.selectedFile).subscribe(
      (response) => {
        console.log('Solicitud enviada correctamente:', response);
        this.selectedComponents = [];
        this.totalAmount = 0;
        this.formGroup.reset(); // Resetea el formulario
        this.requestService.setSelectedComponents([]);
      },
      (error) => {
        console.error('Error al enviar la solicitud:', error);
      }
    );
  }

  // Manejar el archivo seleccionado
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos PNG, JPG, JPEG y PDF.');
        event.target.value = '';
      } else {
        this.selectedFile = file;
        this.formGroup.patchValue({ comprobante: file }); // Actualiza el campo de comprobante
      }
    }
  }
}
