import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
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
      (response) => {
        const token = response.token;
        if (token) {
          this.userService.saveToken(token);
          console.log('Login exitoso', response);

          // Obtener el rol del usuario desde el token
          const role = this.userService.getUserRole();
          
          // Redirigir según el rol
          if (role === 'admin') {
            this.router.navigate(['/home/electronicComponent']);
          } else if (role === 'user') {
            this.router.navigate(['/home/viewComponents']);
          } else {
            // Si no tiene rol definido, puedes redirigir a un lugar por defecto
            this.router.navigate(['/home']);
          }
        }
      },
      (error) => {
        console.error('Error en el login', error);
        alert('Credenciales incorrectas, por favor intenta nuevamente.');
      }
    );
  }
}
