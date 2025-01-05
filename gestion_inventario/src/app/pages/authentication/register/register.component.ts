import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export default class RegisterComponent {
  userData = {
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  // Método para manejar el registro de usuario
  onSubmit(): void {
    if (this.userData.password !== this.userData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Crear un objeto con los datos necesarios (eliminar `confirmPassword`)
    const userData = {
      email: this.userData.email,
      password: this.userData.password,
      name: this.userData.name
    };

    this.userService.register(userData).subscribe(
      () => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error al registrar el usuario:', error);

        // Mostrar mensaje de error detallado
        const errorMessage =
          error.error?.message || 'Hubo un problema al registrar el usuario. Por favor, intenta nuevamente.';
        alert(errorMessage);
      }
    );
  }
}
