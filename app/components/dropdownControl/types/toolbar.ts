// types/toolbar.ts
export interface DropdownItem {
    id: number;
    label: string;
    active?: boolean | null; // Nullable active property
}

export interface ToolbarItem {
    id: number;
    name: string;
    active?: boolean;
    dropdowns?: DropdownItem[];
}
