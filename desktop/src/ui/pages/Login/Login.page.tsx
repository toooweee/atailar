import { useNavigate } from 'react-router-dom';
import styles from './Login.page.module.css';
import { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = () => {
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.background}></div>

      <div className={styles.card}>
        <h1 className={styles.title}>Atailar Secret</h1>
        <p className={styles.subtitle}>Секреты в секрете</p>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button} disabled={!email || !password}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
