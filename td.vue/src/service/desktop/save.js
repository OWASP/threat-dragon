export const DESKTOP_DIAGRAM_SAVE_REQUEST_EVENT = 'td-save-diagram-request';

const isDiagramRoute = (routeName, providerName) => routeName === `${providerName}DiagramEdit`;

const requestSave = ({ routeName, providerName, saveModel, windowRef = window }) => {
    if (isDiagramRoute(routeName, providerName)) {
        windowRef.dispatchEvent(new windowRef.CustomEvent(DESKTOP_DIAGRAM_SAVE_REQUEST_EVENT));
        return 'diagram';
    }

    saveModel();
    return 'model';
};

export default {
    requestSave
};
