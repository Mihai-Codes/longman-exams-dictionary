import { useEffect, useState } from "react";

export const COMPACT_LAYOUT_MAX_WIDTH = 640;

export function isCompactLayout(width: number): boolean {
  return Number.isFinite(width) && width > 0 && width <= COMPACT_LAYOUT_MAX_WIDTH;
}

export function useCompactLayout(): boolean {
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined" && isCompactLayout(window.innerWidth),
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${COMPACT_LAYOUT_MAX_WIDTH}px)`);
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return compact;
}

export function useCompactPane(initialDetailVisible = false) {
  const compact = useCompactLayout();
  const [detailVisible, setDetailVisible] = useState(initialDetailVisible);

  return {
    compact,
    detailVisible,
    showList: () => setDetailVisible(false),
    showDetail: () => setDetailVisible(true),
    className: compact ? (detailVisible ? "led-compact-detail" : "led-compact-list") : "",
  };
}
