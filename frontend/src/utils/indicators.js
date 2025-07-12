import { SMA, RSI, ATR } from 'technicalindicators';  // Add ATR import if using MA/RSI too

export function calculateATR(candles, period = 10) {
  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);
  const close = candles.map(c => c.close);
  return ATR.calculate({ period, high, low, close });
}

