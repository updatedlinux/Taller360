import styles from './CTAButton.module.css';

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'inherit';
  type?: 'button' | 'submit';
  href?: string;
  target?: string;
}

const CTAButton = ({
  text,
  onClick,
  variant = 'primary',
  type = 'button',
  href,
  target,
}: CTAButtonProps) => {
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={`${styles.button} ${styles[variant]}`}
      >
        <span>{text}</span>
      </a>
    );
  }

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  );
};

export default CTAButton;
