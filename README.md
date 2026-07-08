# Gestor de Tareas Categorizado

Aplicación To-Do List desarrollada con Ionic 8, Angular 20 y Capacitor.

## Cómo Ejecutar la Aplicación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar servidor de desarrollo local:
   ```bash
   ionic serve
   ```

3. Compilar y sincronizar plataformas nativas (Capacitor):
   ```bash
   npm run build
   
   # Para Android:
   npx cap sync android
   npx cap open android
   
   # Para iOS:
   npx cap sync ios
   npx cap open ios
   ```

## Cambios Realizados

- **Módulo de Categorías**: CRUD completo de categorías con asignación a tareas y barra de filtros horizontal deslizable.
- **Firebase Remote Config**: Integración de feature flag (`show_categories_feature`) para activar/desactivar dinámicamente el módulo de categorías.
- **Panel de Desarrollo**: Interruptor local en pantalla para simular el valor de la bandera de Remote Config sin retrasos de caché.
- **Modo Claro / Oscuro**: Selector de tema manual en el encabezado con guardado de preferencia en `localStorage`.
- **Buscador de Tareas**: Filtro reactivo en tiempo real mediante Angular Signals.
- **Barra de Progreso**: Indicador dinámico de avance de tareas completadas.
- **Feedback Háptico**: Vibración física al agregar, completar o eliminar tareas mediante Capacitor Haptics.
- **Ordenamiento Inteligente**: Tareas pendientes arriba por orden de creación y completadas al fondo con opacidad reducida.
- **Validación de Categoría**: Toast de advertencia que impide crear tareas sin categoría si la función está activa.
- **Optimización de Rendimiento**: Uso de detección `OnPush`, Angular Signals para reactividad y bloque `@for` nativo de Angular en listas.

-  **Esta es la configuracion remota de Firebase, un simple toggle que cambia entre falso y verdadero, y permite mostrar al usuario informacion o ocultar**
<img width="1458" height="835" alt="Captura de pantalla 2026-07-08 a la(s) 3 57 38 p m" src="https://github.com/user-attachments/assets/211aca6f-106c-4db6-86ea-e74657b6ff80" />
<img width="738" height="1600" alt="WhatsApp Image 2026-07-08 at 17 45 53" src="https://github.com/user-attachments/assets/1dd7a4af-d3e2-45d8-b881-7664a651a67c" />
<img width="738" height="1600" alt="WhatsApp Image 2026-07-08 at 17 45 53 (1)" src="https://github.com/user-attachments/assets/2b39d73c-108d-4ace-bbeb-85b234d9a15f" />



