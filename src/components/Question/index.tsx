import { ReactNode } from 'react';
import cN from 'classnames';
import './questions.scss';

type QuestionProps = {
    id: string;
    content: string;
    author:{
        name: string;
        avatar: string;
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({
    author,
    content,
    isAnswered = false,
    isHighlighted = false,
    ...props
}: QuestionProps){
    return (
        <div className={cN(
                'question', 
                { answered: isAnswered},
                { highlighted: isHighlighted && !isAnswered },
            )} 
            id={props.id}
            >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {props.children}
                </div>
            </footer>
        </div>
    )
}