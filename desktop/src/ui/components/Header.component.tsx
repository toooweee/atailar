import styles from './Header.component.module.css';
import { Link, NavLink } from 'react-router-dom';

interface HeaderComponentProps {
  onLogout: () => void;
}

const HeaderComponent = ({ onLogout }: HeaderComponentProps) => {
  return (
    <header className={styles.header}>
      <Link to={'/'} className={styles.logo}>
        Atailar
      </Link>

      <ul className={styles.headerNavList}>
        <li className={styles.headerNavItem}>
          <NavLink
            to="/secrets"
            className={({ isActive }) => `${styles.headerNavLink} ${isActive ? styles.active : ''}`}
          >
            Секреты
          </NavLink>
        </li>
        <li className={styles.headerNavItem}>
          <NavLink
            to="/techniques"
            className={({ isActive }) => `${styles.headerNavLink} ${isActive ? styles.active : ''}`}
          >
            Аккаунт
          </NavLink>
        </li>
      </ul>

      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton} onClick={onLogout}>
          Выйти
        </button>
      </div>
    </header>
  );
};

export default HeaderComponent;
