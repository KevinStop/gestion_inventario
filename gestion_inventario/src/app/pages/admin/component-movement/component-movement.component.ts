import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal, initFlowbite } from 'flowbite';
import { ComponentService, ComponentResponse } from '../../../services/component.service';
import { ComponentMovementService } from '../../../services/component-movement.service';
import { CategoryService } from '../../../services/category.service';
import { SweetalertService } from '../../../components/alerts/sweet-alert.service';

@Component({
  selector: 'app-component-movement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './component-movement.component.html',
  styleUrl: './component-movement.component.css'
})
export default class ComponentMovementComponent implements OnInit, OnDestroy {

  components: ComponentResponse[] = [];
  categories: any[] = [];
  searchTerm: string = '';
  showComponentList: boolean = false;
  isAddingComponent: boolean = false;
  selectedType: string = 'Ingreso';
  showTypeDropdown: boolean = false;
  selectedComponent: any = null;
  quantity: number | null = null;
  reason: string = '';
  newComponent: any = { name: '', categoryId: '', quantity: null, description: '', isActive: false };
  successMessage: string = '';
  successModal?: Modal;
  selectedImage: File | undefined = undefined;
  imagePreviewUrl: string | undefined = undefined;
  showErrors: boolean = false;
  quantityValid: boolean = true;
  reasonValid: boolean = true;
  nameValid: boolean = true;
  categoryValid: boolean = true;
  quantityValid2: boolean = true;
  descriptionValid: boolean = true;

  constructor(private componentService: ComponentService, private componentMovementService: ComponentMovementService,
    private categoryService: CategoryService, private sweetalertService: SweetalertService) { }

  ngOnInit(): void {
    initFlowbite();

    this.getComponents();
    this.getCategories();

    document.addEventListener('click', this.closeComponentListOnClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeComponentListOnClickOutside.bind(this));
  }

  closeComponentListOnClickOutside(event: Event): void {
    this.showComponentList = false;
  }

  getComponents(): void {
    this.componentService.getComponents().subscribe(
      (response) => {
        this.components = response.components;
      },
      (error) => {
        console.error('Error al obtener los componentes:', error);
      }
    );
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  searchComponents(): void {
    if (this.searchTerm.trim()) {
      this.componentService.searchComponentsByName(this.searchTerm).subscribe(
        (response) => {
          this.components = response.components;
        },
        (error) => {
          console.error('Error al buscar los componentes:', error);
        }
      );
    } else {
      this.getComponents();
    }
  }

  toggleComponentList(show: boolean): void {
    this.showComponentList = show;
  }

  selectComponent(component: any): void {
    this.selectedComponent = component;
    this.isAddingComponent = false;
    this.searchTerm = component.name;
    this.showComponentList = false;
  }

  toggleTypeDropdown(): void {
    this.showTypeDropdown = !this.showTypeDropdown;
  }

  selectType(type: string): void {
    this.selectedType = type;
    this.showTypeDropdown = false;
  }

  // Enviar el movimiento al backend
  submitMovement(): void {
    this.showErrors = true;

    if (!this.validateForm()) {
      return;
    }

    const movementType = this.selectedType.toLowerCase();
    const movement = {
      componentId: this.selectedComponent?.id,
      quantity: this.quantity,
      reason: this.reason,
      movementType: movementType
    };

    this.componentMovementService.createComponentMovement(movement).subscribe(
      (response) => {
        this.sweetalertService.success(`Movimiento de ${movementType} realizado con éxito.`);
        this.resetForm();
        this.getComponents();
      },
      (error) => {
        const errorMessage = error.error?.error || 'Hubo un error al procesar el movimiento.';
        if (errorMessage.includes('razón del movimiento')) {
          this.sweetalertService.error('La razón del movimiento es obligatoria.');
        } else if (errorMessage === 'No hay un periodo académico activo disponible.') {
          this.sweetalertService.error(
            'No hay un periodo académico activo. Por favor, configúrelo antes de continuar.'
          );
        } else {
          this.sweetalertService.error(errorMessage);
        }
      }
    );
  }

  // Resetear el formulario después de enviar
  resetForm(): void {
    this.quantity = null;
    this.reason = '';
    this.selectedComponent = null;
    this.searchTerm = '';
    this.selectedType = 'Ingreso';

    this.newComponent = {
      name: '',
      categoryId: '',
      quantity: null,
      description: '',
      isActive: false,
    };
    this.selectedImage = undefined;
    this.imagePreviewUrl = undefined;

    this.showErrors = false;
  }

  createComponent(): void {
    this.showErrors = true;

    if (!this.validateForm2()) {
      this.sweetalertService.error('Por favor complete todos los campos obligatorios correctamente.');
      return;
    }

    // Sincronizar razón entre formularios
    if (this.reason.trim().length === 0) {
      this.sweetalertService.error('La razón del movimiento es obligatoria.');
      return;
    }

    // Añadir la razón al nuevo componente
    const newComponentData = {
      ...this.newComponent,
      reason: this.reason,
    };

    this.componentService.createComponent(newComponentData, this.selectedImage).subscribe(
      (response) => {
        this.successMessage = 'Componente y movimiento de ingreso creados satisfactoriamente.';
        this.sweetalertService.success(this.successMessage);

        this.isAddingComponent = false;
        this.getComponents();
        this.resetForm();
      },
      (error) => {
        const errorMessage = error.error?.error || 'Hubo un error al intentar crear el componente.';
        if (errorMessage.includes('razón del movimiento')) {
          this.sweetalertService.error('La razón del movimiento es obligatoria.');
        } else if (errorMessage === 'No hay un periodo académico activo disponible.') {
          this.sweetalertService.error(
            'No hay un periodo académico activo. Por favor, configúrelo antes de continuar.'
          );
        } else {
          this.sweetalertService.error(errorMessage);
        }
      }
    );
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.selectedImage = undefined;
      this.imagePreviewUrl = undefined;
    }
  }

  removeImage(): void {
    this.selectedImage = undefined;
    this.imagePreviewUrl = undefined;
  }

  openAddComponentForm(): void {
    this.isAddingComponent = true;
    this.selectedComponent = null;
    this.showComponentList = false;
    this.searchTerm = '';
  }

  // Validar individualmente los campos en cada cambio
  onQuantityChange(): void {
    this.quantityValid = this.quantity !== null && this.quantity > 0;
  }

  onReasonChange(): void {
    this.reasonValid = this.reason.trim().length > 0;
  }

  // Método para validar el formulario completo
  private validateForm(): boolean {
    this.quantityValid = this.quantity !== null && this.quantity > 0;
    this.reasonValid = this.reason.trim().length > 0;

    return this.quantityValid && this.reasonValid;
  }

  // Métodos para validar individualmente
  onNameChange(): void {
    this.nameValid = this.newComponent.name.trim().length > 0;
  }

  onCategoryChange(): void {
    this.categoryValid = !!this.newComponent.categoryId;
  }

  onDescriptionChange(): void {
    this.descriptionValid = this.newComponent.description.trim().length > 0;
  }

  onQuantityChange2(): void {
    this.quantityValid2 = this.newComponent.quantity !== null && this.newComponent.quantity > 0;
  }

  // Validación general del formulario
  private validateForm2(): boolean {
    this.nameValid = this.newComponent.name.trim().length > 0;
    this.categoryValid = !!this.newComponent.categoryId;
    this.quantityValid2 = this.newComponent.quantity !== null && this.newComponent.quantity > 0;
    this.descriptionValid = this.newComponent.description.trim().length > 0;
    this.reasonValid = this.reason.trim().length > 0;

    return this.nameValid && this.categoryValid && this.quantityValid2 && this.descriptionValid && this.reasonValid;
  }

}