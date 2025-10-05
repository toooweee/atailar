import styles from './Main.page.module.css';

const MainPage = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.background}></div>

      <div className={styles.card}>
        <h1 className={styles.title}>Atailar Secret</h1>
        <p className={styles.subtitle}>
          Безопасная система для управления корпоративными секретами. Сотрудники запрашивают доступ к паролям БД,
          API-ключам и другим конфиденциальным данным через веб-портал, получают их после согласования и используют
          локальный клиент для безопасной работы.
        </p>

        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Ключевые фичи</h2>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.icon}>🔒</span>
              <span>Локальный кошелек секретов</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.icon}>🌐</span>
              <span>Веб-портал для заявок</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.icon}>✅</span>
              <span>Система согласований</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.icon}>☁️</span>
              <span>Централизованное хранение (OpenBao)</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.icon}>🔐</span>
              <span>Безопасная передача данных</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.icon}>📊</span>
              <span>Аудит всех операций</span>
            </li>
          </ul>
        </div>

        <button className={styles.actionButton}>Запросить доступ к секретам</button>

        <p className={styles.footer}>Powered by Atailar • Secure by design</p>
      </div>
    </div>
  );
};

export default MainPage;
