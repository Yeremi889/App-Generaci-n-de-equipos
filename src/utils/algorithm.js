import { TEAM_NAMES } from './constants';

export const generateTeams = (players, restrictions, numTeams) => {
    let bestSelection = null;
    let minPenalty = Infinity;

    const names = [...TEAM_NAMES].sort(() => Math.random() - 0.5);
    const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

    for (let i = 0; i < 3000; i++) {
        const shuffled = shuffle(players);
        const teams = Array.from({ length: numTeams }, (v, k) => ({
            name: names[k] || `Equipo ${k + 1}`,
            members: []
        }));
        
        shuffled.forEach((player, index) => {
            if (index < numTeams * 6) {
                const teamIdx = index % numTeams;
                const currentTeam = teams[teamIdx].members;
                const ocupados = {
                    "Colocador": currentTeam.filter(m => m.rolAsignado === "Colocador").length,
                    "Centro": currentTeam.filter(m => m.rolAsignado === "Centro").length,
                    "Punta": currentTeam.filter(m => m.rolAsignado === "Punta").length
                };

                let rolFinal = player.posicionPrincipal;
                if (ocupados[player.posicionPrincipal] >= 2) {
                    const secundariaValida = player.posicionesSecundarias?.find(sec => ocupados[sec] < 2);
                    if (secundariaValida) rolFinal = secundariaValida;
                }
                teams[teamIdx].members.push({ ...player, rolAsignado: rolFinal });
            }
        });

        let currentPenalty = 0;
        const membersOnly = teams.map(t => t.members);

        // A. Penalización por Nivel
        const teamAverages = membersOnly.map(team => team.reduce((sum, p) => sum + parseFloat(p.promedio), 0));
        currentPenalty += (Math.max(...teamAverages) - Math.min(...teamAverages)) * 100;

        // B. Restricciones
        restrictions.forEach(res => {
            membersOnly.forEach(team => {
                if (team.some(p => p.nombre === res.jugadorA) && team.some(p => p.nombre === res.jugadorB)) {
                    currentPenalty += res.prioridad === 3 ? 100000 : res.prioridad === 2 ? 5000 : 1000;
                }
            });
        });

        // C. Balance de roles (2 por posición)
        membersOnly.forEach(team => {
            const roles = team.map(m => m.rolAsignado);
            ["Colocador", "Centro", "Punta"].forEach(r => {
                if (roles.filter(x => x === r).length !== 2) currentPenalty += 8000;
            });
        });

        if (currentPenalty < minPenalty) {
            minPenalty = currentPenalty;
            bestSelection = teams;
        }
    }
    return bestSelection;
};