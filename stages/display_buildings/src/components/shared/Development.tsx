import React from "react";

interface Props {
  children: React.ReactNode;
}

const shouldRender = Boolean(import.meta.env.DEV);

/**
 * Development - компонент для условного рендеринга только в режиме разработки
 *
 * Использование:
 * ```tsx
 * <Development>
 *   <LoggingInfoFooter />
 * </Development>
 * ```
 */
export const Development = shouldRender
  ? ({ children }: Props) => <>{children}</>
  : () => null;
