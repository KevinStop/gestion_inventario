import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal, initFlowbite } from 'flowbite';
import { ComponentService } from '../../../services/component.service';
import { CategoryService } from '../../../services/category.service'; 

@Component({
  selector: 'app-electronic-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './electronic-component.component.html',
  styleUrls: ['./electronic-component.component.css'],
})
export default class ElectronicComponentComponent implements OnInit {
  createModal?: Modal;
  successModal?: Modal;
  components: any[] = [];
  isDeleteModalOpen: boolean = false;
  componentIdToDelete: number | null = null;
  newComponent: any = { name: '', categoryId: '', quantity: 0, isActive: true }; // Cambiar 'category' a 'categoryId'
  selectedImage: File | undefined = undefined;
  imagePreviewUrl: string | undefined = undefined;
  selectedComponent: any = { name: '', categoryId: '', description: '', isActive: true }; // Cambiar 'category' a 'categoryId'
  searchTerm: string = '';
  selectedCategories: string[] = [];
  categories: any[] = [];

  // Variables de paginación
  currentPage: number = 1;
  limit: number = 10;
  totalComponents: number = 0;
  totalPages: number = 1;

  constructor(private componentService: ComponentService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    initFlowbite();

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.getComponents();

    const createModalElement = document.querySelector('#createModal') as HTMLElement;
    this.createModal = new Modal(createModalElement);

    const successModalElement = document.querySelector('#successModal') as HTMLElement;
    this.successModal = new Modal(successModalElement);

    const openButton = document.querySelector('#createModalButton') as HTMLElement;
    openButton.addEventListener('click', () => {
      this.createModal?.toggle();
    });

    const closeButton = createModalElement.querySelector('[data-modal-toggle="defaultModal"]') as HTMLElement;
    closeButton.addEventListener('click', () => {
      this.createModal?.hide();
    });

    const continueButton = document.querySelector('#continueButton') as HTMLElement;
    continueButton.addEventListener('click', () => {
      this.successModal?.hide();
    });
  }

  getComponents(): void {
    this.componentService.getComponents(this.currentPage, this.limit).subscribe(
      (data) => {
        this.components = data.components;
        this.totalComponents = data.totalComponents;
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.error('Error al obtener los componentes:', error);
      }
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getComponents();
  }

  searchComponents(): void {
    if (this.searchTerm.trim()) {
      this.componentService.searchComponentsByName(this.searchTerm).subscribe(
        (data) => {
          this.components = data;
        },
        (error) => {
          console.error('Error al buscar los componentes:', error);
        }
      );
    } else {
      this.getComponents();
    }
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

  createComponent() {
    console.log('Componente a crear:', this.newComponent);
    console.log('Archivo de imagen:', this.selectedImage);

    this.componentService.createComponent(this.newComponent, this.selectedImage).subscribe(
      (response) => {
        console.log('Componente creado:', response);
        this.getComponents();
        this.createModal?.hide();
        this.successModal?.show();
      },
      (error) => {
        console.error('Error al crear el componente:', error);
        alert('Hubo un error al intentar crear el componente');
      }
    );
  }

  openDrawerForUpdate(component: any): void {
    this.selectedComponent = { ...component };
    const drawer = document.getElementById('drawer-update-product') as HTMLElement;
    drawer?.classList.remove('-translate-x-full');
    drawer?.classList.add('translate-x-0');
  }

  updateComponent(): void {
    if (this.selectedComponent && this.selectedComponent.id) {
      this.componentService.updateComponent(this.selectedComponent.id, this.selectedComponent, this.selectedImage).subscribe(
        (data) => {
          const index = this.components.findIndex((component) => component.id === data.id);
          if (index !== -1) {
            this.components[index] = data;
          }
          alert('Componente actualizado con éxito');
        },
        (error) => {
          console.error('Error al actualizar el componente:', error);
          alert('Hubo un error al intentar actualizar el componente');
        }
      );
    }
  }

  openDeleteModal(id: number): void {
    this.isDeleteModalOpen = true;
    this.componentIdToDelete = id;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.componentIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.componentIdToDelete !== null) {
      this.componentService.deleteComponent(this.componentIdToDelete).subscribe(
        () => {
          this.components = this.components.filter((component) => component.id !== this.componentIdToDelete);
          this.closeDeleteModal();
          alert('Componente eliminado con éxito');
        },
        (error) => {
          console.error('Error al eliminar el componente:', error);
          alert('Hubo un error al intentar eliminar el componente');
        }
      );
    }
  }

  getFilteredComponents(): void {
    if (this.selectedCategories.length > 0) {
      this.componentService.filterComponentsByCategories(this.selectedCategories).subscribe(
        (components) => {
          this.components = components;
        },
        (error) => {
          console.error('Error al obtener los componentes filtrados', error);
        }
      );
    } else {
      this.getComponents();
    }
  }

  onCategoryChange(event: any): void {
    const categoryId = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.getFilteredComponents();
  }
}
