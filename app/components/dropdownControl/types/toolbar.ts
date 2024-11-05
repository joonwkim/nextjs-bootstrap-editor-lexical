
// types/btn-toolbar.ts
export interface DropdownItem {
    id: number;
    label: string;
    active?: boolean | null; // Nullable active property
}

export interface ToolbarItem {
    id: number;
    name: string;
    active?: boolean;
    isDropdown?: boolean;
    dropdowns?: DropdownItem[];
}

const testDropdown: DropdownItem[] = [
    { id: 11, label: 'first', active: false },
    { id: 12, label: '2nd', active: false },
    { id: 13, label: '3rd', active: false },
    { id: 14, label: '4th', active: false },

]

export const toolbarItems: ToolbarItem[] = [
    { id: 1, name: 'button1', active: false, },
    { id: 2, name: 'button2', active: false, isDropdown: true, dropdowns: testDropdown },
    { id: 3, name: 'button3', active: false, },
];
