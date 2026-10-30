# client-arqweb

Cliente web con Vue 3 y Vite para la gestión de tareas con roles. **Este repositorio solo consume la API** del servidor (otro repositorio); no implementa endpoints ni lógica de servidor.

## Estructura del proyecto

```text
src/
  app/router/          # rutas y protección (sesión y roles)
  layouts/             # diseños de autenticación y aplicación
  shared/api/          # cliente HTTP hacia /api
  shared/auth/         # permisos de interfaz por rol
  features/
    auth/              # inicio de sesión, api.ts + api.mock.ts
    tasks/             # tareas
    members/           # miembros del equipo
```

Cada módulo (`feature`) expone funciones en `api.ts` que llaman al servidor. Con `VITE_USE_MOCK_API=true` se usan datos simulados en `api.mock.ts` para desarrollar sin el otro repositorio.

## Puesta en marcha

```sh
npm install --legacy-peer-deps
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://127.0.0.1:5173/`).

### Modo demostración (datos simulados)

En `.env.development`:

- `VITE_USE_MOCK_API=true`

Usuarios de prueba:

| Correo | Contraseña | Rol |
| --- | --- | --- |
| admin@demo.com | demo123 | Administrador |
| member@demo.com | demo123 | Miembro |

El rol **miembro** solo ve y gestiona sus propias tareas (las que creó o tiene asignadas). El **administrador** ve y gestiona todas las tareas, y es el único que accede a la sección de miembros.

## Conectar la API real

1. En `.env.development` (o `.env.production`): `VITE_USE_MOCK_API=false`
2. Ajustar `VITE_API_BASE_URL` (por defecto `/api`, mismo origen en el servidor compartido)
3. En desarrollo, Vite reenvía `/api` hacia `VITE_API_PROXY_TARGET` (ver `vite.config.ts`)
4. Adaptar rutas y tipos en `features/*/api.ts` al contrato del servidor

El cliente envía la cabecera `Authorization: Bearer <token>` cuando hay sesión activa (ver `shared/api/client.ts`).

## Scripts disponibles

```sh
npm run dev      # servidor de desarrollo
npm run build    # compilación para producción
npm run preview  # vista previa del build
```

## Requisitos

Node.js según `package.json` (recomendado ^22.18 o >=24.12). En entornos con Node 20 puede ser necesario `npm install --legacy-peer-deps`.
