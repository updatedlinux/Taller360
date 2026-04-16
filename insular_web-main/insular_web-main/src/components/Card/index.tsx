import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

const Card = ({
  children,
  className = '',
  variant = 'default'
}: CardProps) => {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className} module`}>
      {children}
    </div>
  );
};

export default Card;
