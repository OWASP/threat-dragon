/**
 * DiagramChangeTracker Service
 *
 * This service provides comprehensive change tracking for diagrams, threats, and properties.
 * It uses deep comparison to detect actual changes rather than relying on flags.
 */
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('service:DiagramChangeTracker');

/**
 * Deep compare two objects to determine if they are equal
 * @param {Object} obj1 - First object to compare
 * @param {Object} obj2 - Second object to compare
 * @returns {boolean} - True if objects are equal, false otherwise
 */
export const deepCompare = (obj1, obj2) => {
    // Handle null/undefined cases
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;

    // Handle different types
    if (typeof obj1 !== typeof obj2) return false;

    // Handle primitive types
    if (typeof obj1 !== 'object') return obj1 === obj2;

    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;

        // Sort arrays if they contain objects with IDs to ensure consistent comparison
        const sortedArr1 = [...obj1];
        const sortedArr2 = [...obj2];

        if (sortedArr1.length > 0 && typeof sortedArr1[0] === 'object' && sortedArr1[0]?.id) {
            sortedArr1.sort((a, b) => (a.id > b.id) ? 1 : -1);
            sortedArr2.sort((a, b) => (a.id > b.id) ? 1 : -1);
        }

        return sortedArr1.every((item, index) => deepCompare(item, sortedArr2[index]));
    }

    // Handle objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => {
        // Skip comparing functions
        if (typeof obj1[key] === 'function' && typeof obj2[key] === 'function') {
            return true;
        }
        return deepCompare(obj1[key], obj2[key]);
    });
};

/**
 * Check if a diagram has actual changes compared to its original state
 * @param {Object} originalDiagram - The original diagram state
 * @param {Object} currentDiagram - The current diagram state
 * @returns {boolean} - True if there are actual changes, false otherwise
 */
export const hasDiagramChanges = (originalDiagram, currentDiagram) => {
    if (!originalDiagram || !currentDiagram) return false;

    // 1. Check diagram structure changes (cells, connections, etc.)
    const originalCells = originalDiagram.cells || [];
    const currentCells = currentDiagram.cells || [];

    if (originalCells.length !== currentCells.length) {
        log.debug('Diagram changed: different number of cells');
        return true;
    }

    // Deep compare cells
    const cellsEqual = deepCompare(originalCells, currentCells);
    if (!cellsEqual) {
        log.debug('Diagram changed: cells modified');
        return true;
    }

    // 2. Check if any properties of the diagram changed
    const diagramPropsEqual = deepCompare(
        { ...originalDiagram, cells: undefined },
        { ...currentDiagram, cells: undefined }
    );

    if (!diagramPropsEqual) {
        log.debug('Diagram changed: properties modified');
        return true;
    }

    return false;
};

/**
 * Check if threats have changed compared to their original state
 * @param {Array} originalThreats - The original threats array
 * @param {Array} currentThreats - The current threats array
 * @returns {boolean} - True if there are actual changes, false otherwise
 */
export const hasThreatChanges = (originalThreats = [], currentThreats = []) => {
    // 1. Check if threats were added or removed
    if (originalThreats.length !== currentThreats.length) {
        log.debug('Threats changed: different number of threats');
        return true;
    }

    // 2. Check if any existing threats were modified
    // Sort threats by ID for consistent comparison
    const sortedOriginal = [...originalThreats].sort((a, b) => (a.id > b.id) ? 1 : -1);
    const sortedCurrent = [...currentThreats].sort((a, b) => (a.id > b.id) ? 1 : -1);

    // Compare each threat
    for (let i = 0; i < sortedOriginal.length; i++) {
        if (!deepCompare(sortedOriginal[i], sortedCurrent[i])) {
            log.debug('Threats changed: threat modified', { id: sortedOriginal[i].id });
            return true;
        }
    }

    return false;
};

/**
 * Check if a cell's threats have changed
 * @param {Object} originalCell - The original cell
 * @param {Object} currentCell - The current cell
 * @returns {boolean} - True if there are actual changes, false otherwise
 */
export const hasCellThreatChanges = (originalCell, currentCell) => {
    if (!originalCell || !currentCell) return false;

    const originalThreats = originalCell.data?.threats || [];
    const currentThreats = currentCell.data?.threats || [];

    return hasThreatChanges(originalThreats, currentThreats);
};

/**
 * Comprehensive check for any actual changes in the diagram
 * @param {Object} originalState - The original diagram state
 * @param {Object} currentState - The current diagram state
 * @returns {boolean} - True if there are actual changes, false otherwise
 */
export const hasActualChanges = (originalState, currentState) => {
    // If either state is missing, we can't determine changes
    if (!originalState || !currentState) return false;

    // 1. Check diagram structure changes
    const diagramChanged = hasDiagramChanges(
        originalState.selectedDiagram,
        currentState.selectedDiagram
    );

    if (diagramChanged) {
        return true;
    }

    // 2. Check for changes in any cell's threats
    if (originalState.selectedDiagram?.cells && currentState.selectedDiagram?.cells) {
        const originalCells = originalState.selectedDiagram.cells;
        const currentCells = currentState.selectedDiagram.cells;

        // Create maps for faster lookup
        const originalCellMap = new Map(
            originalCells.map(cell => [cell.id, cell])
        );
        const currentCellMap = new Map(
            currentCells.map(cell => [cell.id, cell])
        );

        // Check each cell for threat changes
        for (const [cellId, currentCell] of currentCellMap.entries()) {
            const originalCell = originalCellMap.get(cellId);
            if (hasCellThreatChanges(originalCell, currentCell)) {
                log.debug('Cell threats changed', { cellId });
                return true;
            }
        }
    }

    return false;
};

export default {
    deepCompare,
    hasDiagramChanges,
    hasThreatChanges,
    hasCellThreatChanges,
    hasActualChanges
};