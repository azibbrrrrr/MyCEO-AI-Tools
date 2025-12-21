/**
 * Dashboard Tips
 * Daily rotating tips for young entrepreneurs (EN/BM)
 */

export const DAILY_TIPS = {
    EN: [
        "Always smile when talking to customers - it makes them feel welcome! 😊",
        "Keep your prices simple - round numbers are easier to remember! 💰",
        "Make your booth colorful - bright colors attract attention! 🎨",
        "Practice explaining your product in 10 seconds or less! ⏱️",
        "Ask your customers what they like - it helps you improve! 💡",
    ],
    BM: [
        "Sentiasa senyum bila bercakap dengan pelanggan - mereka akan rasa dihargai! 😊",
        "Pastikan harga mudah - nombor bulat lebih senang diingat! 💰",
        "Jadikan gerai anda berwarna-warni - warna cerah menarik perhatian! 🎨",
        "Latih diri menerangkan produk dalam 10 saat! ⏱️",
        "Tanya pelanggan apa yang mereka suka - ia membantu anda memperbaiki! 💡",
    ],
} as const

export type Language = keyof typeof DAILY_TIPS
