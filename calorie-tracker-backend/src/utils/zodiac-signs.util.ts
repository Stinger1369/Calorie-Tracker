export const zodiacSigns = [
  { name: 'Capricorn', startDate: [1, 1], endDate: [1, 19] },
  { name: 'Aquarius', startDate: [1, 20], endDate: [2, 18] },
  { name: 'Pisces', startDate: [2, 19], endDate: [3, 20] },
  { name: 'Aries', startDate: [3, 21], endDate: [4, 19] },
  { name: 'Taurus', startDate: [4, 20], endDate: [5, 20] },
  { name: 'Gemini', startDate: [5, 21], endDate: [6, 20] },
  { name: 'Cancer', startDate: [6, 21], endDate: [7, 22] },
  { name: 'Leo', startDate: [7, 23], endDate: [8, 22] },
  { name: 'Virgo', startDate: [8, 23], endDate: [9, 22] },
  { name: 'Libra', startDate: [9, 23], endDate: [10, 22] },
  { name: 'Scorpio', startDate: [10, 23], endDate: [11, 21] },
  { name: 'Sagittarius', startDate: [11, 22], endDate: [12, 21] },
  { name: 'Capricorn', startDate: [12, 22], endDate: [12, 31] },
];

export function getHoroscope(month: number, day: number): string {
  return (
    zodiacSigns.find((sign) =>
      isDateInRange(month, day, sign.startDate, sign.endDate),
    )?.name || 'Unknown'
  );
}

function isDateInRange(
  month: number,
  day: number,
  start: number[],
  end: number[],
): boolean {
  const date = month * 100 + day;
  const startDate = start[0] * 100 + start[1];
  const endDate = end[0] * 100 + end[1];

  return date >= startDate && date <= endDate;
}
