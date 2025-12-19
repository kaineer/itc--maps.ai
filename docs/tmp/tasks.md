# Model Alignment Tool Implementation Plan

## Phase 8: Model Alignment System Refactoring (Current Phase)
**Цель**: Полная интеграция системы выравнивания с кэшем моделей и API управления моделями

### Задача A1: Переделать AlignmentUI и нижележащие компоненты на предмет получения модели из modelCache
**Описание**: Интеграция кэша моделей во все компоненты выравнивания для оптимизации загрузки и устранения дублирования кода
- **Подзадачи**:
  1. Обновить `AlignmentUI.tsx` для использования `modelsCache.getModel()`
  2. Переделать компоненты выравнивания (`AlignmentStage`, `AlignedModel`) на работу с кэшем
  3. Устранить дублирование кода загрузки FBX моделей
  4. Оптимизировать перерисовку компонентов при загрузке моделей
- **Критерии успеха**:
  - Все компоненты выравнивания используют единый кэш моделей
  - Устранено дублирование кода загрузки FBX
  - Улучшена производительность загрузки моделей

### Задача A2: Добавить переход в режим выравнивания при нажатии кнопки "Начать выравнивание"
**Описание**: Реализация полноценного переключения между режимами просмотра и выравнивания
- **Подзадачи**:
  1. Реализовать переключение режимов в Redux store (добавить флаг `isAlignmentMode`)
  2. Обновить `StartAlignmentButton` для активации режима выравнивания
  3. Настроить камеры для режима выравнивания (позиционирование, управление)
  4. Инициализировать трансформации модели при старте выравнивания через `prepareInitialTransform`
  5. Обновить UI для отображения только релевантных элементов в режиме выравнивания
- **Критерии успеха**:
  - Плавный переход между режимами просмотра и выравнивания
  - Автоматическая настройка камер для выравнивания
  - Корректная инициализация трансформаций модели

### Задача A3: Поправить интерфейс добавления модели/полигонов в выравнивание
**Описание**: Улучшение UI/UX процесса выбора моделей и полигонов для выравнивания
- **Подзадачи**:
  1. Улучшить `BuildingSelection` компонент для более интуитивного выбора полигонов
  2. Добавить визуальную обратную связь при выборе полигонов (подсветка, анимация)
  3. Создать компонент выбора модели из списка доступных моделей
  4. Упростить процесс добавления/удаления элементов из выравнивания
  5. Добавить валидацию выбора (минимальное количество полигонов, совместимость модели)
- **Критерии успеха**:
  - Интуитивный интерфейс выбора моделей и полигонов
  - Ясная визуальная обратная связь
  - Упрощенный рабочий процесс добавления элементов

### Задача A4: ОБЯЗАТЕЛЬНО добавить API и вызовы API для создания объекта модели в таблице моделей
**Описание**: Создание полноценной системы управления моделями через API с возможностью просмотра непривязанных моделей
- **Подзадачи**:
  1. **Backend API**:
     - Создать таблицу моделей в базе данных (если используется) или файловую структуру
     - Реализовать CRUD endpoints:
       - `GET /models` - список всех моделей
       - `GET /models/:id` - получение конкретной модели
       - `POST /models` - создание новой записи модели
       - `PUT /models/:id` - обновление модели
       - `DELETE /models/:id` - удаление модели
     - Добавить endpoints для метаданных моделей
   
  2. **Frontend Integration**:
     - Создать Redux slice для управления моделями (`modelsSlice.ts`)
     - Реализовать thunks для API вызовов
     - Создать UI компоненты для работы с таблицей моделей
     - Добавить страницу/компонент для просмотра непривязанных моделей
   
  3. **Database Schema** (пример):
     ```sql
     CREATE TABLE models (
       id UUID PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       file_path VARCHAR(500) NOT NULL,
       file_format VARCHAR(10) NOT NULL,
       vertex_count INTEGER,
       bounding_box JSONB,
       created_at TIMESTAMP DEFAULT NOW(),
       updated_at TIMESTAMP DEFAULT NOW(),
       is_linked BOOLEAN DEFAULT FALSE,
       linked_building_id UUID REFERENCES buildings(id)
     );
     ```
   
  4. **UI Components**:
     - `ModelsTable` - таблица со списком моделей
     - `ModelDetails` - детальная информация о модели
     - `ModelUploadForm` - форма загрузки новой модели
     - `UnlinkedModelsView` - просмотр непривязанных моделей
- **Критерии успеха**:
  - Полноценная RESTful API для управления моделями
  - Frontend интеграция с Redux и UI компонентами
  - Возможность просмотра и управления непривязанными моделями
  - Синхронизация состояния между загруженными моделями и таблицей моделей

### Технические требования Phase 8
- **Сроки**: Высокий приоритет, особенно задача A4
- **Зависимости**: Задачи A1-A3 могут выполняться параллельно, A4 требует завершения backend части
- **Тестирование**: Unit тесты для API, интеграционные тесты для frontend-backend взаимодействия
- **Документация**: Обновить API документацию и инструкции по использованию системы управления моделями

## Overview
Create a system for aligning 3D models with their corresponding building polygons, allowing precise positioning and scaling adjustments with visual feedback. Current focus: Phase 8 - Model Alignment System Refactoring.

## Current Status (Phase 8 IN PROGRESS)
- ✅ **Model Cache System**: Implemented `modelsCache.ts` for optimized FBX loading
- ✅ **Start Alignment Button**: Created `StartAlignmentButton` component with CSS
- ✅ **Alignment Slice Refactoring**: Updated with `prepareInitialTransform` thunk
- ✅ **Model Upload Enhancement**: Added async model loading with FBXLoader
- ✅ **Backend Utilities**: Enhanced with binary download support
- 🚧 **Phase 8 Tasks**: Integration with model cache and API development in progress

## Implementation Phases

### Phase 1: Transparent Polygon Buildings
**Create base and specialized polygon building components**

1. **Task P1**: ✅ Create `BasePolygonBuilding` component
   - Extract common logic from current `PolygonBuilding`
   - Accept `opacity` as prop for material transparency

2. **Task P2**: ✅ Create `TransparentPolygonBuilding` component
   - Extends `BasePolygonBuilding` with `opacity: 0.5`
   - Used during model alignment for visual reference

3. **Task P3**: ✅ Create `SolidPolygonBuilding` component  
   - Extends `BasePolygonBuilding` with `opacity: 1.0`
   - Used for normal building display

### Phase 1.5: Stage Components
**Create main scene components for different display modes**

4. **Task S1**: ✅ Create `ViewStage` component
   - Main component for normal viewing mode
   - Displays solid polygons and models
   - Located in `stage/ui/ViewStage.tsx`

5. **Task S2**: ✅ Create `AlignmentStage` component
   - Main component for model alignment mode
   - Displays transparent polygons and aligned models
   - Located in `stage/ui/AlignmentStage.tsx`

### Phase 2: Backend Alignment API
**Add API endpoints for storing model alignment data**

6. **Task B1**: Define `ModelAlignment` type in TypeScript
   - Add to `types/types.ts`
   - Include `modelId`, `position`, `scale`, `rotation` properties

7. **Task B2**: Add PUT endpoint `/building/:buildingId/alignment`
   - Create in `stages/serve_buildings/index.js`
   - Store alignment data in memory or file-based storage
   - Return current alignment settings

8. **Task B3**: Add GET endpoint `/building/:buildingId/alignment`
   - Retrieve stored alignment data
   - Return default values if no alignment exists

### Phase 3: Aligned Model Component
**Create interactive model component with alignment controls**

9. **Task M1**: Create `AlignedModel` component
   - Extends current model loading functionality
   - Applies stored alignment transformations
   - Handles interactive positioning (drag & drop or input controls)

10. **Task M2**: Add real-time transformation updates
    - Update model position/scale when controls change
    - Visual feedback during transformations
    - Optional snapping to grid for precise alignment

### Phase 4: Alignment Controls Interface
**Build the control panel for model adjustments**

11. **Task C1**: Create `AlignmentControls` component
    - Numeric inputs for X/Z position adjustment
    - Scale slider with precision controls
    - Rotation controls (if needed)
    - Save/Reset functionality

12. **Task C2**: Implement model selection
    - Dropdown to select which model to align
    - Visual highlighting of selected model
    - Load corresponding polygon for reference

### Phase 5: Model Alignment Tool
**Integrate all components into a cohesive tool**

13. **Task T1**: Create `ModelAlignmentTool` component
    - Main container for alignment mode
    - Toggle between normal and alignment modes
    - Coordinate display of transparent polygons and aligned models

14. **Task T2**: Add visual helpers
    - Coordinate grid overlay
    - Bounding box visualization for both model and polygon
    - Distance measurements between corresponding points

### Phase 6: Integration and Testing
**Ensure the system works end-to-end**

15. **Task I1**: Integrate alignment tool into main application
    - Add mode switching mechanism
    - Persist alignment data between sessions
    - Handle multiple models and buildings

16. **Task I2**: Comprehensive testing
    - Test alignment precision and accuracy
    - Verify data persistence
    - Performance testing with multiple models

## Technical Considerations

### Data Flow
- Alignment changes → API call → State update → Visual refresh
- Real-time preview with debounced save operations

### User Experience
- Intuitive controls for non-technical users
- Visual feedback for all interactions
- Undo/redo capabilities for alignment adjustments

### Performance
- Efficient re-rendering during transformations
- Optimized polygon rendering with transparency
- Lazy loading of alignment data

## Success Criteria
- Models can be precisely aligned with their corresponding polygons
- Alignment data persists between sessions
- Users can easily switch between normal and alignment modes
- System handles multiple buildings and models efficiently
- Visual feedback clearly shows alignment progress

## Future Enhancements
- Batch alignment for multiple models
- Import/export of alignment presets
- Automated alignment suggestions based on polygon matching
- Advanced transformation controls (rotation, skew)