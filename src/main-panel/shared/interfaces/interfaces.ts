import { ViewContainerRef } from "@angular/core";
import { DataDisplay } from "../enums/data-display";
import { UIComponent } from "../enums/uicomponent";

export interface ComponentContext {
    uiComponent: UIComponent;
    dataDisplay: DataDisplay;
    categoryLocator: any;
    sortedByAsc: any[];
    viewContainer?: ViewContainerRef;
}

export interface ComponentConfig {
    showInModal?: boolean;
    showInRightPanel?: boolean;
    containerClass?: string;
    headerTitle?: string;
    headerSubtitle?: string;
}

export type ThemeMode = 'light' | 'dark' | 'custom';

export interface CustomTheme {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
}

export interface ThemeConfig {
    mode: ThemeMode;
    customTheme?: CustomTheme;
    autoDetectSystem?: boolean;
}