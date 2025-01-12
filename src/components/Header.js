// ...existing imports...
import { useAuth } from '../contexts/AuthContext'; // Add if not already imported

function Header() {
  const { currentUser } = useAuth();
  
  return (
    <header>
      <div className="user-greeting">
        {currentUser && <h3>Hello, {currentUser.displayName || currentUser.email}</h3>}
      </div>
      // ...existing header content...
    </header>
  );
}

export default Header;
