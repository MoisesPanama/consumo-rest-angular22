import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Producto } from '../producto.model';
import { ProductoService } from '../producto.service';

@Component({
  selector: 'app-lista-productos',
  imports: [CurrencyPipe],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos {
  productos = httpResource<Producto[]>(() => '/api/productos');

  private readonly servicio = inject(ProductoService);

  guardar(): void {
    const nuevo = { nombre: 'Teclado', precio: 25.9, disponible: true };

    this.servicio.crear(nuevo).subscribe({
      next: (creado) => {
        console.log('Creado con id', creado.id);
        this.productos.reload();
      },
      error: (e) => console.error('No se pudo crear:', e.status),
    });
  }

  eliminar(id: number): void {
    this.servicio.eliminar(id).subscribe({
      next: () => {
        console.log('Eliminado id', id);
        this.productos.reload();
      },
      error: (e) => console.error('No se pudo eliminar:', e.status),
    });
  }
}