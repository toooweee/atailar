import { Outlet } from 'react-router-dom';
import HeaderComponent from '../components/Header.component.tsx';

interface LayoutPageProps {
  onLogout: () => void;
}

const LayoutPage = ({ onLogout }: LayoutPageProps) => {
  return (
    <>
      <HeaderComponent onLogout={onLogout} />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
};

export default LayoutPage;
