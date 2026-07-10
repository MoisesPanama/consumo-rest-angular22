import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from './producto.model';

// @Injectable con providedIn: 'root' crea UNA sola instancia para toda la app.
@Injectable({ providedIn: 'root' })
export class ProductoService {

  // URL base del recurso. Es relativa para que funcione con el proxy (paso 7).
  private readonly base = '/api/productos';

  // inject() obtiene HttpClient sin necesitar un constructor.
  private readonly http = inject(HttpClient);

  // GET colección: devuelve un Observable con un arreglo de productos.
  // El <Producto[]> le dice a Angular el tipo esperado de la respuesta JSON.
  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  // GET por id: obtiene un único recurso.
  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  // POST: crea un recurso. El segundo argumento es el cuerpo (body) enviado.
  // Angular serializa el objeto a JSON automáticamente.
  crear(p: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(this.base, p);
  }

  // PUT: reemplaza por completo el recurso identificado por id.
  actualizar(id: number, p: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, p);
  }

  // DELETE: elimina el recurso. Suele responder 204 No Content (sin cuerpo).
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
