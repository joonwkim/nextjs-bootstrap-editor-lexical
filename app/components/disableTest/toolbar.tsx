import React from 'react';
import './styles.css'

const Toolbar = ({ items }) => {
    return (
        <div>
            <h2 className='my-3'>Toolbar Buttons</h2>
            <div className='btn-toolbar'>               
                {items.map(item => (
                    <button key={item.name} className='btn btn-outline-secondary border-0' title={item.title} disabled={item.disabled}>
                        {item.title}
                    </button>
                ))}
            </div>
        </div>       
    );
};

export default Toolbar;
