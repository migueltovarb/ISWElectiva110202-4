import React from 'react';
import { render, screen } from '@testing-library/react';
import Register from '../../app/register/page'; 

describe('Register component', () => {
  it('renders without crashing and shows form', () => {
    render(<Register />);

    expect(screen.getByText('Registro de usuario')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });
});
