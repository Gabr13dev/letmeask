import './UserCard.scss';

type UserCardProps = {
    user: any;
    logout: () => Promise<void>;
}

export function UserCard(prop: UserCardProps){
    if(prop.user === undefined){
        return (
            <></>
        )
    }else{
        return (
            <section id="userCard">
                <div>
                    <img src={prop.user.avatar} alt={prop.user.name} width="85" /> 
                </div>
                <div>
                    <h4>{prop.user.name}</h4>
                    <span onClick={prop.logout}></span>
                </div>
            </section>
        )
    }
}