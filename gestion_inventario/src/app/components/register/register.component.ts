import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'; // Asegúrate de que la ruta del servicio es correcta
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
  
    // Enviar todos los datos necesarios: email, password, confirmPassword y name
    const userData = {
      email: this.userData.email,
      password: this.userData.password,
      confirmPassword: this.userData.confirmPassword,
      name: this.userData.name,
    };
  
    this.userService.register(userData).subscribe(
      (response) => {
        console.log('Usuario registrado con éxito', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error al registrar el usuario', error);
        // Mostrar el mensaje de error detallado
        const errorMessage = error.error?.message || 'Hubo un problema al registrar el usuario, por favor intenta nuevamente.';
        alert(errorMessage);
      }
    );
  }  
  
}
