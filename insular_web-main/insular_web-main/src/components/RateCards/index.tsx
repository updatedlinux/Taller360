import { useState, useEffect } from 'react';
import { withBase } from '../../utils/base';
import Card from '../Card';
import styles from './RateCards.module.css';

interface Rate {
  currency: string;
  code: string;
  buy: number;
  sell: number;
  change: number;
  flag: string;
}

const RateCards = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchRates = async () => {
      try {
        // Mock data - replace with actual API call
        const mockRates: Rate[] = [
          {
            currency: 'Dólar USD',
            code: 'USD',
            buy: 4.10,
            sell: 4.15,
            change: 0.5,
            flag: '🇺🇸'
          },
          {
            currency: 'Euro',
            code: 'EUR',
            buy: 4.45,
            sell: 4.52,
            change: -0.3,
            flag: '🇪🇺'
          },
          {
            currency: 'Peso Argentino',
            code: 'ARS',
            buy: 0.0045,
            sell: 0.0048,
            change: 1.2,
            flag: '🇦🇷'
          },
          {
            currency: 'Real Brasileño',
            code: 'BRL',
            buy: 0.82,
            sell: 0.85,
            change: 0.1,
            flag: '🇧🇷'
          }
        ];

        setTimeout(() => {
          setRates(mockRates);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching rates:', error);
        setLoading(false);
      }
    };

    fetchRates();

    // Update rates every 30 seconds
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando tasas...</p>
      </div>
    );
  }

  return (
    <div className={styles.rateCards} data-animate="fade-up">
      <div className="grid grid-4">
        {rates.map((rate, index) => (
          <div key={rate.code} data-animate="fade-up" data-delay={`${0.1 * index}`}>
            <Card variant="light">
              <div className={styles.rateCard}>
                <div className={styles.rateHeader}>
                  <span className={styles.flag}>{rate.flag}</span>
                  <div>
                    <h3 className={styles.currency}>{rate.currency}</h3>
                    <span className={styles.code}>{rate.code}</span>
                  </div>
                </div>

                <div className={styles.rateValues}>
                  <div className={styles.rateItem}>
                    <span className={styles.label}>Compra</span>
                    <span className={styles.value} data-counter>
                      {rate.buy.toFixed(4)}
                    </span>
                  </div>
                  <div className={styles.rateItem}>
                    <span className={styles.label}>Venta</span>
                    <span className={styles.value} data-counter>
                      {rate.sell.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className={styles.change}>
                  <span className={rate.change > 0 ? styles.positive : styles.negative}>
                    <img
                      src={withBase(rate.change > 0 ? 'icons/chevron_up_naked.svg' : 'icons/chevron_down_naked.svg')}
                      alt={rate.change > 0 ? 'up' : 'down'}
                      className={styles.changeIcon}
                    />
                    {Math.abs(rate.change)}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className={styles.updateTime}>
        <p className="body-xs">Última actualización: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default RateCards;
