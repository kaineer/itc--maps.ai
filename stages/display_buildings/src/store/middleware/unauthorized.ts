import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";

export const rtkQueryErrorHandler: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // Проверяем, является ли действие отклонённым (например, запрос с ошибкой)
    if (isRejectedWithValue(action)) {
      // Проверяем, есть ли статус 401 в ошибке
      if (action.payload?.status === 401 || action.error?.status === 401) {
        // Диспатчим действие для выхода пользователя или перенаправления
        // api.dispatch({ type: "ui/selectLoginMode" });
        // Или напрямую перенаправляем (зависит от вашего роутера)
        //
        // 1. При сбросе логина нет нужды переходить в login
        // 2. TODO: если этого не будет происходить, нужно сбрасывать accessToken
        //
        // window.location.href = "/login";
        dispatch({ type: "authentication/logout" });
      }
    }
    return next(action);
  };
