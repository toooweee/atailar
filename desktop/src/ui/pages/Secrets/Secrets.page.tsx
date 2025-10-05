import React, { useState } from 'react';
import styles from './Secrets.page.module.css';

const SecretsPage = () => {
  const mockSecrets = [
    {
      id: 1,
      project: 'CRM System',
      env: 'PostgreSQL',
      name: 'db_prod_password',
      status: 'approved',
      secretValue: 'postgres://user:supersecretpass@localhost:5432/crm_db',
    },
    {
      id: 2,
      project: 'API Gateway',
      env: 'MySQL',
      name: 'api_key_prod',
      status: 'pending',
      secretValue: 'sk_live_1234567890abcdef',
    },
    {
      id: 3,
      project: 'CRM System',
      env: 'PostgreSQL',
      name: 'db_staging_key',
      status: 'approved',
      secretValue: 'staging-db-key-abc123',
    },
    {
      id: 4,
      project: 'Analytics',
      env: 'Redis',
      name: 'cache_secret',
      status: 'denied',
      secretValue: 'redis://localhost:6379/cache?password=secretcachepass',
    },
    {
      id: 5,
      project: 'API Gateway',
      env: 'MongoDB',
      name: 'mongo_conn_string',
      status: 'approved',
      secretValue: 'mongodb+srv://user:pass@cluster.mongodb.net/prod?retryWrites=true&w=majority',
    },
  ];

  const [projectFilter, setProjectFilter] = useState('');
  const [envFilter, setEnvFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [filteredSecrets, setFilteredSecrets] = useState(mockSecrets);
  const [showNoResults, setShowNoResults] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState(null as any);
  const [masterKey, setMasterKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    const filtered = mockSecrets.filter(
      (secret) =>
        secret.project.toLowerCase().includes(projectFilter.toLowerCase()) &&
        secret.env.toLowerCase().includes(envFilter.toLowerCase()) &&
        secret.name.toLowerCase().includes(nameFilter.toLowerCase()),
    );
    setFilteredSecrets(filtered);
    setShowNoResults(filtered.length === 0);
  };

  const handleReset = () => {
    setProjectFilter('');
    setEnvFilter('');
    setNameFilter('');
    setFilteredSecrets(mockSecrets);
    setShowNoResults(false);
  };

  const handleRequestAccess = () => {
    alert('Заявка на доступ подана! (Mock — интегрируйте с API)');
  };

  const handleViewSecret = (secret: any) => {
    setSelectedSecret(secret);
    setShowModal(true);
    setShowSecret(false);
    setMasterKey('');
    setError('');
  };

  const handleMasterKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterKey) return;

    try {
      const result = await window.electronAPI.validateMasterKey(masterKey);
      if (result.valid) {
        setShowSecret(true);
        setError('');
      } else {
        setError('Неверный мастер-ключ! Установите новый или попробуйте снова.');
        setShowSecret(false);
      }
    } catch (err) {
      setError('Ошибка проверки. Попробуйте позже.');
    }
  };

  const handleCopySecret = () => {
    if (selectedSecret?.secretValue) {
      navigator.clipboard
        .writeText(selectedSecret.secretValue)
        .then(() => {
          alert('Секрет скопирован в буфер обмена!');
          setShowModal(false);
        })
        .catch(() => {
          alert('Ошибка копирования. Скопируйте вручную.');
        });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMasterKey('');
    setError('');
    setShowSecret(false);
  };

  return (
    <div className={styles.secretsContainer}>
      <div className={styles.background}></div>

      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Secrets Vault</h1>
        <p className={styles.pageSubtitle}>Поиск и управление корпоративными секретами</p>
      </div>

      <div className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>🔍 Поиск секретов</h2>
        <div className={styles.searchForm}>
          <input
            type="text"
            placeholder="Проект"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Среда"
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Название секрета"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className={styles.input}
          />
          <div className={styles.searchButtons}>
            <button onClick={handleSearch} className={styles.searchButton}>
              Найти
            </button>
            <button onClick={handleReset} className={styles.resetButton}>
              Сброс
            </button>
          </div>
        </div>
      </div>

      <div className={styles.resultsSection}>
        {showNoResults ? (
          <div className={styles.noResults}>
            <h3 className={styles.noResultsTitle}>Секрет не найден</h3>
            <p className={styles.noResultsText}>
              По вашим критериям ничего не найдено. Подайте заявку на доступ к новому секрету.
            </p>
            <button onClick={handleRequestAccess} className={styles.requestButton}>
              Подать заявку
            </button>
          </div>
        ) : (
          <div className={styles.secretsGrid}>
            <h2 className={styles.sectionTitle}>Результаты ({filteredSecrets.length})</h2>
            {filteredSecrets.map((secret) => (
              <div key={secret.id} className={styles.secretCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.projectTag}>{secret.project}</span>
                  <span className={styles.statusTag} data-status={secret.status}>
                    {secret.status === 'approved'
                      ? '✅ Approved'
                      : secret.status === 'pending'
                        ? '⏳ Pending'
                        : '❌ Denied'}
                  </span>
                </div>
                <h3 className={styles.secretName}>{secret.name}</h3>
                <p className={styles.secretEnv}>
                  Среда: <strong>{secret.env}</strong>
                </p>
                <div className={styles.cardActions}>
                  <button onClick={() => handleViewSecret(secret)} className={styles.viewButton}>
                    Просмотр
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалка для просмотра */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>

            <h2 className={styles.modalTitle}>Доступ к секрету</h2>
            <p className={styles.modalSubtitle}>{selectedSecret?.name}</p>

            {!showSecret && (
              <form onSubmit={handleMasterKeySubmit} className={styles.masterKeyForm}>
                <input
                  type="password"
                  placeholder={selectedSecret?.masterKeySet ? 'Мастер-ключ' : 'Установите мастер-ключ'}
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className={styles.masterKeyInput}
                  autoFocus
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button type="submit" className={styles.submitKeyButton} disabled={!masterKey}>
                  {selectedSecret?.masterKeySet ? 'Разблокировать' : 'Установить ключ'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretsPage;
