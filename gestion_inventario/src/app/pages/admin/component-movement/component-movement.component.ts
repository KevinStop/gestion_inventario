import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal, initFlowbite } from 'flowbite';
import { ComponentService } from '../../../services/component.service';
import { ComponentMovementService } from '../../../services/component-movement.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-component-movement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './component-movement.component.html',
  styleUrl: './component-movement.component.css'
})
export default class ComponentMovementComponent implements OnInit, OnDestroy {

  components: any[] = [];
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

  constructor(private componentService: ComponentService, private componentMovementService: ComponentMovementService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    initFlowbite();

    this.getComponents();
    this.getCategories();

    document.addEventListener('click', this.closeComponentListOnClickOutside.bind(this));

    const successModalElement = document.querySelector('#successModal') as HTMLElement;
    this.successModal = new Modal(successModalElement);

    const continueButton = document.querySelector('#continueButton') as HTMLElement;
    continueButton.addEventListener('click', () => {
      this.successModal?.hide();
    });
  }
  
  ngOnDestroy(): void {
    // Remover listener al destruir el componente
    document.removeEventListener('click', this.closeComponentListOnClickOutside.bind(this));
  }

  closeComponentListOnClickOutside(event: Event): void {
    this.showComponentList = false;
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
        (data) => {
          this.components = data.components || [];
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
    if (!this.selectedComponent || (!this.quantity && !this.isAddingComponent) || !this.reason) {
      alert('Por favor, complete todos los campos antes de enviar.');
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
        alert(`Movimiento ${movementType} realizado con éxito.`);
        this.resetForm();
        this.getComponents();
      },
      (error) => {
        console.error('Error al realizar el movimiento:', error);
        alert('Hubo un error al procesar el movimiento.');
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
  }

  createComponent() {
    this.componentService.createComponent(this.newComponent, this.selectedImage).subscribe(
      (response) => {
        const createdComponent = response; 
        this.successMessage = 'Componente creado satisfactoriamente.';
        this.isAddingComponent = false;
  
        const movement = {
          componentId: createdComponent.id,
          quantity: this.quantity = 0,
          reason: this.reason,
          movementType: 'ingreso'
        };
  
        this.componentMovementService.createComponentMovement(movement).subscribe(
          (movementResponse) => {
            this.successMessage = 'Movimiento de ingreso realizado satisfactoriamente.';
            this.getComponents(); 
            this.resetForm();
  
            setTimeout(() => {
              this.successModal?.show();
            }, 300);
          },
          (movementError) => {
            alert('Error al realizar el movimiento de ingreso.');
            console.error('Movimiento error:', movementError);
          }
        );
      },
      (error) => {
        alert('Hubo un error al intentar crear el componente');
        console.error('Error al crear el componente:', error);
        this.resetForm();
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

}
