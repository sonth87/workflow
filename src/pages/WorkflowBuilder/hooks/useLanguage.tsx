import type { MultilingualTextType } from '@/types/dynamic-bpm.type'

const useLanguage = () => {
  const language = 'vi'

  const getText = (text?: MultilingualTextType | string): string => {
    return typeof text === 'object' ? text?.[language]?.toString() || '' : text || ''
    // xử lý hiển thị undefined/null
    // if (typeof text === "object" && text !== null) {
    //   const value = text?.[language];
    //   return value !== null && value !== undefined ? value.toString() : "";
    // }
    // // Kiểm tra null/undefined thay vì dùng || để tránh mất số 0
    // return text !== null && text !== undefined ? text.toString() : "";
  }
  return { getText }
}

export default useLanguage
