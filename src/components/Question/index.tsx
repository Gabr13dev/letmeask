import { ReactNode } from 'react';
import './questions.scss';

type QuestionProps = {
    id: string;
    content: string;
    author:{
        name: string;
        avatar: string;
    }
    children?: ReactNode;
}

export function Question({
    author,
    content,
    ...props
}: QuestionProps){
    return (
        <div className="question" id={props.id}>
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