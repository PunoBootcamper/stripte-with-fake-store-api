# Proyecto de Procesamiento de pagos con Stripe

Este proyecto es una aplicación de carrito de compras full-stack que se integra con Stripe para pagos. Consiste en dos partes principales:

- **Cliente**: Frontend desarrollado con React y Vite, estilizado con Tailwind CSS.
- **Servidor**: Backend construido con Node.js, TypeScript, y Prisma para la gestión de la base de datos.

## Características

- Agregar productos al carrito de compras con un temporizador de cuenta regresiva.
- Resumen del carrito de compras flotante que muestra la cantidad de ítems y el monto total.
- Integración de pagos usando Stripe.
- Gestión persistente de usuarios y transacciones con Prisma.


## Capturas

Tienda
![alt text](image.png)


Detalle de compra
![alt text](image-1.png)

Pago
![alt text](image-2.png)

Mensaje de pago procesado
![alt text](image-3.png)

## Estructura del Proyecto

```
project-root
│
├── client   # Aplicación Frontend
│   ├── public
│   ├── src
│       ├── assets
│       ├── components
│       └── contexts
│       └── pages
├── server   # Aplicación Backend
    ├── src
       ├── index.ts

### Cliente (Frontend)
- **React**: Proporciona una interfaz de usuario responsiva.
- **Vite**: Servidor de desarrollo para compilaciones más rápidas.
- **Tailwind CSS**: Estiliza los componentes de la interfaz de usuario.

### Servidor (Backend)
- **Node.js**: Entorno de ejecución del backend.
- **TypeScript**: Añade seguridad de tipos al código del backend.
- **Prisma**: ORM utilizado para la gestión de la base de datos.
- **Stripe**: Integración de pagos para gestionar transacciones de usuarios.

## Requisitos Previos

- **Node.js** (v14+)
- **npm** o **yarn**
- **PostgreSQL** u otra base de datos soportada por Prisma.

## Instrucciones de Configuración

### Clonar el repositorio
```sh
$ git clone https://github.com/PunoBootcamper/stripte-with-fake-store-api.git
$ cd stripte-with-fake-store-api
```

### Instalar Dependencias

#### Cliente
```sh
$ cd client
$ npm install
```

#### Servidor
```sh
$ cd ../server
$ npm install
```

### Variables de Entorno

Crea un archivo `.env` en el directorio `server` con las siguientes variables:

```env
DATABASE_URL=postgresql://jdoe:pass@localhost:5432/payment-db?schema=public
STRIPE_SECRET_KEY=ssghbjf67adfuyba7ssfgB
CLIENT_URL=http://localhost:5173
```

Crea un archivo `.env` en el directorio `client` con las siguientes variables:

```env
VITE_API_URL=http://localhost:5000
```

### Ejecutar la Aplicación

#### Servidor (Backend)
```sh
$ cd server
$ npm run dev
```

#### Cliente (Frontend)
```sh
$ cd ../client
$ npm run dev
```

El frontend se ejecutará en `http://localhost:5173` y el backend en `http://localhost:5000`.

## Uso

- Navega a `http://localhost:5173` para ver el carrito de compras.
- Agrega productos al carrito y procede al pago.
- Los pagos se gestionan a través de Stripe.

## Esquema de la Base de Datos (Prisma)

El backend utiliza Prisma para gestionar usuarios y transacciones:

- **User**: Almacena el correo electrónico y el nombre del usuario.
- **Transaction**: Almacena la cantidad del pago, la moneda, el estado y la relación con el usuario.

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  name         String
  transactions Transaction[]
}

model Transaction {
  id       String @id @default(cuid())
  amount   Float
  currency String
  status   String
  userId   String
  user     User   @relation(fields: [userId], references: [id])
}
```

## Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).


