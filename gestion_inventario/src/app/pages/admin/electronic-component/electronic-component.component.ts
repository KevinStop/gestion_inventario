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
  selectedImage: File | undefined = undefined;
  imagePreviewUrl: string | undefined = undefined;
  selectedComponent: any = { name: '', categoryId: '', description: '', isActive: false };
  searchTerm: string = '';
  selectedCategories: string[] = [];
  categories: any[] = [];
  newCategory: any = { name: '' };
  selectedCategory: any = { name: '' };
  successMessage: string = '';
  isDrawerOpen: boolean = false;
  selectedStatus: string | null = null;
  categoryIdToDelete: number | null = null;
  deleteItemType: string = '';
  isEditingCategory: boolean = false;

  constructor(private componentService: ComponentService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    initFlowbite();

    this.getCategories();

    this.getComponents();

    const successModalElement = document.querySelector('#successModal') as HTMLElement;
    this.successModal = new Modal(successModalElement);

    const continueButton = document.querySelector('#continueButton') as HTMLElement;
    continueButton.addEventListener('click', () => {
      this.successModal?.hide();
    });

  }

  // Método para obtener todos los componentes
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

  // Método para obtener todas las categorías
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

  openDrawerForUpdate(component: any): void {
    this.selectedComponent = { ...component };
    this.isDrawerOpen = true;
  }

  updateComponent(): void {
    if (this.selectedComponent && this.selectedComponent.id) {
      this.componentService.updateComponent(this.selectedComponent.id, this.selectedComponent, this.selectedImage).subscribe(
        (data) => {
          const index = this.components.findIndex((component) => component.id === data.id);
          if (index !== -1) {
            this.components[index] = data;
          }
          this.getComponents();
          this.closeDrawer();
          this.successMessage = 'Componente actualizado satisfactoriamente.';
          setTimeout(() => {
            this.successModal?.show();
          }, 300);
        },
        (error) => {
          console.error('Error al actualizar el componente:', error);
          alert('Hubo un error al intentar actualizar el componente');
        }
      );
    }
  }

  openDeleteModal(id: number, isCategory: boolean): void {
    this.isDeleteModalOpen = true;
    if (isCategory) {
      this.deleteItemType = 'esta categoría';
      this.categoryIdToDelete = id;
    } else {
      this.deleteItemType = 'este componente';
      this.componentIdToDelete = id;
    }
  }   

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.componentIdToDelete = null;
    this.categoryIdToDelete = null;
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
    } else if (this.categoryIdToDelete !== null) {
      this.categoryService.deleteCategory(this.categoryIdToDelete).subscribe(
        () => {
          this.categories = this.categories.filter((category) => category.id !== this.categoryIdToDelete);
          this.closeDeleteModal();
          alert('Categoría eliminada con éxito');
        },
        (error) => {
          console.error('Error al eliminar la categoría:', error);
          alert('Hubo un error al intentar eliminar la categoría');
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

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  // Método para crear la categoría
  createCategory(): void {
    this.categoryService.createCategory(this.newCategory).subscribe(
      (response) => {
        console.log('Categoría creada:', response);
        this.categories.push(response);
        this.newCategory.name = '';
        this.successMessage = 'Categoría creada satisfactoriamente.';
        setTimeout(() => {
          this.successModal?.show();
        }, 300);
      },
      (error) => {
        console.error('Error al crear la categoría:', error);
      }
    );
  }

  // Método para manejar el cambio en el filtro de estado
  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    if (selectedValue === '') {
      // Si la opción es "Todos", obtenemos todos los componentes
      this.selectedStatus = null;
      this.getComponents();
    } else {
      // Filtrar los componentes según el estado seleccionado (activo o inactivo)
      this.selectedStatus = selectedValue === 'activo' ? 'activo' : 'inactivo';
      this.filterComponentsByStatus(this.selectedStatus);
    }
  }

  // Método para filtrar los componentes por estado (activo o inactivo)
  filterComponentsByStatus(status: string): void {
    if (status !== null) {
      this.componentService.filterComponentsByStatus(status).subscribe(
        (data) => {
          this.components = data.components;
        },
        (error) => {
          console.error('Error al filtrar componentes por estado:', error);
        }
      );
    } else {
      this.getComponents();
    }
  }

  // Método para actualizar una categoría
  updateCategory(): void {
    if (this.selectedCategory && this.selectedCategory.id) {
      this.categoryService.updateCategory(this.selectedCategory.id, this.selectedCategory).subscribe(
        (response) => {
          const index = this.categories.findIndex((category) => category.id === response.id);
          if (index !== -1) {
            this.categories[index] = response;
          }
        },
        (error) => {
          console.error('Error al actualizar la categoría:', error);
          alert('Hubo un error al intentar actualizar la categoría');
        }
      );
    }
  }

  // Método para eliminar una categoría
  deleteCategory(): void {
    if (this.categoryIdToDelete !== null) {
      this.categoryService.deleteCategory(this.categoryIdToDelete).subscribe(
        () => {
          this.categories = this.categories.filter((category) => category.id !== this.categoryIdToDelete);
          this.closeDeleteModal();
          alert('Categoría eliminada con éxito');
        },
        (error) => {
          console.error('Error al eliminar la categoría:', error);
          alert('Hubo un error al intentar eliminar la categoría');
        }
      );
    }
  }

  // Función para habilitar la edición del nombre de la categoría
  enableEditCategory(category: any): void {
    this.selectedCategory = { ...category };
    this.isEditingCategory = true;
  }

  // Función para guardar la categoría actualizada
  saveCategory(): void {
    this.categoryService.updateCategory(this.selectedCategory.id, this.selectedCategory).subscribe(
      (response) => {
        const index = this.categories.findIndex((category) => category.id === response.id);
        if (index !== -1) {
          this.categories[index] = response;  
        }
        this.isEditingCategory = false; 
      },
      (error) => {
        console.error('Error al actualizar la categoría:', error);
        alert('Hubo un error al intentar actualizar la categoría');
      }
    );
  }

}
