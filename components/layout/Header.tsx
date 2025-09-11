'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { 
  Bars3Icon, 
  XMarkIcon, 
  GlobeAltIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.branches, href: '/sucursales' },
    { name: t.nav.contact, href: '/contacto' },
    { name: t.nav.jobs, href: '/empleos' },
  ]

  const handleLanguageToggle = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <header className="bg-forest-green shadow-lg border-b border-light-green transition-colors duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-64 w-128 md:h-40 md:w-60 flex items-center justify-center">
                <img 
                  src="/images/logo.png" 
                  alt="Ferretería La Michoacana Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-light-green font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Controles de usuario y idioma */}
          <div className="flex items-center space-x-4">
            {/* Selector de idioma */}
            {/* <button
              onClick={handleLanguageToggle}
              className="flex items-center space-x-1 text-white hover:text-light-green transition-colors duration-200"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span className="text-sm font-medium uppercase">{language}</span>
            </button> */}

            {/* Autenticación */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center space-x-1 text-white hover:text-light-green font-medium transition-colors duration-200"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="mobile-hidden">{t.nav.dashboard}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 bg-light-green text-forest-green px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition-colors duration-200 text-sm font-medium"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="mobile-hidden">{t.nav.logout}</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-white hover:text-light-green font-medium transition-colors duration-200"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-light-green text-forest-green px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 text-sm font-medium"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              type="button"
              className="md:hidden p-2 text-white hover:text-light-green transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-light-green py-4 bg-forest-green">
            <div className="space-y-3 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-white hover:text-light-green font-medium py-2 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-3 border-t border-light-green space-y-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-white hover:text-light-green font-medium py-2 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span>{t.nav.dashboard}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 w-full text-left bg-light-green text-forest-green px-3 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-light-green space-y-3">
                  <Link
                    href="/auth/login"
                    className="block text-white hover:text-light-green font-medium py-2 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block bg-light-green text-forest-green px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 text-center font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.nav.register}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}