import { useState } from 'react';
import PasswordChangeModal from './PasswordChangeModal.tsx';

interface UserPasswordChangeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<boolean>;
  loading?: boolean;
  error?: string;
}

const UserPasswordChangeModal: React.FC<UserPasswordChangeModalProps> = ({
                                                                           open,
                                                                           onClose,
                                                                           onSubmit,
                                                                           loading = false,
                                                                           error,
                                                                         }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (newPassword !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 8) {
      setFormError('Пароль должен содержать минимум 8 символов');
      return;
    }
    const success = await onSubmit(newPassword);
    if (success) {
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }
  };

  return (
    <PasswordChangeModal
      open={open}
      userId="" // Заглушка, не используется
      onSubmit={(_, newPassword) => onSubmit(newPassword)} // Адаптируем для без userId
      loading={loading}
      error={error}
    >
    </PasswordChangeModal>
  );
};

export default UserPasswordChangeModal;
