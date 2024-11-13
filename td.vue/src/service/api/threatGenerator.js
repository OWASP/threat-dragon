import api from './api.js';

export const generateThreats = async function (threatmodel_data, diagram_data, cell_data, cell_neighbours, session){
    return await api.postAsync(`/api/threatmodel/generate/threats`, { threatmodel_data, diagram_data, cell_data, cell_neighbours, session });
}