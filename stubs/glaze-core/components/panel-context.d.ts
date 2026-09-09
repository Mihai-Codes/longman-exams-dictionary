type PanelContextValue = {
    panelIndex: number;
    isFirstPanel: boolean;
    isLastPanel: boolean;
    orientation: "horizontal" | "vertical";
};
declare const PanelContext: import("react").Context<PanelContextValue | null>;
declare const usePanelContext: () => PanelContextValue | null;
export { PanelContext, usePanelContext };
export type { PanelContextValue };
