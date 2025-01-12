import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Image } from 'primeng/image';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Image],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export default class UserProfileComponent implements OnInit {
  user: any = {
    userId: '', // Agregar el campo userId
    name: '',
    email: '',
    imageUrl: '',
  };
  updatedData: any = { name: '', email: '', password: '' }; // Campos a actualizar
  selectedImage: File | null = null; // Imagen seleccionada
  imagePreview: string | null = null;
  isEditing = false; // Estado de edición

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.userService.getUserDetails().subscribe({
      next: (data) => {
        this.user = {
          userId: data.id || data.userId, // Asegúrate de capturar el ID del usuario
          name: data.name || 'No disponible',
          email: data.email || 'No disponible',
          imageUrl: data.imageUrl || 'http://localhost:3000/assets/default-user.png',
        };
        this.updatedData.name = this.user.name;
        this.updatedData.email = this.user.email;
      },
      error: (err) => {
        console.error('Error al obtener los detalles del usuario:', err);
      },
    });
  }

  // Capturar la imagen seleccionada
  onImageSelected(event: any): void {
    const file = event.target.files[0];

    // Validar tipo de archivo
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      alert('Solo se permiten imágenes en formato JPEG, JPG o PNG.');
      return;
    }

    // Asegurar que solo se permite un archivo
    if (event.target.files.length > 1) {
      alert('Solo puedes seleccionar una imagen a la vez.');
      return;
    }

    this.selectedImage = file;

    // Crear un objeto de vista previa para la imagen seleccionada
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;  // Asignar la vista previa
    };
    reader.readAsDataURL(file);
  }   

  // Actualizar datos del usuario
  updateUser(): void {
    const formData = new FormData();
    formData.append('name', this.updatedData.name);
    formData.append('email', this.updatedData.email);
    if (this.updatedData.password) {
      formData.append('password', this.updatedData.password);
    }
    if (this.selectedImage) {
      formData.append('image', this.selectedImage); // Campo para la imagen
    }

    this.userService.updateUser(this.user.userId, formData).subscribe({
      next: (response) => {
        alert('Usuario actualizado exitosamente');
        this.loadUserDetails(); // Recargar los datos del usuario
        this.isEditing = false; // Salir del modo de edición
      },
      error: (err) => {
        console.error('Error al actualizar el usuario:', err);
        alert('Ocurrió un error al actualizar los datos');
      },
    });
  }

  // Entrar en modo de edición
  startEditing(): void {
    this.isEditing = true;
  }

  // Guardar cambios y actualizar usuario
  saveChanges(): void {
    this.updateUser();
  }

  // Cancelar la edición
  cancelEditing(): void {
    this.isEditing = false;
    this.updatedData.name = this.user.name;
    this.updatedData.email = this.user.email;
    this.updatedData.password = '';
    this.selectedImage = null;
    this.imagePreview = this.user.selectedImage; 
  }
}
