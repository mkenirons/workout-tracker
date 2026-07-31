/** "Nice" round-number ticks spanning [min, max], per the classic Heckbert algorithm. */
export function niceTicks(min: number, max: number, targetCount = 4): number[] {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const range = niceNumber(max - min, false);
  const step = niceNumber(range / (targetCount - 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;

  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step * 0.5; v += step) {
    ticks.push(Math.round(v * 100) / 100);
  }
  return ticks;
}

function niceNumber(value: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(value || 1));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction: number;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }
  return niceFraction * Math.pow(10, exponent);
}
