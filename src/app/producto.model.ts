// Una interfaz describe la "forma" del objeto JSON que devuelve la API.
// No genera código en tiempo de ejecución: solo sirve para el compilador.
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
}
