import { v4 } from 'uuid';
import dataChanged from '@/service/x6/graph/data-changed.js';
import tmActions from '@/store/actions/threatmodel.js';
import { CELL_DATA_UPDATED, CELL_SELECTED } from '@/store/actions/cell.js';
import { CELL_UNSELECTED } from "../../../store/actions/cell.js";
import threats from "./threats.json"

function _updateTrust(graph) {
    const boundaryBoxes = graph.getNodes().filter(cell => cell.data.type === 'tm.BoundaryBox');
    const nodes = graph.getNodes().filter(cell => cell.data.type !== 'tm.BoundaryBox');
    for (const node of nodes) {
        const {x,y,width,height} = node.getBBox();
        node.data.isTrusted = boundaryBoxes.some(tb => {
            const {x: tbX, y: tbY, width: tbWidth, height: tbHeight} = tb.getBBox();
            return x >= tbX && x + width <= tbX + tbWidth && y >= tbY && y + height <= tbY + tbHeight;
        });
    }
}

function _getCommonEdges(cell1, cell2, {graph}) {
    const edge1 = graph.getConnectedEdges(cell1);
    const edge2 = graph.getConnectedEdges(cell2);
    return edge1.filter(edge => edge2.includes(edge));
}

function _isThreatApplicableToCell(cell, threat, {graph}) {
    function _checkType(type, data) {
        return type === data.type || type === 'any'
    }
    function _checkProps(props, data) {
        return Object.entries(props).every(([key, value]) => data[key] === value);
    }
    function _checkDirection(direction, edge, neighbourCell) {
        const directions = direction.split('|');
        return directions.some(direction => {
            if (direction === 'any') return true;
            if (direction === 'to') return edge.target.cell === neighbourCell.id;
            if (direction === 'from') return edge.source.cell === neighbourCell.id;
            return false; 
        });
    }
    function _checkFlows(flows, cell, neighbourCell, {graph}) {
        const commonEdges = _getCommonEdges(cell, neighbourCell, {graph});
        console.log({commonEdges})
        return flows.every(flow => {
            return commonEdges.some(edge => {
                if (!_checkDirection(flow.direction, edge, neighbourCell)) return false;
                if (!_checkProps(flow.props, edge.data)) return false;
                return true;
            })
        })
    }
    function _checkNeighbours(neighbours, cell, {graph}) {
        const neighbourCells = graph.getNeighbors(cell)
        return neighbours.every(neighbour => {
            return neighbourCells.some(neighbourCell => {
                if (!_checkType(neighbour.nodeType, neighbourCell.data)) return false;
                if (!_checkProps(neighbour.props, neighbourCell.data)) return false;
                if (!_checkFlows(neighbour.flows, cell, neighbourCell, {graph})) return false;
                return true;
            });
        })
    }

    if (cell.data.threats.find(t => t.originId === threat.id)) {
        return false;
    }
    for (const condition of threat.conditions) {
        if (!_checkType(condition.nodeType, cell.data)) continue;
        if (!_checkProps(condition.props, cell.data)) continue;
        if (!_checkNeighbours(condition.neighbours, cell, {graph})) continue;
        return true;
    }
    return false;
}

function _analyzeCellForThreats(cell, {graph, store}) {
    return threats.filter(threat => _isThreatApplicableToCell(cell, threat, {graph})).map((threat,i) => ({
            id: v4(),
            originId: threat.id,
            title: `AUTO: ${threat.name}`,
            status: 'Open',
            severity: 'TBD',
            type: threat.strideType,
            description: threat.description,
            mitigation: threat.mitigations,
            modelType: 'STRIDE',
            new: true,
            number: store.state.threatmodel.data.detail.threatTop + 1 + i,
            score: ''
        }));
}

function _addThreatsToCell(cell, threats, {store}) {
    store.dispatch(CELL_SELECTED, cell);
    cell.data.threats = [...cell.data.threats, ...threats];
    cell.data.hasOpenThreats = cell.data.threats.length > 0;
    store.dispatch(tmActions.update, { threatTop: store.state.threatmodel.data.detail.threatTop + threats.length });
    store.dispatch(tmActions.modified);
    store.dispatch(CELL_DATA_UPDATED, cell.data);
    dataChanged.updateStyleAttrs(cell);
}

export function completeGraphAgentThreats(graph, store) {
    console.log(graph);
    _updateTrust(graph)
    const cells = graph.getCells()
    for (const cell of cells) {
        if (!('threats' in cell.data)) continue;
        const threats = _analyzeCellForThreats(cell, {store, graph});
        _addThreatsToCell(cell, threats, {store});
    }
    store.dispatch(CELL_UNSELECTED);
    graph.cleanSelection();
}
