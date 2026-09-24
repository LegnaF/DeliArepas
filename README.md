# Guía de Desarrollo y Despliegue — Deliarepas JD

Este documento contiene las instrucciones necesarias para ejecutar la aplicación en entorno local.

# Requisitos Previos

Antes de comenzar, asegúrate de contar con los siguientes componentes:

Node.js: v18.x o superior.

Gestor de paquetes: npm, yarn o pnpm.

Servidor MySQL Local:

Laragon o XAMPP (Recomendado).

Desarrollo Local

1. Clonar el repositorio e instalar dependencias

git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
npm install


2. Iniciar el servicio de Base de Datos

Si usas Laragon: Abre Laragon y haz clic en Start All (asegúrate de que el módulo MySQL esté iniciado).

Si usas XAMPP: Abre el XAMPP Control Panel e inicia el módulo MySQL.

3. Configurar Variables de Entorno Local

Crea un archivo .env en la raíz del proyecto basándote en la configuración de Laragon/XAMPP (por defecto, el usuario root no tiene contraseña):

# Conexión a MySQL en Laragon / XAMPP
DATABASE_URL="mysql://root:@localhost:3306/nombre_tu_base_datos"

# Entorno de desarrollo
NODE_ENV="development"


Nota: Si le asignaste una contraseña al usuario root de MySQL, la sintaxis es: mysql://root:TU_CONTRASEÑA@localhost:3306/nombre_tu_base_datos.

4. Configurar la Base de Datos con Prisma

Ejecuta las migraciones locales y genera el cliente de Prisma:

# Sincronizar el esquema con tu base de datos local MySQL
npx prisma migrate dev

# Generar/Actualizar los tipos del cliente de Prisma
npx prisma generate


5. Iniciar la aplicación en modo desarrollo

Para levantar el servidor local de Next.js:

npm run dev


La aplicación estará disponible en http://localhost:3000.

6. Visualizar y Administrar los datos (Prisma Studio)

Para abrir la interfaz visual de la base de datos MySQL:

npx prisma studio


Se abrirá automáticamente un panel interactivo en http://localhost:5555.

Comandos Frecuentes

npm run dev: Inicia la aplicación en entorno local.

npx prisma studio: Abre la consola gráfica para ver y editar registros de la base de datos.

npx prisma migrate dev: Crea y aplica una nueva migración local tras cambios en schema.prisma.

npm run build: Genera la versión lista para producción.
