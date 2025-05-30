import React from 'react'
import { render, screen } from '@testing-library/react'
import RoomCard from '@/components/RoomCard'

describe('RoomCard', () => {
  it('muestra el título y la descripción pasados por props', () => {
    const title = 'Suite Panorámica'
    const description = 'La mejor vista de la ciudad'
    render(<RoomCard title={title} description={description} imageSrc="fake.jpg" />)
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })
})
