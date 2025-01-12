import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  sessionExpiringMessage: boolean = false; // Estado para mostrar el mensaje
  expirationTimeout: any; // Timeout para verificar la expiración

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Comprobar si la sesión está por expirar
    this.checkSessionExpiration();
  }

  ngOnDestroy(): void {
    // Limpiar los temporizadores cuando el componente sea destruido
    clearTimeout(this.expirationTimeout);
  }

  // Verificar si la sesión está por expirar
  checkSessionExpiration(): void {
    this.userService.isSessionExpiring().subscribe((isExpiring) => {
      if (isExpiring) {
        this.sessionExpiringMessage = true; // Mostrar el mensaje de expiración
      }
    });
  }

  // Extender la sesión
  extendSession(): void {
    this.userService.extendSession().subscribe(
      () => {
        this.sessionExpiringMessage = false; // Ocultar el mensaje
        this.resetExpirationCheck(); // Reiniciar la verificación
      },
      (error) => {
        console.error('Error al extender la sesión:', error);
        this.logout(); // Cerrar sesión si falla la extensión
      }
    );
  }

  // Ignorar el mensaje de expiración
  dismissMessage(): void {
    this.sessionExpiringMessage = false;
  }

  // Cerrar sesión
  logout(): void {
    this.userService.logout();
    this.sessionExpiringMessage = false;
  }

  // Reiniciar la verificación de expiración
  resetExpirationCheck(): void {
    this.checkSessionExpiration();
  }
}
