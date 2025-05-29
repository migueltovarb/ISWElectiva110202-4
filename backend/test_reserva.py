import requests
import json

# Datos de prueba para login
login_data = {
    "username": "admin",  # Cambia por un usuario válido
    "password": "admin123"  # Cambia por la contraseña correcta
}

# Obtener token de autenticación
try:
    login_response = requests.post('http://localhost:8000/api/registro/login/', json=login_data)
    print(f"Login Status: {login_response.status_code}")
    print(f"Login Response: {login_response.text}")
    
    if login_response.status_code == 200:
        token_data = login_response.json()
        token = token_data.get('access')
        
        # Datos de prueba para reserva
        reserva_data = {
            "habitacion_id": 1,  # ID de una habitación existente
            "fecha_inicio": "2025-06-01",
            "fecha_fin": "2025-06-05",
            "estado": "pendiente"
        }
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Hacer petición POST
        response = requests.post('http://localhost:8000/api/reservas/', 
                               json=reserva_data, 
                               headers=headers)
        
        print(f"\nReserva Status: {response.status_code}")
        print(f"Reserva Response: {response.text}")
        
        if response.status_code != 201:
            print(f"Headers enviados: {headers}")
            print(f"Datos enviados: {json.dumps(reserva_data, indent=2)}")
    else:
        print("Error en login, no se puede probar reserva")
        
except Exception as e:
    print(f"Error: {e}") 