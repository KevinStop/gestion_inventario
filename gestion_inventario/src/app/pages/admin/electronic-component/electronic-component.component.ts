import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal, initFlowbite } from 'flowbite';
import { ComponentService } from '../../../services/component.service';
import { CategoryService } from '../../../services/category.service';
import { SweetalertService } from '../../../components/alerts/sweet-alert.service';

@Component({
  selector: 'app-electronic-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './electronic-component.component.html',
  styleUrls: ['./electronic-component.component.css'],
})
export default class ElectronicComponentComponent implements OnInit {
  components: any[] = [];
  selectedImage: File | undefined = undefined;
  imagePreviewUrl: string | undefined = undefined;
  searchTerm: string = '';
  selectedCategories: string[] = [];
  categories: any[] = [];
  newCategory: any = { name: '' };
  selectedCategory: any = { name: '' };
  isDrawerOpen: boolean = false;
  selectedStatus: string | null = null;
  deleteItemType: string = '';
  isEditingCategory: boolean = false;
  updateForm: FormGroup;
  categoryForm: FormGroup;

  constructor(private componentService: ComponentService, private categoryService: CategoryService, private sweetalertService: SweetalertService,
    private formBuilder: FormBuilder,
  ) {
    this.updateForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', [Validators.required]],
      isActive: [true, [Validators.required]]
    });
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    initFlowbite();

    this.getCategories();
    this.getComponents();
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
    this.updateForm.patchValue({
      id: component.id,
      name: component.name,
      description: component.description,
      categoryId: component.categoryId,
      isActive: component.isActive
    });
    this.isDrawerOpen = true;
  }

  updateComponent(): void {
    if (this.updateForm.invalid) {
      this.sweetalertService.error('Por favor, complete todos los campos correctamente.');
      return;
    }
  
    const updatedComponent = this.updateForm.value;
  
    if (!updatedComponent.id) {
      console.error('ID del componente no encontrado.');
      this.sweetalertService.error('Error al obtener el componente.');
      return;
    }
  
    this.componentService.updateComponent(updatedComponent.id, updatedComponent, this.selectedImage).subscribe(
      () => {
        this.getComponents();
        this.isDrawerOpen = false;
        this.sweetalertService.success('Componente actualizado satisfactoriamente.');
      },
      (error) => {
        console.error('Error al actualizar el componente:', error);
        this.sweetalertService.error('Hubo un error al intentar actualizar el componente.');
      }
    );
  }  

  openDeleteModal(id: number, isCategory: boolean): void {
    this.deleteItemType = isCategory ? 'esta categoría' : 'este componente';
    const message = `¿Estás seguro de que deseas eliminar ${this.deleteItemType}?`;

    this.sweetalertService.confirm(message).then((result) => {
      if (result.isConfirmed) {
        if (isCategory) {
          this.deleteCategory(id);
        } else {
          this.deleteComponent(id);
        }
      }
    });
  }

  deleteComponent(id: number): void {
    this.componentService.deleteComponent(id).subscribe(
      () => {
        this.components = this.components.filter((component) => component.id !== id);
        this.sweetalertService.success('Componente eliminado con éxito.');
      },
      (error) => {
        console.error('Error al eliminar el componente:', error);
        this.sweetalertService.error('Hubo un error al intentar eliminar el componente.');
      }
    );
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
    if (this.categoryForm.invalid) {
      this.sweetalertService.error('El nombre de la categoría no puede estar vacío ni menor a 3 caracteres.');
      return;
    }

    const newCategory = this.categoryForm.value;

    this.categoryService.createCategory(newCategory).subscribe(
      (response) => {
        this.categories.push(response);
        this.sweetalertService.success('Categoría creada satisfactoriamente.');
        this.categoryForm.reset(); // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear la categoría:', error);
        this.sweetalertService.error('Hubo un error al intentar crear la categoría.');
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

  // Eliminar categoría
  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe(
      () => {
        this.categories = this.categories.filter((category) => category.id !== id);
        this.sweetalertService.success('Categoría eliminada con éxito.');
      },
      (error) => {
        console.error('Error al eliminar la categoría:', error);
        this.sweetalertService.error('Hubo un error al intentar eliminar la categoría.');
      }
    );
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
