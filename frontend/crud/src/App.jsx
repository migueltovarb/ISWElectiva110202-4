import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000/api/tareas/';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [editando, setEditando] = useState(null);
  const [textoEditar, setTextoEditar] = useState('');


  const obtenerTareas = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const crearTarea = async () => {
    if (!nuevaTarea.trim()) return;

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevaTarea, estado: 'pendiente' }),
      });
      setNuevaTarea('');
      obtenerTareas();
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const actualizarTarea = async (id, nombre, estado) => {
    try {
      await fetch(`${API_URL}${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, estado }),
      });
      obtenerTareas();
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const eliminarTarea = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      obtenerTareas();
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const cambiarEstado = (tarea) => {
    const nuevoEstado = tarea.estado === 'pendiente' ? 'hecha' : 'pendiente';
    actualizarTarea(tarea.id, tarea.nombre, nuevoEstado);
  };


  const guardarEdicion = (id) => {
    const tarea = tareas.find(t => t.id === id);
    actualizarTarea(id, textoEditar, tarea.estado);
    setEditando(null);
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <div className="app">
      <h1>Lista de Tareas</h1>
      
      <div className="agregar-tarea">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nueva tarea..."
          onKeyPress={(e) => e.key === 'Enter' && crearTarea()}
        />
        <button onClick={crearTarea}>Agregar</button>
      </div>

      <div className="lista-tareas">
        {tareas.map((tarea) => (
          <div key={tarea.id} className={`tarea ${tarea.estado}`}>
            {editando === tarea.id ? (
              <div className="editando">
                <input
                  type="text"
                  value={textoEditar}
                  onChange={(e) => setTextoEditar(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && guardarEdicion(tarea.id)}
                />
                <button onClick={() => guardarEdicion(tarea.id)}>Guardar</button>
                <button onClick={() => setEditando(null)}>Cancelar</button>
              </div>
            ) : (
              <div className="tarea-info">
                <span className="nombre">{tarea.nombre}</span>
                <span className="estado">{tarea.estado}</span>
                <div className="botones">
                  <button onClick={() => cambiarEstado(tarea)}>
                    {tarea.estado === 'pendiente' ? 'Completar' : 'Pendiente'}
                  </button>
                  <button onClick={() => {
                    setEditando(tarea.id);
                    setTextoEditar(tarea.nombre);
                  }}>
                    Editar
                  </button>
                  <button onClick={() => eliminarTarea(tarea.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
