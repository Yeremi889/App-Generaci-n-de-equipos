const STORAGE_KEY = '@voley_app_data';

/**
 * Estructura del storage:
 * {
 * "grupos": {
 * "NombreGrupo1": {
 * "players": [...],
 * "restrictions": [...]
 * }
 * }
 * }
 */

// Obtiene toda la base de datos
export const getFullStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { grupos: {} };
};

// Guarda un grupo específico o actualiza uno existente
export const saveGroupData = (groupName, groupContent) => {
  const storage = getFullStorage();
  storage.grupos[groupName] = groupContent;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};

// Obtiene los nombres de todos los grupos para la pantalla de inicio
export const getGroupNames = () => {
  const storage = getFullStorage();
  return Object.keys(storage.grupos);
};

// Obtiene la data completa de un grupo (jugadores + restricciones)
export const getGroupDetails = (groupName) => {
  const storage = getFullStorage();
  return storage.grupos[groupName] || { players: [], restrictions: [] };
};

// Eliminar un grupo
export const deleteGroup = (groupName) => {
  const storage = getFullStorage();
  delete storage.grupos[groupName];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};