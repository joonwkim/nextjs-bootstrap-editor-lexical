export const LOW_PRIORIRTY = 1;
export const HEADINGS =['H1',]

export enum RichTextAction {
    Undo = "undo",
    Redo = "redo",
    Bold = "bold",
    Italics = "italics",
    Underline = "underline",
    Strikethrough = "strikethrough",
    Superscript = "superscript",
    Subscript = "subscript",
    Highlight = "highlight",
    Code = "code",
    LeftAlign = "leftAlign",
    CenterAlign = "centerAlign",
    RightAlign = "rightAlign",
    JustifyAlign = "justifyAlign",
    Divider = "divider",  
    Paragraph = 'paragraph',
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    Bullet = 'bullet',
    Number = 'number',
    Check = 'check',
    Quote = 'quote',
    HR = 'hr',
    Image = 'image',
    InlineImage = 'inline-image',
    Column = 'column',
    YTVideo = 'ytVideo',
    Test = 'test',
    BlockFormatItems = 'blockFormatItems'
}

export function getRichTextAction(action: string): RichTextAction | undefined {
    if (Object.values(RichTextAction).includes(action as RichTextAction)) {
        return action as RichTextAction;
    }
    return undefined; // or handle invalid values
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const actionName: { [key in RichTextAction]: string } = Object.keys(RichTextAction).reduce((acc, key) => {
    const value = RichTextAction[key as keyof typeof RichTextAction];
    acc[value] = capitalize(value); // Capitalize the enum value
    return acc;
}, {} as { [key in RichTextAction]: string });

export interface DropdownItem {
    id?: RichTextAction,
    name?: string;
    icon?: string; 
    active?: boolean;
    disabled?: boolean;
    isModal?: boolean,
    databstarget?: string,
    databstoggle?: string,
    // reset?: boolean;
}
export interface ToolbarItem extends DropdownItem {
    // id?: RichTextAction,
    title?: string;
    // active?:boolean,
    isDropdown?: boolean;
    isDevider?: boolean,
    dropdownItems?: DropdownItem[],
    updateSelectionChange?: boolean,    
    resetDropdown?: boolean,
    isModal?: boolean,
    databstarget?: string,
    databstoggle?: string,
}

export const blockFormatItems: DropdownItem[] = [
    { name: '문장', icon: 'bi-text-paragraph', active: true ,id:RichTextAction.Paragraph},
    { name: '대제목', icon: 'bi-type-h1', active: false, id: RichTextAction.H1 },
    { name: '중제목', icon: 'bi-type-h2', active: false, id: RichTextAction.H2 },
    { name: '소제목', icon: 'bi-type-h3', active: false, id: RichTextAction.H3 },
    { name: '글머리 기호', icon: 'bi-list-ul', active: false, id: RichTextAction.Bullet },
    { name: '글머리 번호', icon: 'bi-list-ol', active: false, id: RichTextAction.Number },
    { name: '글머리 체크', icon: 'bi-check-square', active: false, id: RichTextAction.Check },
    { name: '인용 기호', icon: 'bi-chat-square-quote', active: false, id: RichTextAction.Quote },
];
export const alignFormatItems: DropdownItem[] = [
    { name: '왼쪽 맞춤', icon: 'bi-text-left', active: true, id: RichTextAction.LeftAlign },
    { name: '가운데 맞춤', icon: 'bi-text-center', active: false, id: RichTextAction.CenterAlign },
    { name: '오른쪽 맞춤', icon: 'bi-text-right', active: false, id: RichTextAction.RightAlign },
    { name: '양쪽 맞춤', icon: 'bi-justify', active: false, id: RichTextAction.JustifyAlign },
    { name: '시작', icon: 'bi-text-left', active: false, id: RichTextAction.LeftAlign },
    { name: '마침', icon: 'bi-text-right', active: false, id: RichTextAction.RightAlign },
    { name: '내어쓰기', icon: 'bi-text-indent-right', active: false },
    { name: '들여쓰기', icon: 'bi-text-indent-left', active: false },
];
export const insertItems: DropdownItem[] = [
    { name: '수평선', icon: 'bi-hr', active: false, id: RichTextAction.HR },
    { name: '이미지', icon: 'bi-file-image', active: false, isModal: true, databstarget: '#insertImageModal', databstoggle: 'modal', id: RichTextAction.Image },
    { name: '인라인 이미지', icon: 'bi-file-image', active: false, id: RichTextAction.InlineImage },
    { name: '컬럼 레이아웃', icon: 'bi-layout-three-columns', active: false, id: RichTextAction.Column },
    { name: '유튜비디오', icon: 'bi-youtube', active: false, id: RichTextAction.YTVideo },
];

export const toolbarData: ToolbarItem[] = [
    { isDevider: true, id: RichTextAction.Divider },
    { name: '취소', icon: 'bi-arrow-counterclockwise', isDropdown: false, disabled: true, title: '취소', id: RichTextAction.Undo },
    { name: '다시실행', icon: 'bi-arrow-clockwise', isDropdown: false, disabled: true, title: '다시실행', id: RichTextAction.Redo },
    { isDevider: true, id: RichTextAction.Divider },
    { name: '문장 형태', isDropdown: true, title: '문장 형태', dropdownItems: blockFormatItems, updateSelectionChange: true, id: RichTextAction.BlockFormatItems, resetDropdown: false},
    { isDevider: true, id: RichTextAction.Divider },
    { name: '굵게', icon: 'bi-type-bold', isDropdown: false, title: '굵게', id: RichTextAction.Bold },
    { name: '기울임꼴', icon: 'bi-type-italic', isDropdown: false, title: '기울임꼴', id: RichTextAction.Italics },
    { name: '밑줄', icon: 'bi-type-underline', isDropdown: false, title: '밑줄', id: RichTextAction.Underline },
    { name: '취소줄', icon: 'bi-type-strikethrough', isDropdown: false, title: '취소줄', id: RichTextAction.Strikethrough },
    { isDevider: true, id: RichTextAction.Divider },
    { name: '삽입', isDropdown: true, title: '삽입', dropdownItems: insertItems },
    { isDevider: true, id: RichTextAction.Divider },
    { name: '정렬', isDropdown: true, title: '정렬', dropdownItems: alignFormatItems, updateSelectionChange: true },
    { isDevider: true, id: RichTextAction.Divider },
    { name: 'Modal', isModal: true, icon: 'bi-file-image', title: 'Modal', databstarget: '#insertImageModal', databstoggle: 'modal', id: RichTextAction.Test },
]


