import desktopSave, { DESKTOP_DIAGRAM_SAVE_REQUEST_EVENT } from '@/service/desktop/save.js';

describe('service/desktop/save.js', () => {
    let saveModel;
    let windowRef;

    beforeEach(() => {
        saveModel = jest.fn();
        windowRef = {
            dispatchedEvents: [],
            CustomEvent: class {
                constructor(type) {
                    this.type = type;
                }
            },
            dispatchEvent(event) {
                this.dispatchedEvents.push(event);
            }
        };
    });

    it('dispatches a diagram save request event for desktop diagram routes', () => {
        const result = desktopSave.requestSave({
            routeName: 'desktopDiagramEdit',
            providerName: 'desktop',
            saveModel,
            windowRef
        });

        expect(result).toEqual('diagram');
        expect(saveModel).not.toHaveBeenCalled();
        expect(windowRef.dispatchedEvents.map((event) => event.type)).toEqual([DESKTOP_DIAGRAM_SAVE_REQUEST_EVENT]);
    });

    it('calls saveModel directly for non-diagram routes', () => {
        const result = desktopSave.requestSave({
            routeName: 'desktopThreatModelEdit',
            providerName: 'desktop',
            saveModel,
            windowRef
        });

        expect(result).toEqual('model');
        expect(saveModel).toHaveBeenCalledTimes(1);
        expect(windowRef.dispatchedEvents).toEqual([]);
    });
});
