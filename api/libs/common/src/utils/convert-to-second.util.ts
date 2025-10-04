export function convertToMiliSecondsUtil(timeStr: string): number {
  if (!isNaN(timeStr as any)) {
    return parseInt(timeStr);
  }

  let multiplier;

  switch (timeStr[timeStr.length - 1]) {
    case 's':
      multiplier = 1;
      break;
    case 'm':
      multiplier = 60;
      break;
    case 'h':
      multiplier = 60 * 60;
      break;
    case 'd':
      multiplier = 60 * 60 * 24;
      break;
    case 'M':
      multiplier = 60 * 60 * 24 * 30;
      break;
    default:
      throw new Error('Invalid Time String');
  }

  const num = parseInt(timeStr.slice(0, -1));

  return num * multiplier * 1000;
}
