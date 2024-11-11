import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'flowbite';
import { ComponentService } from '../../../services/component.service';
import { ComponentElectronic as ComponentModel } from '../../../models/component-electronic.model';

@Component({
  selector: 'app-electronic-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './electronic-component.component.html',
  styleUrls: ['./electronic-component.component.css'],
})
export default class ElectronicComponentComponent implements OnInit {
  createModal?: Modal;
  successModal?: Modal;
  components: ComponentModel[] = [];
  newComponent: ComponentModel = new ComponentModel(
    0, '', '', 0, '', true, new Date(), new Date()
  );

  constructor(private componentService: ComponentService) {}

  ngOnInit(): void {
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

    this.loadComponents();
  }

  loadComponents(): void {
    this.componentService.getComponents().subscribe(
      (response) => {
        this.components = response;
      },
      (error) => {
        console.error('Error al cargar los componentes:', error);
      }
    );
  }

  createComponent(): void {
    this.componentService.createComponent(this.newComponent).subscribe(
      (response) => {
        this.successModal?.toggle();
        this.loadComponents();
        this.resetNewComponent();
        this.successModal?.show();
        this.createModal?.hide();
      },
      (error) => {
        console.error('Error al crear el componente:', error);
      }
    );
  }

  deleteComponent(componentId: number): void {
    this.componentService.deleteComponent(componentId).subscribe(
      (response) => {
        this.loadComponents();
      },
      (error) => {
        console.error('Error al eliminar el componente:', error);
      }
    );
  }

  resetNewComponent(): void {
    this.newComponent = new ComponentModel(0, '', '', 0, '', true, new Date(), new Date());
  }
}
