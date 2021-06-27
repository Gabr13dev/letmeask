import { useAuth } from "../../hooks/useAuth";

export function UserHeader() {
  const { user, signInWithGoogle, signOut } = useAuth();
  return (
    <>
      {user ? (
        <div className="profile">
          <img src={user?.avatar} alt={user?.name} />
          <div>
            <span>{user?.name}</span>
            <a onClick={signOut}>
                Sair
            </a>
          </div>
        </div>
      ) : (
        <a onClick={signInWithGoogle}>Faça login</a>
      )}
    </>
  );
}
