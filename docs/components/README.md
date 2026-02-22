# Stave Components Documentation

Documentación detallada de componentes custom de Stave. Cada componente tiene su propia guía.

## Componentes Documentados

### 📝 [TagInput](./TagInput.md)
Componente robusto para agregar múltiples tags con:
- Sugerencias dinámicas y filtradas
- Creación de tags personalizados
- Navegación completa por teclado (flechas, Enter, Escape)
- Theming dinámico con colores del hub
- Validación multicapa

**Ubicación**: `components/shared/TagInput.tsx`
**Usado en**: `SongHeader` - para agregar tags a canciones

---

## Componentes Próximos a Documentar

- [ ] Select.tsx - Custom select wrapper
- [ ] EditableText.tsx - Inline editing con debounce
- [ ] SongHeader.tsx - Header de página de canción
- [ ] SongTag.tsx - Tag individual con botón de eliminar

---

## Guía Rápida de Lectura

Si necesitas:
- **Entender qué es**: Lee la sección "Descripción General"
- **Usarlo**: Ve a "Props" + "Ejemplo de Uso"
- **Extenderlo**: Sección "Extensibilidad Futura"
- **Debuggear**: Sección "Troubleshooting"
- **Mantenerlo**: Lee "Notas de Mantenimiento"

---

## Convenciones de Documentación

Todos los componentes siguen esta estructura:
1. **Descripción General** - Qué es y para qué sirve
2. **Arquitectura** - Estado, lógica, flujos
3. **Props** - Interface completa con tipos
4. **Comportamiento** - Cómo interactúa el usuario
5. **Validación** - Reglas y restricciones
6. **Performance** - Optimizaciones aplicadas
7. **Patrones** - Decisiones técnicas
8. **Extensibilidad** - Cómo extenderlo
9. **Testing** - Casos a cubrir
10. **Troubleshooting** - Problemas comunes y soluciones

---

## Feedback y Mejoras

Si encuentras:
- ❌ Documentación incompleta o confusa
- ✨ Nuevas características en un componente
- 🐛 Comportamientos no documentados

Actualiza el archivo `.md` correspondiente para mantenerlo en sincronía con el código.
