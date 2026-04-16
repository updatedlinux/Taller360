import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styles from './Section.module.css';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  id?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(({ children, className = '', id, ...rest }, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={`${styles.section} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
});

export default Section;
