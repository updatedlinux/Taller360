// API for exchange rates with BCV integration

export interface ExchangeRate {
  currency: string;
  code: string;
  buy: number;
  sell: number;
  change: number;
  flag: string;
  lastUpdate: Date;
}

interface BCVResponse {
  success: boolean;
  data: {
    euro: string;
    dolar: string;
    compra: string | null;
    venta: string | null;
    fecha: string;
  };
}

// Cache configuration
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours (twice daily updates)
const BCV_API_URL = 'https://bcv-api.vanalva.com/';

// In-memory cache
let cachedRates: ExchangeRate[] | null = null;
let cachedBCVData: BCVResponse | null = null;
let lastFetchTime: number = 0;
let previousRates: Map<string, number> = new Map();

// Fetch rates from BCV API
const fetchBCVRates = async (): Promise<BCVResponse> => {
  const response = await fetch(BCV_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch BCV rates');
  }
  return response.json();
};

// Parse BCV rate string (e.g., "212,48370000" -> 212.4837)
const parseRate = (rateString: string): number => {
  return parseFloat(rateString.replace(',', '.'));
};

// Calculate percentage change
const calculateChange = (current: number, previous: number | undefined): number => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

// Build exchange rates from BCV data
const buildRatesFromBCV = (bcvData: BCVResponse): ExchangeRate[] => {
  const dolarRate = parseRate(bcvData.data.dolar);
  const euroRate = parseRate(bcvData.data.euro);

  // Calculate changes
  const dolarChange = calculateChange(dolarRate, previousRates.get('USD'));
  const euroChange = calculateChange(euroRate, previousRates.get('EUR'));

  // Update previous rates
  previousRates.set('USD', dolarRate);
  previousRates.set('EUR', euroRate);

  const lastUpdate = new Date();

  // BCV provides official rates, we'll apply a small spread for buy/sell
  const spread = 0.02; // 2% spread

  return [
    {
      currency: 'Dólar USD',
      code: 'USD',
      buy: dolarRate * (1 - spread),
      sell: dolarRate * (1 + spread),
      change: dolarChange,
      flag: '🇺🇸',
      lastUpdate
    },
    {
      currency: 'Euro',
      code: 'EUR',
      buy: euroRate * (1 - spread),
      sell: euroRate * (1 + spread),
      change: euroChange,
      flag: '🇪🇺',
      lastUpdate
    },
    {
      currency: 'Peso Argentino',
      code: 'ARS',
      buy: 0.0045,
      sell: 0.0048,
      change: 0,
      flag: '🇦🇷',
      lastUpdate
    },
    {
      currency: 'Real Brasileño',
      code: 'BRL',
      buy: 0.82,
      sell: 0.85,
      change: 0,
      flag: '🇧🇷',
      lastUpdate
    },
    {
      currency: 'Peso Chileno',
      code: 'CLP',
      buy: 0.0042,
      sell: 0.0045,
      change: 0,
      flag: '🇨🇱',
      lastUpdate
    },
    {
      currency: 'Peso Colombiano',
      code: 'COP',
      buy: 0.00095,
      sell: 0.00098,
      change: 0,
      flag: '🇨🇴',
      lastUpdate
    },
    {
      currency: 'Peso Mexicano',
      code: 'MXN',
      buy: 0.22,
      sell: 0.23,
      change: 0,
      flag: '🇲🇽',
      lastUpdate
    },
    {
      currency: 'Libra Esterlina',
      code: 'GBP',
      buy: 5.10,
      sell: 5.20,
      change: 0,
      flag: '🇬🇧',
      lastUpdate
    }
  ];
};

// Check if cache is valid
const isCacheValid = (): boolean => {
  return cachedRates !== null && (Date.now() - lastFetchTime) < CACHE_DURATION;
};

// Get all exchange rates
export const getExchangeRates = async (): Promise<ExchangeRate[]> => {
  // Return cached rates if valid
  if (isCacheValid()) {
    return cachedRates!;
  }

  try {
    // Fetch fresh data from BCV API
    const bcvData = await fetchBCVRates();
    const rates = buildRatesFromBCV(bcvData);

    // Update cache
    cachedRates = rates;
    cachedBCVData = bcvData;
    lastFetchTime = Date.now();

    return rates;
  } catch (error) {
    console.error('Error fetching BCV rates:', error);

    // Return cached data if available, even if expired
    if (cachedRates) {
      return cachedRates;
    }

    // Fallback to empty array if no cache available
    throw new Error('Unable to fetch exchange rates');
  }
};

// Get specific exchange rate
export const getExchangeRate = async (code: string): Promise<ExchangeRate | null> => {
  const rates = await getExchangeRates();
  return rates.find(r => r.code === code) || null;
};

// Calculate exchange
export const calculateExchange = async (
  fromCode: string,
  toCode: string,
  amount: number
): Promise<{ result: number; fee: number; total: number } | null> => {
  const rates = await getExchangeRates();

  const fromRate = rates.find(r => r.code === fromCode);
  const toRate = rates.find(r => r.code === toCode);

  if (!fromRate || !toRate) return null;

  // Exchange calculation
  const baseAmount = amount * fromRate.sell;
  const result = baseAmount / toRate.buy;
  const fee = result * 0.02; // 2% fee

  return {
    result: result - fee,
    fee,
    total: result
  };
};

// Get BCV date in formatted string (dd / mm / yyyy)
export const getBCVDate = async (): Promise<string> => {
  // Ensure we have fresh data
  await getExchangeRates();

  if (cachedBCVData?.data.fecha) {
    // Parse the Spanish date format: "Jueves, 23 Octubre  2025"
    const dateStr = cachedBCVData.data.fecha;
    const parts = dateStr.split(' ').filter(p => p.trim());

    // Extract day and year
    const day = parts[1]; // "23"
    const year = parts[3]; // "2025"

    // Map Spanish month names to numbers
    const monthMap: { [key: string]: string } = {
      'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04',
      'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
      'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
    };

    const monthName = parts[2]; // "Octubre"
    const month = monthMap[monthName] || '01';

    return `${day.padStart(2, '0')} / ${month} / ${year}`;
  }

  // Fallback to current date
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${day} / ${month} / ${year}`;
};

// Subscribe to rate updates (WebSocket simulation)
export const subscribeToRates = (
  callback: (rates: ExchangeRate[]) => void,
  interval: number = 30000
): () => void => {
  const intervalId = setInterval(async () => {
    const rates = await getExchangeRates();
    callback(rates);
  }, interval);

  // Return unsubscribe function
  return () => clearInterval(intervalId);
};