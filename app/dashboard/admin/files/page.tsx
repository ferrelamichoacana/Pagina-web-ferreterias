import React from 'react'
import { Metadata } from 'next'
import FileManagementPage from '@/components/admin/FileManagementPage'

export const metadata: Metadata = {
  title: 'Gestión de Archivos - Ferretería La Michoacana',
  description: 'Administración centralizada de archivos del sistema',
}

export default function FilesPage() {
  return <FileManagementPage />
}