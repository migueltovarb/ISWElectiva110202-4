import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from './services/api';

function App() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    email: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
    try {
      const response = await getEstudiantes();
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error loading estudiantes:', error);
    }
  };

  const handleOpen = (estudiante = null) => {
    if (estudiante) {
      setFormData(estudiante);
      setEditingId(estudiante.id);
    } else {
      setFormData({ nombre: '', apellido: '', edad: '', email: '' });
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ nombre: '', apellido: '', edad: '', email: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEstudiante(editingId, formData);
      } else {
        await createEstudiante(formData);
      }
      handleClose();
      loadEstudiantes();
    } catch (error) {
      console.error('Error saving estudiante:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        await deleteEstudiante(id);
        loadEstudiantes();
      } catch (error) {
        console.error('Error deleting estudiante:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Estudiantes
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Agregar Estudiante
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Edad</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes.map((estudiante) => (
              <TableRow key={estudiante.id}>
                <TableCell>{estudiante.nombre}</TableCell>
                <TableCell>{estudiante.apellido}</TableCell>
                <TableCell>{estudiante.edad}</TableCell>
                <TableCell>{estudiante.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleOpen(estudiante)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(estudiante.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingId ? 'Editar Estudiante' : 'Agregar Estudiante'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              fullWidth
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Apellido"
              fullWidth
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Edad"
              type="number"
              fullWidth
              value={formData.edad}
              onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default App;
