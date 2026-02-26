import { TEAM_NAMES } from './constants';

export const generateTeams = (players, restrictions, numTeams) => {
    const TEAM_SIZE = 6;
    if (players.length !== (TEAM_SIZE * numTeams)) return null;

    // --- 1. CENSO TÁCTICO Y DE GÉNERO ---
    const totalMujeres = players.filter(p => p.genero === 'FEMENINO').length;
    const cuotaBaseFem = Math.floor(totalMujeres / numTeams);
    const sobranteFem = totalMujeres % numTeams;

    let disponibles = [...players];
    let equipos = Array.from({ length: numTeams }, (_, i) => ({
        name: TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)] || `SQUAD ${i + 1}`,
        members: [],
        fuerzaTotal: 0,
        mujeresContador: 0,
        cuotaFem: cuotaBaseFem + (i < sobranteFem ? 1 : 0)
    }));

    const getAptitud = (p, rol) => {
        const s = p.stats;
        return rol === "Colocador" ? (s.colocacion + s.recepcion) / 2 : (s.ataque + s.bloqueo + s.recepcion) / 3;
    };

    // --- 2. ASIGNACIÓN POR CAPAS DE AFINIDAD ---
    const ROLES = [
        { tipo: "Colocador", cant: 2 },
        { tipo: "Centro", cant: 2 },
        { tipo: "Punta", cant: 2 }
    ];

    ROLES.forEach(bloque => {
        for (let i = 0; i < bloque.cant; i++) {
            // Equilibrio Dinámico: El equipo con menos fuerza elige primero en cada ronda
            equipos.sort((a, b) => a.fuerzaTotal - b.fuerzaTotal);

            equipos.forEach(equipo => {
                if (equipo.members.filter(m => m.rolFinal === bloque.tipo).length >= bloque.cant) return;

                // FILTRADO JERÁRQUICO (Prioridad Real)
                let candidatos = disponibles.filter(p => {
                    // Restricción P3: No negociable
                    const conflictoP3 = restrictions.some(r => r.level === "P3" && 
                        ((r.p1 === p.id && equipo.members.some(m => m.id === r.p2)) || 
                         (r.p2 === p.id && equipo.members.some(m => m.id === r.p1))));
                    if (conflictoP3) return false;

                    // Cuota de Género: Mantener paridad
                    if (p.genero === 'FEMENINO' && equipo.mujeresContador >= equipo.cuotaFem) return false;
                    
                    return true;
                });

                if (candidatos.length === 0) candidatos = [...disponibles];

                // Búsqueda por Vocación (Lis Protection)
                let elegido = 
                    candidatos.find(p => p.posicionPrincipal === bloque.tipo) ||
                    candidatos.find(p => p.posicionesSecundarias.includes(bloque.tipo));

                // Si nadie tiene la posición ni como secundaria, buscamos por Talento (Emergencia)
                if (!elegido) {
                    elegido = candidatos.sort((a, b) => getAptitud(b, bloque.tipo) - getAptitud(a, bloque.tipo))[0];
                }

                if (elegido) {
                    equipo.members.push({ ...elegido, rolFinal: bloque.tipo });
                    equipo.fuerzaTotal += parseFloat(elegido.promedio);
                    if (elegido.genero === 'FEMENINO') equipo.mujeresContador++;
                    disponibles = disponibles.filter(p => p.id !== elegido.id);
                }
            });
        }
    });

    // Ordenar visualmente: Colocador -> Centro -> Punta
    const ordenPos = { "Colocador": 1, "Centro": 2, "Punta": 3 };
    return equipos.map(eq => ({
        ...eq,
        members: eq.members.sort((a, b) => ordenPos[a.rolFinal] - ordenPos[b.rolFinal])
    }));
};