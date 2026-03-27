## Предложения моделек

### Добавить метаданные запроса для модели

`POST /model-offers/`

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
