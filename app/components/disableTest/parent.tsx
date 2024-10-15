import React, { useState } from 'react';
import Toolbar from './toolbar';


const ParentComponent = () => {
    // Array of toolbar items with name, title, and disabled state
    const [toolbarItems, setToolbarItems] = useState([
        { name: 'cut', title: 'Cut', icon:'bi-scissors', disabled: false },
        { name: 'copy', title: 'Copy',icon:'bi-copy' ,disabled: false },
        { name: 'paste', title: 'Paste',icon:'bi-paste', disabled: true },
    ]);

    // Function to toggle the disabled state of a specific toolbar item
    const toggleItemDisabled = (name) => {
        const newItems = toolbarItems.map(item =>
            item.name === name ? { ...item, disabled: !item.disabled } : item
        );
        setToolbarItems(newItems);
    };

    return (
        <div>
            <h1>Parent Component</h1>
            <div className='btn-toolbar'>
                {toolbarItems.map(item => (
                    <button key={item.name} className='btn btn-outline-secondary' onClick={() => toggleItemDisabled(item.name)}>
                        Toggle {item.title}
                    </button>
                ))}
            </div>
          
            <Toolbar items={toolbarItems} />
        </div>
    );
};

export default ParentComponent;
