# Feature-Sliced Design (FSD) Guide — display_buildings

## Import rule (top → bottom only)

```
app → pages → widgets → features → entities → shared
```

Forbidden:

- `shared` → entities / features / store
- `entities` → features / widgets / pages
- `features` → widgets / pages

## Layer responsibilities

| Layer | Contents |
|-------|----------|
| `entities/*` | Business entity: types, RTK API, entity slice, selectors, thin hooks |
| `features/*` | User scenario: actions/thunks + scenario UI |
| `widgets/*` | Page-level UI composition (sidebar, minimap, scene chrome) |
| `pages/*` | Thin route composition of widgets + features |
| `shared/*` | UI kit, canvas primitives, libs without domain/store knowledge |
| `app/*` | Providers, router, store assembly |

## Public API

Each slice exports only through `index.ts`:

```ts
import { useBuildingsApi } from "@entities/buildings";
```

Do not import internal paths (`model/*.ts`, `lib/*.ts`) from outside the slice.

## Domains

| Domain | Layer target |
|--------|----------------|
| buildings | `entities/buildings` |
| models / model upload | `entities/models` |
| model-offers | `entities/model-offers` + `features/submit-model-offer` |
| tracks | `entities/tracks` + `features/manage-tracks` |
| users / session | `entities/users`, `entities/session` |
| minimap | `entities/minimap` |
| alignment workflow | `features/align-model` |
| view exploration | `features/explore-view` |
| attach track point | `features/attach-track-point` |
| control hints | `features/control-hints` |
| app chrome (UI mode, sidebar) | `features/app-chrome` |

## Migration notes

- Alias `@slices` is a temporary bridge; remove after slices move behind public APIs.
- One slice / feature / legacy leftover per commit.
- Do not change behavior when moving files — only imports and location.
