import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  sessionExpiringMessage: string | null = null; // Mensaje cuando la sesión esté por expirar
  expirationTimeout: any; // Timeout para verificar la expiración
  extendTimeout: any; // Timeout para cerrar sesión si no se extiende

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Comprobar si la sesión está por expirar y configurar los temporizadores
    this.checkSessionExpiration();
  }

  ngOnDestroy(): void {
    // Limpiar los temporizadores cuando el componente sea destruido
    clearTimeout(this.expirationTimeout);
    clearTimeout(this.extendTimeout);
  }

  checkSessionExpiration(): void {
    const token = this.userService.getToken();
    if (!token) return;

    const decodedToken: any = jwtDecode(token); // Utiliza jwtDecode aquí
    const currentTime = Date.now() / 1000; // El tiempo actual en segundos
    const timeRemaining = decodedToken.exp - currentTime;

    // Si falta menos de 5 minutos para que el token expire
    if (timeRemaining <= 300) {
      // Mostrar el mensaje de expiración de la sesión
      this.showSessionExpiringMessage(timeRemaining);
    } else {
      // Si hay más de 5 minutos restantes, calcular el tiempo hasta que falten 5 minutos
      const timeUntilExpiring = timeRemaining - 300;
      this.expirationTimeout = setTimeout(() => {
        this.showSessionExpiringMessage(timeRemaining);
      }, timeUntilExpiring * 1000);
    }
  }

  showSessionExpiringMessage(timeRemaining: number): void {
    // Mostrar el mensaje de expiración de la sesión con el tiempo restante
    this.sessionExpiringMessage = `Tu sesión expirará en ${Math.round(timeRemaining / 60)} minutos.`;

    // Configurar un temporizador para cerrar la sesión automáticamente después de 5 minutos
    this.extendTimeout = setTimeout(() => {
      this.logout();
    }, timeRemaining * 1000);
  }

  extendSession(): void {
    // Llamar al servicio para extender la sesión
    this.userService.extendSession().subscribe(
      (response) => {
        // Si se extiende la sesión con éxito, actualizamos el token y reiniciamos el temporizador
        this.userService.saveToken(response.token);
        this.sessionExpiringMessage = null;
        this.checkSessionExpiration();
      },
      (error) => {
        console.error('Error al extender la sesión:', error);
        this.logout(); // Si ocurre un error al renovar el token, cerramos sesión
      }
    );
  }

  logout(): void {
    // Llamar al servicio de logout
    this.userService.logout();
    this.sessionExpiringMessage = null;
  }

}
