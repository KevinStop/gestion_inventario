import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import { UserService } from '../../../services/user.service';
import { initFlowbite } from 'flowbite';
import { ImageModule } from 'primeng/image';
import { RouterLink } from '@angular/router';
import { SweetalertService } from '../../../components/alerts/sweet-alert.service';

@Component({
  selector: 'app-loans-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ImageModule, RouterLink],
  templateUrl: './loans-summary.component.html',
  styleUrls: ['./loans-summary.component.css'],
})
export default class LoansSummaryComponent implements OnInit {
  formGroup: FormGroup;
  selectedComponents: any[] = [];
  totalAmount: number = 0;
  selectedFile: File | undefined = undefined;

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private fb: FormBuilder,
    private sweetalertService: SweetalertService // Inyectamos el servicio de alertas
  ) {
    this.formGroup = this.fb.group({
      typeRequest: ['', Validators.required],
      returnDate: ['', [Validators.required, this.dateValidator]],
      comprobante: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    initFlowbite();
    this.loadSelectedComponents();
  }

  loadSelectedComponents(): void {
    this.selectedComponents = this.requestService.getSelectedComponents();
    this.calculateTotal();
  }

  hasSelectedComponents(): boolean {
    return this.selectedComponents.length > 0;
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value).setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return { invalidDate: true };
    }
    return null;
  }

  updateQuantity(componentId: number, quantity: number): void {
    if (quantity < 1) {
      this.sweetalertService.error('La cantidad no puede ser menor a 1.');
      return;
    }

    const component = this.selectedComponents.find((comp) => comp.id === componentId);
    if (component) {
      component.quantity = quantity;
    }

    this.requestService.setSelectedComponents(this.selectedComponents);
    this.calculateTotal();
  }

  removeComponent(componentId: number): void {
    this.sweetalertService
      .confirm('¿Estás seguro de que deseas eliminar este componente?')
      .then((result) => {
        if (result.isConfirmed) {
          this.selectedComponents = this.selectedComponents.filter(
            (component) => component.id !== componentId
          );
          this.requestService.setSelectedComponents(this.selectedComponents);
          this.calculateTotal();
          this.sweetalertService.success('Componente eliminado exitosamente.');
        }
      });
  }

  calculateTotal(): void {
    this.totalAmount = this.selectedComponents.reduce(
      (acc, component) => acc + (component.quantity || 0),
      0
    );
  }

  submitRequest(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.sweetalertService.error('Debe completar todos los campos requeridos.');
      return;
    }
    if (!this.hasSelectedComponents()) {
      this.sweetalertService.error('Debe seleccionar al menos un componente.');
      return;
    }

    const formData = {
      ...this.formGroup.value,
      selectedComponents: this.selectedComponents
        .filter((component) => component.quantity > 0)
        .map((component) => ({
          componentId: component.id,
          quantity: component.quantity,
        })),
    };

    if (formData.selectedComponents.length === 0) {
      this.sweetalertService.error('Debe seleccionar al menos un componente válido.');
      return;
    }

    this.requestService.createRequest(formData, formData.selectedComponents, this.selectedFile).subscribe(
      (response) => {
        this.sweetalertService.success('Solicitud enviada correctamente.');
        this.selectedComponents = [];
        this.totalAmount = 0;
        this.formGroup.reset();
        this.requestService.setSelectedComponents([]);
      },
      (error) => {
        console.error('Error al enviar la solicitud:', error);
        this.sweetalertService.error('Error al enviar la solicitud.');
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.sweetalertService.error('Solo se permiten archivos PNG, JPG, JPEG y PDF.');
        event.target.value = '';
      } else {
        this.selectedFile = file;
        this.formGroup.patchValue({ comprobante: file });
      }
    }
  }
}
