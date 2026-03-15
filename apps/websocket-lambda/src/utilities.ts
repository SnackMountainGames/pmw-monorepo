export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length: 4 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}