import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Producto } from './producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly base = '/api/productos';
  private readonly http = inject(HttpClient);

  // Manejador centralizado: interpreta el status y re-emite el error.
  private manejarError(err: HttpErrorResponse) {
    if (err.status === 0) {
      console.error('Sin red o bloqueo CORS: no se pudo contactar al servidor.');
    } else if (err.status === 404) {
      console.error('Recurso no encontrado (404).');
    } else if (err.status >= 400 && err.status < 500) {
      console.error(`Error del cliente (${err.status}).`);
    } else if (err.status >= 500) {
      console.error(`Error del servidor (${err.status}).`);
    }
    return throwError(() => err);
  }

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base).pipe(catchError(this.manejarError.bind(this)));
  }

  obtener(id: number): Observable<Producto> {
    return this.http
      .get<Producto>(`${this.base}/${id}`)
      .pipe(catchError(this.manejarError.bind(this)));
  }

  crear(p: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http
      .post<Producto>(this.base, p)
      .pipe(catchError(this.manejarError.bind(this)));
  }

  actualizar(id: number, p: Producto): Observable<Producto> {
    return this.http
      .put<Producto>(`${this.base}/${id}`, p)
      .pipe(catchError(this.manejarError.bind(this)));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/${id}`)
      .pipe(catchError(this.manejarError.bind(this)));
  }
}