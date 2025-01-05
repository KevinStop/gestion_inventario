import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    initFlowbite();
  }

  // Método para manejar el login
  onSubmit(): void {
    this.userService.login(this.credentials).subscribe(
      () => {
        console.log('Login exitoso');

        // Obtener los detalles del usuario
        this.userService.getUserDetails().subscribe(
          (user) => {
            console.log('Detalles del usuario:', user);

            // Redirigir según el rol del usuario
            if (user.role === 'admin') {
              this.router.navigate(['/home/electronicComponent']);
            } else if (user.role === 'user') {
              this.router.navigate(['/home/viewComponents']);
            } else {
              // Si no tiene rol definido, redirigir a un lugar por defecto
              this.router.navigate(['/home']);
            }
          },
          (error) => {
            console.error('Error al obtener detalles del usuario:', error);
            alert('Hubo un problema al obtener los detalles del usuario. Intenta nuevamente.');
          }
        );
      },
      (error) => {
        console.error('Error en el login:', error);
        alert('Credenciales incorrectas, por favor intenta nuevamente.');
      }
    );
  }
}
