import styles from './AnimatedButton.module.css';

interface AnimatedButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
}

const AnimatedButton = ({
  text,
  onClick,
  variant = 'primary',
  type = 'button',
}: AnimatedButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default AnimatedButton;
