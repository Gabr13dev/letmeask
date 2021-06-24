import './loading.scss';
import loadingIcon from '../../assets/images/spinner.svg';

type LoadingProps = {
    message?: string;
}

export function Loading(props: LoadingProps){
    return (
        <div id="loading-overlay">
            <div>
                <img src={loadingIcon} alt="Loading Icon" />
                <span>{ props.message ? (props.message) : ('Carregando')}</span>
            </div>
        </div>
    )
}