import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AcademicPeriodsService } from '../../../services/academic-periods.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-academic-periods',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-periods.component.html',
  styleUrl: './academic-periods.component.css'
})
export default class AcademicPeriodsComponent implements OnInit {

  academicPeriods: any[] = [];
  activePeriod: any = null;
  inactivePeriods: any[] = [];
  isEdit: boolean = false;
  showInactiveTable: boolean = false;
  newPeriod: any = { name: '', startDate: '', endDate: '' };

  constructor(private academicPeriodsService: AcademicPeriodsService) { }

  ngOnInit(): void {
    initFlowbite();
    this.loadPeriods();
  }

  // Cargar períodos activos e inactivos
  loadPeriods(): void {
    this.academicPeriodsService.getAcademicPeriods().subscribe({
      next: (data) => {
        this.academicPeriods = data.academicPeriods;
        this.activePeriod = this.academicPeriods.find((p: any) => p.isActive) || null;
        this.inactivePeriods = this.academicPeriods.filter((p: any) => !p.isActive);
      },
      error: (err) => console.error('Error al cargar los períodos:', err),
    });
  }

  // Abrir formulario para asignar nuevo período
  openCreateForm(): void {
    this.isEdit = false;
    this.showInactiveTable = false; 
    this.newPeriod = { name: '', startDate: '', endDate: '' };
  }

  // Abrir formulario para editar período
  openEditForm(): void {
    this.isEdit = true;
    this.showInactiveTable = false; 
    this.newPeriod = {
      ...this.activePeriod,
      startDate: new Date(this.activePeriod.startDate).toISOString().split('T')[0],
      endDate: new Date(this.activePeriod.endDate).toISOString().split('T')[0],
    };
  }

  // Crear o editar período
  savePeriod(): void {
    if (this.isEdit) {
      this.academicPeriodsService.updateAcademicPeriod(this.activePeriod.id, this.newPeriod).subscribe({
        next: () => {
          this.loadPeriods();
          alert('Período actualizado con éxito.');
        },
        error: (err) => console.error('Error al actualizar el período:', err),
      });
    } else {
      this.academicPeriodsService.createAcademicPeriod(this.newPeriod).subscribe({
        next: (newPeriod) => {
          this.academicPeriodsService.activateAcademicPeriod(newPeriod.id).subscribe({
            next: () => {
              this.loadPeriods();
              alert('Nuevo período creado y activado con éxito.');
            },
            error: (err) => console.error('Error al activar el período:', err),
          });
        },
        error: (err) => console.error('Error al crear el período:', err),
      });
    }
  }

  // Activar un período inactivo
  activatePeriod(periodId: number): void {
    this.academicPeriodsService.activateAcademicPeriod(String(periodId)).subscribe({
      next: () => {
        this.loadPeriods();
        alert('Período activado con éxito.');
      },
      error: (err) => console.error('Error al activar el período:', err),
    });
  }

  // Mostrar/Ocultar tabla de períodos inactivos
  toggleInactiveTable(): void {
    this.showInactiveTable = !this.showInactiveTable;
  
    if (this.showInactiveTable) {
      this.isEdit = false;
      this.newPeriod = { name: '', startDate: '', endDate: '' };
    }
  }

}
