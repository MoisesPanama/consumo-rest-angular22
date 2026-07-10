# Consumo de Web Services REST con Angular 22

Práctica de la asignatura **Aplicaciones Web** — Ingeniería de Software, UTEQ.

Aplicación Angular 22 standalone y zoneless que consume una API REST, implementando lectura reactiva con `httpResource`, mutaciones con `HttpClient`, manejo de errores por código de estado y resolución de CORS mediante proxy de desarrollo.

## Versiones utilizadas

- **Node.js:** v22.14.0
- **Angular CLI:** 22.x
- **Angular Core:** 22.x
- **TypeScript:** 6.x

Verificadas con:

```bash
node --version
ng version
```

## Estructura del proyecto

```
src/app/
├── app.ts                          # Componente raíz
├── app.html                        # Plantilla raíz
├── app.config.ts                   # Registro de provideHttpClient()
├── producto.model.ts               # Interfaz Producto
├── producto.service.ts             # Servicio con GET/POST/PUT/DELETE + manejo de errores
└── lista-productos/
    ├── lista-productos.ts          # Lectura con httpResource + crear/eliminar
    ├── lista-productos.html        # Plantilla con @if/@for
    └── lista-productos.css

proxy.conf.json                     # Proxy de desarrollo para evitar CORS
db.json                              # Datos simulados para json-server
```

## Funcionalidades implementadas

- ✅ **Lectura (GET)** de la colección de productos con `httpResource`, mostrando estados de carga (`isLoading()`) y error (`error()`) de forma reactiva con señales.
- ✅ **Creación (POST)** de un producto de prueba mediante `ProductoService`, con refresco automático de la lista al finalizar (`productos.reload()`).
- ✅ **Eliminación (DELETE)** de un producto por id, con refresco automático de la lista.
- ✅ **Manejo de errores** centralizado en el servicio, usando el operador `catchError` de RxJS, que interpreta el código de estado (`0` → CORS/red, `404` → no encontrado, `4xx` → error de cliente, `5xx` → error de servidor).
- ✅ **Proxy de desarrollo** (`proxy.conf.json`) que redirige las peticiones `/api/*` hacia la API real, evitando el bloqueo por CORS del navegador durante el desarrollo.

## Cómo ejecutar el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar la API simulada (json-server)

En una terminal:

```bash
json-server --port 8080 db.json
```

Esto expone la API en `http://localhost:8080/productos`.

### 3. Levantar Angular con el proxy

En una segunda terminal:

```bash
ng serve --proxy-config proxy.conf.json -o
```

Esto abre automáticamente `http://localhost:4200`, donde la app consume la API a través del proxy en `/api/productos` sin problemas de CORS.

> **Importante:** ambas terminales deben permanecer abiertas y corriendo al mismo tiempo.

## Diagnóstico de CORS

Se comprobó el comportamiento de CORS realizando una petición directa desde `http://localhost:4200` hacia `http://localhost:8080/productos` (orígenes distintos, sin proxy). Se confirmó mediante la pestaña *Network* del navegador que `json-server` envía por defecto la cabecera:

```
access-control-allow-origin: *
```

Esto significa que, en este caso particular, `json-server` ya autoriza cualquier origen y por lo tanto no se produce el bloqueo típico de CORS. Aun así, se comprendió el mecanismo: si esa cabecera no estuviera presente, el navegador habría bloqueado la lectura de la respuesta y se habría mostrado el error `status: 0` en el manejador de errores del servicio (`ProductoService`), tal como está previsto en el código.

En producción, esta cabecera la debe configurar el servidor de la API de forma explícita, o bien frontend y backend deben servirse desde el mismo origen. El proxy (`proxy.conf.json`) usado en este proyecto es únicamente una comodidad de desarrollo, no una solución válida para producción.

## Operaciones REST implementadas

| Operación   | Método HTTP | Endpoint              | Implementado en                     |
|-------------|-------------|------------------------|--------------------------------------|
| Leer todos  | GET         | `/api/productos`       | `httpResource` (lista-productos.ts) |
| Leer uno    | GET         | `/api/productos/:id`   | `ProductoService.obtener()`         |
| Crear       | POST        | `/api/productos`       | `ProductoService.crear()`           |
| Actualizar  | PUT         | `/api/productos/:id`   | `ProductoService.actualizar()`      |
| Eliminar    | DELETE      | `/api/productos/:id`   | `ProductoService.eliminar()`        |

## Autor

Moisés Panamá — Ingeniería de Software, UTEQ
