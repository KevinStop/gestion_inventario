import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { initFlowbite, Modal } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SweetalertService } from '../../../components/alerts/sweet-alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };

  private modalInstance: Modal | null = null;

  constructor(private userService: UserService, private router: Router, private sweetalertService: SweetalertService) { }

  ngOnInit(): void {
    initFlowbite();

    const modalElement = document.getElementById('moduleModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        closable: true,
        onHide: () => {
          // Limpiar el overlay gris cuando se cierra el modal
          document.body.classList.remove('overflow-hidden');
        }
      });
    }

    // Establecer tema claro por defecto si no hay preferencia guardada
    if (!localStorage.getItem('color-theme')) {
      localStorage.setItem('color-theme', 'light');
    }

    // Aplicar tema según la configuración
    if (localStorage.getItem('color-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Configurar los iconos
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    if (localStorage.getItem('color-theme') === 'dark') {
      themeToggleLightIcon!.classList.remove('hidden');
    } else {
      themeToggleDarkIcon!.classList.remove('hidden');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn!.addEventListener('click', () => {
      // Toggle icons inside button
      themeToggleDarkIcon!.classList.toggle('hidden');
      themeToggleLightIcon!.classList.toggle('hidden');

      // Cambiar tema
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }
    });
  }

  // Método para manejar el login
  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      const errorMessage = 'Por favor, Complete los campos';
        this.sweetalertService.error(errorMessage);
      return;
    }

    this.modalInstance?.show();
  }

  // Nuevo método para manejar la selección del módulo
  selectModule(module: string): void {
    if (module === 'inventario') {
      // Cerrar el modal antes de proceder con el login
      this.modalInstance?.hide();
      
      this.userService.login(this.credentials).subscribe({
        next: () => {
          this.userService.getUserDetails().subscribe({
            next: (user) => {
              if (user.role === 'admin') {
                this.router.navigate(['/home/electronicComponent']);
              } else if (user.role === 'user') {
                this.router.navigate(['/home/viewComponents']);
              } else {
                this.router.navigate(['/home']);
              }
            },
            error: (error) => {
              const errorMessage = error.error?.message || 'Hubo un problema al obtener los detalles del usuario. Intenta nuevamente.';
              this.sweetalertService.error(errorMessage);
            }
          });
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Credenciales incorrectas, por favor intenta nuevamente.';
          this.sweetalertService.error(errorMessage);
        }
      });
    }
  }

  // Agregar método para cerrar el modal
  closeModal(): void {
    this.modalInstance?.hide();
  }
}
