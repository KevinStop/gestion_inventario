import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';  // Importar Router para redirigir

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = this.userService.getUserRole();
  }

  // Método para cerrar sesión
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.userService.hasRole('admin');
  }

  isUser(): boolean {
    return this.userService.hasRole('user');
  }
}
