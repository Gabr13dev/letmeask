import { useState } from 'react'
import './modal.scss'

export function Modal(){
    const [isOpen, setIsOpen] = useState(false);

    function openModal(){
        setIsOpen(true);
    }

    function closeModal(){
        setIsOpen(false);
    }

    return(
        <div className="overlay" style={{display: (isOpen ? 'flex' : 'none')}}>
            <div className="modal">

            </div>
        </div>
    )
}