import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
  }

  // Método para cerrar sesión
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  // Métodos para verificar el rol
  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  isUser(): boolean {
    return this.userService.isUser();
  }
}
