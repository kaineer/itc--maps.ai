/**
 * UILocalStorageDebug - компонент для отладки и управления сохранением UI состояния в localStorage
 *
 * Этот компонент позволяет:
 * - Просматривать текущее состояние UI в localStorage
 * - Очищать сохраненное состояние
 * - Экспортировать/импортировать состояние
 * - Отлаживать работу с localStorage
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSlice } from "../../../store/uiSlice";
import {
  loadUIState,
  saveUIState,
  clearUIState,
  UI_STORAGE_KEY,
  isLocalStorageAvailable,
} from "../../../utils/localStorage";

interface Props {
  enabled?: boolean;
  className?: string;
}

export const UILocalStorageDebug = ({
  enabled = true,
  className = "",
}: Props) => {
  const dispatch = useDispatch();
  const uiState = useSelector((state: any) => state.ui);
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [importData, setImportData] = useState<string>("");
  const [importError, setImportError] = useState<string>("");

  // Проверяем доступность localStorage и загружаем данные
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setIsAvailable(available);

    if (available) {
      try {
        const data = localStorage.getItem(UI_STORAGE_KEY);
        setLocalStorageData(data ? JSON.parse(data) : null);
      } catch (error) {
        console.error("Ошибка загрузки данных из localStorage:", error);
        setLocalStorageData(null);
      }
    }
  }, []);

  // Обновляем данные при изменении состояния UI
  useEffect(() => {
    if (isAvailable) {
      try {
        const data = localStorage.getItem(UI_STORAGE_KEY);
        setLocalStorageData(data ? JSON.parse(data) : null);
      } catch (error) {
        console.error("Ошибка обновления данных из localStorage:", error);
      }
    }
  }, [uiState, isAvailable]);

  if (!enabled) {
    return null;
  }

  const handleClearStorage = () => {
    if (window.confirm("Очистить сохраненное состояние UI из localStorage?")) {
      const cleared = clearUIState();
      if (cleared) {
        setLocalStorageData(null);
        alert("Состояние UI очищено из localStorage");
      } else {
        alert("Не удалось очистить состояние UI");
      }
    }
  };

  const handleExportState = () => {
    try {
      const exportData = {
        uiState,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };
      const jsonString = JSON.stringify(exportData, null, 2);
      navigator.clipboard.writeText(jsonString);
      alert("Состояние UI скопировано в буфер обмена");
    } catch (error) {
      console.error("Ошибка экспорта состояния:", error);
      alert("Не удалось экспортировать состояние");
    }
  };

  const handleImportState = () => {
    try {
      const parsedData = JSON.parse(importData);

      // Проверяем структуру импортируемых данных
      if (!parsedData.uiState || typeof parsedData.uiState !== "object") {
        throw new Error("Некорректная структура данных");
      }

      // Сохраняем в localStorage
      const saved = saveUIState(parsedData.uiState);
      if (saved) {
        // Диспатчим действие для обновления Redux состояния
        // В реальном приложении нужно будет добавить действие для загрузки состояния
        alert("Состояние UI успешно импортировано и сохранено в localStorage");
        setImportData("");
        setImportError("");

        // Перезагружаем страницу для применения нового состояния
        window.location.reload();
      } else {
        throw new Error("Не удалось сохранить в localStorage");
      }
    } catch (error: any) {
      setImportError(error.message || "Ошибка импорта данных");
      console.error("Ошибка импорта состояния:", error);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Сбросить состояние UI к значениям по умолчанию?")) {
      dispatch(uiSlice.actions.resetAllKnown());
      alert("Состояние UI сброшено к значениям по умолчанию");
    }
  };

  const handleReloadFromStorage = () => {
    if (window.confirm("Перезагрузить состояние UI из localStorage?")) {
      window.location.reload();
    }
  };

  const formatKnownModes = (known: Record<string, boolean> | undefined) => {
    if (!known) return "Нет данных";

    return Object.entries(known)
      .map(([mode, value]) => `${mode}: ${value ? "✓" : "✗"}`)
      .join(", ");
  };

  return (
    <div
      className={`ui-local-storage-debug ${className}`}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "16px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        maxWidth: "400px",
        maxHeight: "500px",
        overflow: "auto",
        zIndex: 10000,
        border: "1px solid #444",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          borderBottom: "1px solid #444",
          paddingBottom: "8px",
        }}
      >
        <h3 style={{ margin: 0, color: "#4fc3f7" }}>🔧 UI LocalStorage Debug</h3>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: isAvailable ? "#4caf50" : "#f44336",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {isAvailable ? "Доступен" : "Недоступен"}
        </span>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "8px" }}>
          <strong>Ключ:</strong> {UI_STORAGE_KEY}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Текущий режим UI:</strong> {uiState?.currentMode || "Нет данных"}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Известные режимы:</strong> {formatKnownModes(uiState?.known)}
        </div>
        <div style={{ marginBottom: "8px" }}>
          <strong>Данные в localStorage:</strong>
          <pre
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "8px",
              borderRadius: "4px",
              fontSize: "10px",
              overflow: "auto",
              maxHeight: "100px",
              marginTop: "4px",
            }}
          >
            {localStorageData
              ? JSON.stringify(localStorageData, null, 2)
              : "Нет данных"}
          </pre>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <button
          onClick={handleClearStorage}
          style={{
            padding: "6px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
          }}
          title="Очистить сохраненное состояние UI"
        >
          🗑️ Очистить
        </button>
        <button
          onClick={handleExportState}
          style={{
            padding: "6px 12px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
          }}
          title="Экспортировать текущее состояние UI"
        >
          📋 Экспорт
        </button>
        <button
          onClick={handleResetToDefaults}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
          }}
          title="Сбросить к значениям по умолчанию"
        >
          🔄 Сбросить
        </button>
        <button
          onClick={handleReloadFromStorage}
          style={{
            padding: "6px 12px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
          }}
          title="Перезагрузить из localStorage"
        >
          ♻️ Перезагрузить
        </button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "8px" }}>
          <strong>Импорт состояния:</strong>
        </div>
        <textarea
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder='Вставьте JSON с состоянием UI (формат: {"uiState": {...}})'
          style={{
            width: "100%",
            height: "80px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid #444",
            borderRadius: "4px",
            padding: "8px",
            fontSize: "11px",
            fontFamily: "monospace",
            resize: "vertical",
            marginBottom: "8px",
          }}
        />
        {importError && (
          <div
            style={{
              color: "#f44336",
              fontSize: "11px",
              marginBottom: "8px",
            }}
          >
            ❌ {importError}
          </div>
        )}
        <button
          onClick={handleImportState}
          disabled={!importData.trim()}
          style={{
            padding: "6px 12px",
            backgroundColor: "#9c27b0",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: importData.trim() ? "pointer" : "not-allowed",
            fontSize: "11px",
            opacity: importData.trim() ? 1 : 0.5,
            width: "100%",
          }}
          title="Импортировать состояние UI из JSON"
        >
          📥 Импорт
        </button>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "#888",
          borderTop: "1px solid #444",
          paddingTop: "8px",
        }}
      >
        <div>
          <strong>Информация:</strong>
        </div>
        <div>• Состояние UI автоматически сохраняется в localStorage</div>
        <div>• При первом запуске используется состояние по умолчанию</div>
        <div>• При последующих запусках загружается сохраненное состояние</div>
        <div>• Все изменения UI автоматически сохраняются</div>
      </div>
    </div>
  );
};

export default UILocalStorageDebug;
