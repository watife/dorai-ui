import './globals.css'

export const metadata = {
  title: 'DoraiUI NextJS TailwindCSS Typescript Starter',
  description:
    'Example starter create next app with DoraiUI, TailwindCSS and Typescript'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
