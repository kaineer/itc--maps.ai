# Отдаем здания через API для последующего использования в фронтенд части

Необходимо реализовать в папке stages/serve_buildings приложение с использованием nodejs, fastify (часть значений копируются в package.json из stages/serve_buildings/package_defaults.json), которое будет получать данные из stages/import/buildings.json и stages/import/itc.json и отрабатывать следующие запросы:

## `GET /start`

### Тело ответа

```yaml
# Позиция из файла itc.json/center.
x: number
z: number
```

## `PUT /buildings`

### Тело запроса
```yaml
position: # позиция, в которой мы хотим получить данные
  x: number
  z: number
distance: number # расстояние от центра до самого удаленного здания. Если хотя бы один угол находится ближе к центру чем указанное значение, здание высылается
```

### Тело ответа

```yaml
buildings:
  - address: "Чкалова, 3"
    nodes:
      - [333, 999] # Координаты первой точки
      - [334, 998] # Координаты второй точки
      # ...
```
