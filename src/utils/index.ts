export const delay = async (ms: number) => new Promise((resolve: any) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

/**
 * 16进制颜色转RGB/RGBA字符串
 * @param {string} hex - 16进制颜色值
 * @returns {string} - 返回rgb/rgba格式字符串
 */
export function hexToRgb(hex: string, opacity: number =1) {
  // 移除#号并转大写
  let cleanHex = hex.replace(/^#/, '').toUpperCase();

  // 处理短格式（3位或4位）
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  } else if (cleanHex.length === 4) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }

  // 验证格式
  const hexRegex = /^([A-F0-9]{6}|[A-F0-9]{8})$/;
  if (!hexRegex.test(cleanHex)) {
    throw new Error('Invalid hex color format');
  }

  // 分离各颜色通道
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  let a = 1;

  // 处理透明度通道
  if (cleanHex.length === 8) {
    a = Math.round(parseInt(cleanHex.substring(6, 8), 16) / 255) * 100 / 100;
  }

  // 返回对应格式
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgba(${r}, ${g}, ${b}, ${opacity})`;
}