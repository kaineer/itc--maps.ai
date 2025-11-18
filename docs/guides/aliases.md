# Git Aliases and Commands

## git-commit (ai-assist command)

A command for ai-assist that automatically analyzes git changes and generates meaningful commit messages in English.

#### `git-commit`
Автоматизирует процесс коммита изменений:

- Делает обзор измененных файлов
- Формирует короткое и расширенное описание для commit message (на английском языке)
- Добавляет все измененные файлы в индекс (`git add .`)
- Выполняет коммит с предварительно сформированным информативным сообщением на английском языке

## git-push (ai-assist command)

A command for ai-assist that combines git-commit and git push operations.

#### `git-push`
Автоматизирует процесс отправки изменений в удаленный репизиторий:

- Проверяет наличие изменений в рабочем дереве
- Если есть изменения, выполняет команду `git-commit` для их коммита
- Проверяет наличие коммитов для отправки в origin master
- Если есть что отправить, выполняет `git push origin master`
- Предоставляет понятный отчет о выполненных действиях

## run-stage (ai-assist command)

A command for ai-assist that manages the project build pipeline with dependency tracking.

#### `run-stage`
Автоматизирует процесс сборки проекта с отслеживанием зависимостей:

- `run-stage import` или `run-stage maps` - импорт данных карт с Overpass API
- `run-stage buildings` - парсинг зданий из map_data.xml
- `run-stage backend` или `run-stage server` - сборка Fastify приложения
- `run-stage all` - полный пайплайн сборки
- Использует хэши для определения изменений в зависимостях
- Выполняет только необходимые стадии (инкрементальные сборки)
- Расположение скрипта: `scripts/commands/run-stage.py`

### Использование в ai-assist консоли
```bash
python3 scripts/commands/run-stage.py import
python3 scripts/commands/run-stage.py buildings
python3 scripts/commands/run-stage.py all
```
