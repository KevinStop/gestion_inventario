import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { ComponentService, ComponentResponse } from '../../../services/component.service';
import { RequestService } from '../../../services/request.service';
import { CategoryService } from '../../../services/category.service';
import { SweetalertService } from '../../../components/alerts/sweet-alert.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-view-components',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  templateUrl: './view-components.component.html',
  styleUrls: ['./view-components.component.css'],
  providers: [MessageService, ConfirmationService],
})
export default class ViewComponentsComponent implements OnInit {
  components: ComponentResponse[] = [];
  selectedQuantities: { [key: number]: number } = {};
  selectedCategories: number[] = [];
  filteredComponents: ComponentResponse[] = [];
  categories: any[] = [];

  constructor(
    private componentService: ComponentService,
    private requestService: RequestService,
    private sweetalertService: SweetalertService,
    private categoryService: CategoryService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getComponents();
    this.loadSelectedComponents();
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error al obtener las categorías:', error);
        this.sweetalertService.error('Error al obtener las categorías');
      }
    );
  }

  getComponents(): void {
    this.componentService.getComponents(true).subscribe(
      (response) => {
        // Filtrar componentes activos y con cantidad disponible
        this.components = response.components.filter(component => 
          component.isActive && component.availableQuantity > 0
        );
        this.filteredComponents = [...this.components];
      },
      (error) => {
        console.error('Error al obtener los componentes:', error);
        this.sweetalertService.error('Error al obtener los componentes.');
      }
    );
  }

  onQuantityChange(componentId: number, quantity: number): void {
    const component = this.components.find((comp) => comp.id === componentId);
    if (component) {
      if (quantity > component.availableQuantity) {
        this.selectedQuantities[componentId] = component.availableQuantity;
        this.sweetalertService.error(
          `La cantidad no puede exceder el máximo disponible (${component.availableQuantity}).`
        );
        this.loadSelectedComponents();
      } else {
        this.selectedQuantities[componentId] = quantity;
      }
    }
  }

  // Método para el filtrado por categorías
  onCategoryChange(categoryId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedCategories.includes(categoryId)) {
        this.selectedCategories.push(categoryId);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.selectedCategories.length > 0) {
      this.filteredComponents = this.components.filter(component =>
        this.selectedCategories.includes(component.categoryId)
      );
    } else {
      this.filteredComponents = [...this.components];
    }
  }

  resetFilters(): void {
    this.selectedCategories = [];
    this.filteredComponents = [...this.components];
    
    // Resetear los checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
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
    if (quantity && quantity > 0 && Number.isInteger(quantity)) {
      this.requestService.addSelectedComponentToStorage(component, quantity);
      this.messageService.add({
        severity: 'info',
        summary: 'Componente agregado',
        detail: 'Componente agregado exitosamente. ',
        life: 2000,
      });
      return;
    } else {
      this.sweetalertService.error('Debe seleccionar una cantidad válida para agregar el componente.');
      this.loadSelectedComponents();
    }
  }

  handleCategoryChange(event: Event, categoryId: number): void {
    const checkbox = event.target as HTMLInputElement;
    this.onCategoryChange(categoryId, checkbox.checked);
  }
}
