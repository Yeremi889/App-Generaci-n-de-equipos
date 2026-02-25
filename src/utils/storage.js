// src/utils/storage.js

// Obtener solo los nombres de los grupos para la lista principal
export const getGroupNames = () => {
    const storage = JSON.parse(localStorage.getItem('voley_app_data')) || {};
    return Object.keys(storage);
};

// Alias para que HomeScreen no de error
export const getGroups = getGroupNames; 

// Obtener los detalles de un grupo específico (jugadores y reglas)
export const getGroupDetails = (groupName) => {
    const storage = JSON.parse(localStorage.getItem('voley_app_data')) || {};
    return storage[groupName] || { players: [], restrictions: [] };
};

// Guardar o crear un grupo nuevo
export const saveGroupData = (groupName, data) => {
    const storage = JSON.parse(localStorage.getItem('voley_app_data')) || {};
    storage[groupName] = data;
    localStorage.setItem('voley_app_data', JSON.stringify(storage));
};

// Crear un grupo vacío (Alias para la lógica de HomeScreen)
export const createGroup = (groupName) => {
    const storage = JSON.parse(localStorage.getItem('voley_app_data')) || {};
    if (!storage[groupName]) {
        storage[groupName] = { players: [], restrictions: [] };
        localStorage.setItem('voley_app_data', JSON.stringify(storage));
    }
};

// Borrar un grupo
export const deleteGroup = (groupName) => {
    const storage = JSON.parse(localStorage.getItem('voley_app_data')) || {};
    delete storage[groupName];
    localStorage.setItem('voley_app_data', JSON.stringify(storage));
};