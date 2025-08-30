import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '1necard - Smart Contact Cards',
  description: 'Share your world with one tap. Professional smart contact cards with NFC & QR technology.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-secondary text-gray-900`}>
        {children}
      </body>
    </html>
  )
}