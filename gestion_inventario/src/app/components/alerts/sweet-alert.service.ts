import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() {}

  success(message: string): void {
    Swal.fire(this.getOptions('success', '¡Éxito!', message));
  }

  error(message: string): void {
    Swal.fire(this.getOptions('error', 'Error', message));
  }

  confirm(message: string): Promise<any> {
    return Swal.fire({
      ...this.getOptions('warning', '¿Estás seguro?', message),
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });
  }

  private getOptions(icon: 'success' | 'error' | 'warning', title: string, text: string): SweetAlertOptions {
    const isDarkMode = document.documentElement.classList.contains('dark'); // Detecta si el tema es oscuro
    return {
      icon,
      title,
      text,
      customClass: {
        popup: isDarkMode
          ? 'bg-gray-800 text-gray-300 rounded-lg shadow-md'
          : 'bg-white text-gray-900 rounded-lg shadow-md',
        title: 'text-lg font-semibold',
        confirmButton: 'mr-3 py-2 px-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300',
        cancelButton: 'ml-3 py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900'
      },
      buttonsStyling: false
    };
  }
}
