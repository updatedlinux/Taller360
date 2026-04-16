import { useState } from 'react';
import styles from './Accordion.module.css';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
          data-animate="fade-up"
          data-delay={`${0.1 * index}`}
        >
          <button
            className={styles.accordionHeader}
            onClick={() => toggleItem(index)}
            aria-expanded={activeIndex === index}
            aria-controls={`panel-${index}`}
          >
            <span>{item.question}</span>
            <span className={styles.icon}>
              {activeIndex === index ? '−' : '+'}
            </span>
          </button>
          <div
            id={`panel-${index}`}
            className={styles.accordionContent}
            aria-hidden={activeIndex !== index}
          >
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;