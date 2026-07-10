import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Producto } from '../producto.model';

@Component({
  selector: 'app-lista-productos',
  imports: [CurrencyPipe],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos {
  // httpResource realiza el GET y devuelve señales de estado.
  // La función se re-evalúa si alguna señal interna cambia (reactividad).
  productos = httpResource<Producto[]>(() => '/api/productos');
}