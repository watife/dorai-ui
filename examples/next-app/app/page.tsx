'use client'
import Image from 'next/image'
import { Modal } from '@dorai-ui/components'

export default function Home() {
  type Navlink = {
    id: number
    title: string
    link: string
  }

  const navLinks: Navlink[] = [
    {
      id: 1,
      title: 'Website',
      link: 'https://www.dorai-ui.com'
    },
    {
      id: 2,
      title: 'Documentation',
      link: 'https://www.dorai-ui.com/getting-started/introduction'
    },
    {
      id: 3,
      title: 'GitHub',
      link: 'https://github.com/watife/dorai-ui'
    }
  ]

  return (
    <main className='flex flex-col items-center justify-between px-4 py-12 space-y-12 lg:min-h-screen md:px-8 xl:px-0'>
      <nav className='container flex items-center justify-between w-full max-w-6xl'>
        <div className='shrink-0'>
          <a
            href='https://www.dorai-ui.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='relative w-28 h-14'>
              <Image src='/dorai.svg' alt='Dorai Logo' fill priority />
            </div>
          </a>
        </div>
        {/* Mobile nav */}
        <Modal>
          <Modal.Trigger className='md:hidden'>
            {/* Hamburger Icon */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 24 24'
            >
              <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 17h14M5 12h14M5 7h14'
              />
            </svg>
          </Modal.Trigger>
          <Modal.Group>
            <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 p-4 before:inset-0 absolute before:content-[''] border-y border-white/30 before:bg-black/10 before:backdrop-blur-xl before:absolute w-full h-full">
              <Modal.Close className='absolute -translate-x-1/2 left-1/2'>
                <div className='flex items-center justify-center w-12 h-12 text-lg font-semibold border rounded-full bg-white/10 border-white/20'>
                  {/* Close Icon */}
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z'
                    />
                  </svg>
                </div>
              </Modal.Close>
              <Modal.Description
                as='ul'
                className='relative flex flex-col items-center mt-32 space-y-12 font-semibold text-white'
              >
                {navLinks.map((navLink) => (
                  <li key={navLink.id}>
                    <a
                      target='_blank'
                      rel='noopener noreferrer'
                      href={navLink.link}
                      className='text-3xl text-center lg:text-5xl hover:underline'
                    >
                      {navLink.title}
                    </a>
                  </li>
                ))}
              </Modal.Description>
            </div>
          </Modal.Group>
        </Modal>
        {/* Only visible on medium and above md sized screens */}
        <ul className='hidden space-x-20 md:flex'>
          {navLinks.map((navLink) => (
            <li key={navLink.id}>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href={navLink.link}
                className='text-lg text-gray-300 hover:underline'
              >
                {navLink.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative flex place-items-center before:absolute before:h-48 before:w-48 before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-l before:from-white before:to-transparent before:content-[''] after:absolute after:-z-20 after:h-44 after:w-56 after:translate-x-1/3 after:bg-gradient-to-bl before:blur-2xl after:blur-2xl before:opacity-20 after:opacity-50 after:from-blue-200 after:via-purple-200 after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-purple-700  after:dark:from-blue-900 after:dark:via-purple-800  before:lg:h-80 p-4 py-32 md:py-48">
        <h1 className='z-10 max-w-2xl p-6 text-3xl font-bold text-left md:text-5xl'>
          DoraiUI + NextJS + TailwindCSS + Typescript
        </h1>
        <div className='absolute w-64 h-64 border-2 rounded-r-full animate-pulse md:w-96 md:h-96 border-white/40'></div>
      </div>

      <div className='flex justify-center'>
        <p className='flex flex-col items-center justify-center w-full p-4 text-lg text-gray-300 border border-white md:flex-row border-opacity-20 rounded-xl'>
          Get started by editing&nbsp;
          <code className='px-2 mt-2 font-mono font-bold bg-white rounded bg-opacity-20 md:mt-0'>
            src/app/page.tsx
          </code>
        </p>
      </div>
    </main>
  )
}
