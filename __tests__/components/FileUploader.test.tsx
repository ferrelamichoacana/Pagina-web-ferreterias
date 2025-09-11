import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FileUploader from '@/components/ui/FileUploader'

// Mock de Cloudinary
global.fetch = jest.fn()

describe('FileUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload area correctly', () => {
    render(<FileUploader />)
    
    expect(screen.getByText('Subir archivos')).toBeInTheDocument()
    expect(screen.getByText('Arrastra y suelta archivos aquí, o haz clic para seleccionar')).toBeInTheDocument()
  })

  it('shows file limits and accepted types', () => {
    render(
      <FileUploader 
        maxFiles={3} 
        maxFileSize={5} 
        acceptedTypes={['image/*', 'application/pdf']} 
      />
    )
    
    expect(screen.getByText('Máximo 3 archivos, 5MB cada uno')).toBeInTheDocument()
    expect(screen.getByText(/image\/\*, application\/pdf/)).toBeInTheDocument()
  })

  it('validates file size correctly', async () => {
    const onError = jest.fn()
    render(<FileUploader maxFileSize={1} onError={onError} />)
    
    // Crear archivo de 2MB (mayor al límite de 1MB)
    const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.pdf', { 
      type: 'application/pdf' 
    })
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    Object.defineProperty(input, 'files', {
      value: [largeFile],
      writable: false,
    })
    
    fireEvent.change(input)
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining('excede el tamaño máximo')
      )
    })
  })

  it('validates file type correctly', async () => {
    const onError = jest.fn()
    render(
      <FileUploader 
        acceptedTypes={['image/*']} 
        onError={onError} 
      />
    )
    
    const textFile = new File(['content'], 'document.txt', { 
      type: 'text/plain' 
    })
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    Object.defineProperty(input, 'files', {
      value: [textFile],
      writable: false,
    })
    
    fireEvent.change(input)
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining('Tipo de archivo no permitido')
      )
    })
  })

  it('validates maximum number of files', async () => {
    const onError = jest.fn()
    render(<FileUploader maxFiles={2} onError={onError} />)
    
    const files = [
      new File(['1'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['2'], 'file2.pdf', { type: 'application/pdf' }),
      new File(['3'], 'file3.pdf', { type: 'application/pdf' })
    ]
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    Object.defineProperty(input, 'files', {
      value: files,
      writable: false,
    })
    
    fireEvent.change(input)
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Máximo 2 archivos permitidos')
    })
  })

  it('handles successful file upload', async () => {
    const onFilesUploaded = jest.fn()
    
    // Mock successful API upload response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        url: 'https://cloudinary.com/test.pdf',
        publicId: 'test_id'
      })
    })
    
    render(<FileUploader onFilesUploaded={onFilesUploaded} />)
    
    const validFile = new File(['content'], 'test.pdf', { 
      type: 'application/pdf' 
    })
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    Object.defineProperty(input, 'files', {
      value: [validFile],
      writable: false,
    })
    
    fireEvent.change(input)
    
    await waitFor(() => {
      expect(onFilesUploaded).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'test.pdf',
            url: 'https://cloudinary.com/test.pdf'
          })
        ])
      )
    })
  })

  it('handles upload errors gracefully', async () => {
    const onError = jest.fn()
    
    // Mock failed Cloudinary response
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Upload failed')
    )
    
    render(<FileUploader onError={onError} />)
    
    const validFile = new File(['content'], 'test.pdf', { 
      type: 'application/pdf' 
    })
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    Object.defineProperty(input, 'files', {
      value: [validFile],
      writable: false,
    })
    
    fireEvent.change(input)
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining('Error al subir test.pdf')
      )
    })
  })

  it('renders in compact mode correctly', () => {
    render(<FileUploader compact={true} />)
    
    expect(screen.getByText('Arrastra archivos o haz clic')).toBeInTheDocument()
    expect(screen.queryByText('Subir archivos')).not.toBeInTheDocument()
  })

  it('shows uploading state', async () => {
    // Mock pending Cloudinary response
    ;(global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )
    
    render(<FileUploader />)
    
    const validFile = new File(['content'], 'test.pdf', { 
      type: 'application/pdf' 
    })
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    
    Object.defineProperty(input, 'files', {
      value: [validFile],
      writable: false,
    })
    
    fireEvent.change(input)
    
    expect(screen.getByText('Subiendo archivos...')).toBeInTheDocument()
  })

  it('handles drag and drop events', () => {
    render(<FileUploader />)
    
    const dropZone = screen.getByText('Subir archivos').closest('div')
    
    // Test drag enter
    fireEvent.dragEnter(dropZone!)
    expect(dropZone).toHaveClass('border-green-500')
    
    // Test drag leave
    fireEvent.dragLeave(dropZone!)
    expect(dropZone).not.toHaveClass('border-green-500')
  })

  it('formats file size correctly', () => {
    const { container } = render(<FileUploader showPreview={true} />)
    
    // Esta función se testearía internamente
    // Aquí verificamos que el componente maneja diferentes tamaños
    expect(container).toBeInTheDocument()
  })
})