[Gist](https://gist.github.com/kaineer/69ee25e40796051068cbc6f5b918d638)

## Здания

### Получить начальную точку

`GET /buildings/start` -- получить точку из которой будет начато движение

#### Доступ
 * Полный доступ, в т.ч. неприлогиненным пользователям

#### Ответ
```jsonc
{
  "x": -6736606.72045857,
  "z": 7713514.742933013
}
```

### Получить с бэкенда здания вокруг точки

`PUT /buildings` -- _Получить здания вокруг точки с координатами x и z, на расстоянии distance_

#### Доступ
 * Полный доступ, в т.ч. неприлогиненным пользователям

#### Тело запроса
```jsonc
{
  "position": {
    "x": "number",
    "z": "number"
  },
  "distance": "number"
}
```

Судя по описанным ролям, пользователи со свободным доступом к карте должны иметь возможность использовать именно этот запрос.

#### Ответ
```jsonc
[
  // По одному на каждое стандартное здание
  { "id": "234234", "nd": [{"lat": 66.3333, "lng": 65.4444}] },
  // ...
  // Для зданий с указанной моделькой
  { "id": "234235", "model": "model_id", "lat": 67.3333, "lng": 68.4444, "rot": [0, 1.5, 0] }
]
```

#### Ошибки
```yaml
# Универсальная ошибка, если не прилогинились
- code: 401
  object: "authentification"
  message: "Authentication should be made"

# Если по роли не положено получать
- code: 403
  object: "role"
  message: "Access restricted"

# Если запрашиваем северный полюс
- code: 406
  object: "position"
  message: "Unknown terrain"

# Если экскурсия не создана/удалена
- code: 404
  object: "track"
  message: "Specified track is not found"
```

### Получить с бэкенда координаты здания с указанным адресом

`PUT /buildings/address`

#### Доступ

 * User, Creator, Admin

#### Тело запроса
```jsonc
{
  "address": "string" // Что искать
}
```

#### Ответ

```jsonc
{
  "address": "string",
  "nodes": [{ "x": "number", "z": "number" }],
  "height": "number",
  "position": { "x": "number", "z": "number" },
  "modelUrl": "string"
}
```

#### Ошибки
```yaml
# Если здание не найдено
- code: 404
  object: "building"
  message: "Building not found"
```


## Модельки

### Загрузить на сервер модельку для здания

`POST /upload`

#### Доступ
 * Uploader, Creator, Admin

_И где-то в параметрах будет прикрепляться file с моделькой_

```yaml
body:
  file: binary
```

#### Ответ
```jsonc
{
  "model": "model_id"
}
```

Если в ответе не пришел ключ model (или получили не 2xx), значит, загрузить не удалось.

#### Ошибки
```yaml
# Если загрузка не удалась (проблемы с хранилищем, еще что-нибудь)
- code: 413
  object: "upload"
  message: "Could not upload model"

# Если указанное здание не найдено
- code: 404
  object: "building"
  message: "Building not found"

# Если указанная экскурсия не обнаружена
- code: 404
  object: "track"
  message: "Track not found"
```

### Изменить положение модели на карте

`PUT /model/:model_id`

#### Доступ

 * Creator, Admin

```yaml
body:
  position: [x, y, z],
  rotation: [a, b, c]
  scale: number
```

#### Ответ
```jsonc
{
  "id": "model_id",
  "position": ["lat", "y", "lng"], // возможно, lat и lng еще местами поменяются, будем смотреть
  "rotation": ["a", "b", "c"],
  "scale": 1.0 // Ну или что там выставили
}
```

_Т.е. получив ответ, снова переустанавливаем, куда попало здание. Если сохранить новое положение не получилось, это будет заметно._

#### Ошибки

```yaml
- code: 404
  object: "model"
  message: "Model not found"
```

### Получить модель с сервера

`GET /model/:model_id`

#### Доступ

 * Для всех, в т.ч. анонимно

_в ответ должен приходить бинарник модельки. Возможно, это будет по-другому._

## Экскурсии

### Получить список экскурсий

`GET /tracks/`

#### Доступ

 * User, Creator, Admin

#### Ответ
```jsonc
[
  { "id": "track_id", "name": "track_name" }
  // ...
]
```

#### Ошибки

```yaml
- code: 404
  object: "model"
  message: "Model not found"
```


### Получить экскурсию со всеми точками, которые в ней

`GET /tracks/:track_id`

#### Доступ

 * User, Creator, Admin

#### Ответ
```jsonc
[
  { "id": ":point_id", "name": "point_name", "lat": 66.3333, "lng": 55.3333 }
  // ... Для каждой точки точно будет нужно какое-то название, координаты, и какая-нибудь дополнительная информация, которая добавится позже, например, ограничения на поведение в точке (запрет поворота, запрет наклона и т.п.)
]
```

#### Ошибки:

```yaml
- code: 404
  object: "track"
  message: "Track not found"
```

### Создать новую экскурсию

`POST /tracks`

#### Доступ

 * Creator, Admin

```yaml
body:
  name: track_name
```


#### Ответ
```jsonc
{
  "id": "track_id",
  "name": "track_name"
}
```

#### Ошибки:
```yaml
# Если по роли не положено создавать экскурсии
- code: 403
  object: "role"
  message: "Access restricted"
```

### Удалить экскурсию

`DELETE /tracks/:track_id`

#### Доступ

 * Creator, Admin

_При удалении экскурсии модели, привязанные к экскурсии должны быть тоже почищены, по идее._

#### Ошибки:
```yaml
# Если по роли не положено создавать экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"
```


## Точки в экскурсии

### Добавить новую точку в экскурсию

`POST /tracks/:track_id`

#### Доступ

 * Creator, Admin

```yaml
body:
  name: "point_name"
  type: "point_type" # может, не тип, а что-то другое
  description: "long point description",
  position: [x, y, z]
  rotation: [a, b, c]
  targetPosition: [xt, yt, zt]
```

#### Ответ
```jsonc
{
  "id": "point_id"
}
```

#### Ошибки:
```yaml
# Если по роли не положено создавать точки в экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"
```

### Переименовать или изменить настройки точки

`PUT /tracks/:track_id/:point_id`

#### Доступ

 * Creator, Admin

#### Параметры
```yaml
body:
  name: "point_name" # например, мы решили точку переименовать
  type: "point_type" # опять же, поменять ограничения
  description: "long point description",
  position: [x, y, z]
  rotation: [a, b, c]
  targetPosition: [xt, yt, zt]
```

#### Ошибки:
```yaml
# Если по роли не положено создавать точки в экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"

# Если указанная точка уже была удалена, например
- code: 404
  object: "point"
  message: "Point not found"
```

### Удалить точку из экскурсии

`DELETE /tracks/:track_id/:point_id`

#### Доступ

 * Creator, Admin

#### Ошибки:
```yaml
# Если по роли не положено создавать точки в экскурсии
- code: 403
  object: "role"
  message: "Access restricted"

# Если указанная экскурсия уже была удалена, например
- code: 404
  object: "track"
  message: "Traсk not found"

# Если указанная точка уже была удалена, например
- code: 404
  object: "point"
  message: "Point not found"
```

 * Если не найдена экскурсия, шлется сообщение, что не найдена экскурсия
 * Если экскурсия есть, но точки нет, шлется сообщение, что не найдена точка

### Получить точки экскурсий поблизости 

`PUT /tracks/points`

#### Тело запроса

```yaml
body:
  position: 
    x: "number"
    z: "number"
  distance: "number"
```

#### Доступ

 * Полный доступ для всех, пока не стали ограничивать видимость экскурсий
 
### Получить список моделей

 `PUT /models`

#### Доступ

 * Creator, Admin

 #### Описание
 Запрос возвращает список всех доступных моделей с их загруженными метаданными. На данный момент запрос не принимает параметров.

 В будущем планируется добавить параметр `trackId: string`, позволяющий фильтровать модели для конкретной экскурсии. Запрос требует аутентификации пользователя. Так как количество параметров в будущем может расширяться, несмотря на цель получения данных, выбран метод `PUT`.

 #### Параметры
 ```yaml
 body:
   # На данный момент тело запроса пустое или игнорируется.
   # В будущем планируется:
   trackId: "uuid_экскурсии" # Опционально. ID экскурсии, для которой необходимо загрузить список моделей.
 ```

 #### Ответ
 В случае успеха возвращается массив объектов, каждый из которых описывает одну модель.

 ```jsonc
 [
   {
     "id": "uuid_полигона_1",         // ID первого полигона, к которому привязана модель
     "modelId": "uuid_модели_1",      // Уникальный идентификатор модели
     "position": ["x", "y", "z"], // Позиция модели. Значимыми являются X и Z.
     "address": "string | null"       // Адрес, связанный с моделью, или null
   },
   {
     "id": "uuid_полигона_2",
     "modelId": "uuid_модели_2",
     "position": ["x", "y", "z"],
     "address": "string | null"
   }
   // ...
 ]
 ```

 #### Ошибки
 ```yaml
 # Пользователь не аутентифицирован или его роль ниже "User"
 - code: 403
   object: "user"
   message: "User is not authenticated or has insufficient rights"
 ```

### Получить метаданные модели по ее адресу

`PUT /models/address`

#### Доступ

 * User, Creator, Admin

#### Тело запроса
```yaml
body:
  address: string
```

#### Ответ
```jsonc
{
  "model_id": "string",
  "address": "string",
  "position": [ "x", 0, "z" ],
  "rotation": "число (угол в радианах)",
  "scale": "масштаб"
}
```

#### Ошибки:
```yaml
- code: 404
  object: "metadata"
  message: "Model not found"
```

### Сохранить метаданные модели

`PATCH /models/:model_id`

#### Доступ

 * Creator, Admin

#### Тело запроса

```yaml
body:
  position: [x, 0, z]
  rotation: rotationAngle
  scale: number
  polygons: [ polygon1Id, polygon2Id, ...]
  address: string
  description: string
```

### Удалить модель и ее метаданные

`DELETE /models/:model_id`

#### Доступ

 * Creator, Admin

#### Ответ

Может быть пустым, главное получить 200

#### Пользователь должен быть создателем или админом, чтобы иметь возможность удалять

### Получить модель с бэкенда по Id

`GET /model/:model_id`

#### Ошибки
```yaml
- code: 404
  object: "model"
  message: "Model not found"
```

## Предложения моделек

### Добавить метаданные запроса для модели

`POST /model-offers/`

#### Доступ

 * Uploader

#### Тело запроса

```yaml
body:
  address: string
  description: string
  author: string
  modelId: string
```

#### Ошибки
```yaml
- code: 400
  object: "model-offer"
  message: "Model is too large"

- code: 400
  object: "model-offer"
  message: "Wrong model format"

- code: 400
  object: "model-offer"
  message: "Invalid request"
  # Пропущены address, description или modelId
```

### Посмотреть все предложения

`GET /model-offers/`

#### Доступ

 * Uploader (возможно), Creator, Admin

#### Ответ

```yaml
offers:
  - modelId: string
    address: string
    description: string
    author: string
```

### Переместить предложение в общий пулл метаданных

`POST /model-offers/approve`

#### Доступ

 * Creator, Admin

```yaml
body:
  modelId: string
```

#### Ошибки
```yaml
- code: 401
  object: "model-offer"
  message: "Не достаточно прав, чтобы утвердить модель"
```

Замечание: возможно, в базе, кроме копирования записи в таблицу models_metadata нужно будет еще помечать запись в model_offers, как утвержденную (чтобы можно было потом посмотреть на список заявок)
