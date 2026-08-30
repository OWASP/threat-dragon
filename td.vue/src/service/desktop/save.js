export const desktopDiagramSaveRequestEvent = 'td-save-diagram-request';

const isDiagramRoute = (routeName, providerName) => routeName === `${providerName}DiagramEdit`;

const requestSave = ({ routeName, providerName, saveModel, windowRef = window }) => {
    if (isDiagramRoute(routeName, providerName)) {
        windowRef.dispatchEvent(new windowRef.CustomEvent(desktopDiagramSaveRequestEvent));
        return 'diagram';
    }

    saveModel();
    return 'model';
};

export default {
    requestSave
};
