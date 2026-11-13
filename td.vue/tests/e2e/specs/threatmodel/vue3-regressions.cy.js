const expectedRuntimeError = 'is not a function';

const installBrowserErrorCapture = () => {
    Cypress.once('window:before:load', (win) => {
        win.__tdObservedErrors = [];

        const pushError = (value) => {
            const message = value?.message || value?.reason?.message || value;
            win.__tdObservedErrors.push(String(message));
        };

        win.addEventListener('error', (event) => {
            pushError(event.error || event.message);
        });

        win.addEventListener('unhandledrejection', (event) => {
            pushError(event.reason);
        });

        win.addEventListener('securitypolicyviolation', (event) => {
            pushError(`${event.violatedDirective}: ${event.blockedURI}`);
        });

        const originalConsoleError = win.console.error.bind(win.console);
        win.console.error = (...args) => {
            args.forEach(pushError);
            originalConsoleError(...args);
        };
    });
};

const openDemoModel = (modelName) => {
    cy.get('#local-login-btn').click();
    cy.get('a[href="#/demo/select"]').click();
    cy.get(`[data-model-name="${modelName}"]`).click();
    cy.url().should('contain', `/local/${encodeURIComponent(modelName)}`);
    cy.get('#td-edit-btn').should('be.visible');
};

const openDiagramEditor = (diagramTitle) => {
    cy.contains('.diagram-edit', diagramTitle).click();
    cy.get('#graph-container').should('be.visible');
    cy.get('#graph-container .x6-graph-svg-stage')
        .children()
        .should('have.length.greaterThan', 0);
};

const resizeCanvas = (delta, dimension = 'height') => {
    const width = dimension === 'width';
    cy.get(`[data-resize="${width ? 'stencil' : 'graph-height'}"]`).then(($handle) => {
        const rect = $handle[0].getBoundingClientRect();
        const clientX = rect.x + rect.width / 2;
        const clientY = rect.y + rect.height / 2;

        cy.window().then((win) => {
            ['pointerdown', 'pointermove'].forEach((type) => {
                $handle[0].dispatchEvent(new win.PointerEvent(type, {
                    bubbles: true,
                    button: 0,
                    pointerId: 1,
                    clientX: width && type === 'pointermove' ? clientX + delta : clientX,
                    clientY: !width && type === 'pointermove' ? clientY + delta : clientY
                }));
            });

            return new Cypress.Promise((resolve) => win.requestAnimationFrame(resolve)).then(() => {
                const viewport = win.document.querySelector('.td-graph-viewport').getBoundingClientRect();
                const scroller = win.document.querySelector('.x6-graph-scroller').getBoundingClientRect();

                ['bottom', 'right'].forEach((edge) => {
                    expect(Math.abs(scroller[edge] - viewport[edge]), `${edge} scrollbar follows before pointerup`)
                        .to.be.lessThan(1);
                });
                $handle[0].dispatchEvent(new win.PointerEvent('pointerup', {
                    bubbles: true,
                    button: 0,
                    pointerId: 1,
                    clientX: width ? clientX + delta : clientX,
                    clientY: width ? clientY : clientY + delta
                }));
            });
        });
    });
};

const assertCanvasScrollbarsContained = () => {
    cy.get('.td-graph-viewport').should(($viewport) => {
        const viewport = $viewport[0].getBoundingClientRect();
        const scroller = $viewport[0].querySelector('.x6-graph-scroller').getBoundingClientRect();

        expect(Math.abs(scroller.bottom - viewport.bottom)).to.be.lessThan(1);
        expect(Math.abs(scroller.right - viewport.right)).to.be.lessThan(1);
    });
};

const assertDrawingFitsViewport = () => {
    cy.get('.x6-graph-scroller').should(($scroller) => {
        const scroller = $scroller[0];
        const viewport = scroller.getBoundingClientRect();
        const drawing = scroller.querySelector('.x6-graph-svg-stage').getBoundingClientRect();

        expect(drawing.width).to.be.greaterThan(0);
        expect(drawing.left).to.be.at.least(viewport.left);
        expect(drawing.top).to.be.at.least(viewport.top);
        expect(drawing.right).to.be.at.most(viewport.left + scroller.clientWidth);
        expect(drawing.bottom).to.be.at.most(viewport.top + scroller.clientHeight);
        expect(Math.abs(drawing.left + drawing.width / 2 - viewport.left - scroller.clientWidth / 2))
            .to.be.lessThan(3);
        expect(Math.abs(drawing.top + drawing.height / 2 - viewport.top - scroller.clientHeight / 2))
            .to.be.lessThan(3);
        expect(scroller.querySelector('.x6-graph-svg-viewport').getCTM().a).to.be.at.most(1);
    });
};

const assertCanvasBackgroundCoversViewport = () => {
    cy.get('.x6-graph-scroller').should(($scroller) => {
        const scroller = $scroller[0];
        const viewport = scroller.getBoundingClientRect();
        const viewportHost = scroller.closest('.td-graph-viewport');
        const background = scroller.querySelector('.x6-graph-scroller-background');
        const grid = scroller.querySelector('.x6-graph-grid');
        const win = scroller.ownerDocument.defaultView;

        expect(win.getComputedStyle(viewportHost).backgroundColor).to.equal('rgb(255, 255, 255)');
        expect(win.getComputedStyle(grid).backgroundImage).not.to.equal('none');
        [background, grid].forEach((layer) => {
            const rect = layer.getBoundingClientRect();
            expect(rect.left).to.be.at.most(viewport.left);
            expect(rect.top).to.be.at.most(viewport.top);
            expect(rect.right).to.be.at.least(viewport.left + scroller.clientWidth);
            expect(rect.bottom).to.be.at.least(viewport.top + scroller.clientHeight);
        });
    });
};

const selectGraphLabel = (labelPattern) => {
    cy.contains('#graph-container .x6-cell.x6-node tspan', labelPattern)
        .parents('g.x6-node')
        .first()
        .click({ force: true });
};

const assertSelectedGraphLabel = (expectedLabel) => {
    cy.get('#graph-container .x6-cell.x6-node.x6-node-selected tspan')
        .should(($labels) => {
            const labelText = [...$labels].map((label) => label.textContent).join('');
            expect(labelText.replace(/\s/g, ' ')).to.equal(expectedLabel);
        });
};

const assertImageHasDrawing = (source) => {
    return cy.window().then((win) => new Cypress.Promise((resolve, reject) => {
        const image = new win.Image();
        image.onerror = () => reject(new Error('Exported image could not be loaded'));
        image.onload = () => {
            const canvas = win.document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            let paintedPixels = 0;

            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] > 0 && (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250)) {
                    paintedPixels++;
                }
            }
            expect(paintedPixels, 'exported image contains visible diagram strokes').to.be.greaterThan(0);
            resolve();
        };
        image.src = source;
    }));
};

const assertNoObservedError = (matcher) => {
    cy.window().its('__tdObservedErrors').should((messages) => {
        expect(messages, 'captured browser errors').to.satisfy((errors) =>
            errors.every((message) => !message.includes(matcher))
        );
    });
};

const assertNoSecurityPolicyViolation = () => {
    cy.window().its('__tdObservedErrors').should((messages) => {
        expect(messages, 'captured browser errors').to.satisfy((errors) =>
            errors.every((message) => !message.includes('script-src') && !message.includes('javascript:'))
        );
    });
};

const assertNoJavascriptLinks = () => {
    cy.get('a[href^="javascript:"]').should('have.length', 0);
};

const withinVisibleModal = (callback) => {
    cy.get('.modal.show').should('have.length.at.least', 1).last().within(callback);
};

const selectAlternateThreatType = () => {
    cy.get('#threat-type option').should('have.length.greaterThan', 1);
    cy.get('#threat-type option').eq(1).invoke('text').then((optionText) => {
        cy.get('#threat-type').select(optionText, { force: true });
        cy.get('#threat-type option:selected').should('have.text', optionText);
    });
};

const addSeparatedFormTags = (fieldSelector, firstTag, secondTag) => {
    cy.get(`${fieldSelector} input[type="text"], ${fieldSelector}[type="text"]`)
        .last()
        .as('tagInput')
        .type(`${firstTag},${secondTag}`, { force: true });
    cy.contains(fieldSelector, firstTag).should('be.visible');
    cy.get('@tagInput').should('have.value', secondTag);
    cy.get('@tagInput').type('{enter}', { force: true });
    cy.contains(fieldSelector, secondTag).should('be.visible');
};

describe('Regressions discovered during vue3 migration', () => {
    beforeEach(() => {
        installBrowserErrorCapture();
        cy.visit('/');
    });

    it('updates threat edit radio and select controls without runtime errors', () => {
        openDemoModel('Demo Threat Model');
        assertNoJavascriptLinks();
        openDiagramEditor('Main Request Data Flow');
        assertNoJavascriptLinks();
        selectGraphLabel(/Database/);
        assertNoJavascriptLinks();

        cy.contains('.threat-card a', 'Unauthorised access').click();
        withinVisibleModal(() => {
            selectAlternateThreatType();
            cy.get('#status button.td-dropdown-toggle').click();
            cy.get('#status .td-dropdown-menu').contains('button', 'Mitigated').click();
            cy.get('#status button.td-dropdown-toggle').should('contain', 'Mitigated');
            cy.get('#severity input[type="radio"]').check('Low', { force: true });
            cy.get('#severity input[type="radio"][value="Low"]').should('be.checked');
        });

        assertNoObservedError(expectedRuntimeError);
    });

    it('updates threat suggestion controls without runtime errors', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');
        selectGraphLabel(/Database/);

        cy.contains('a.new-threat-by-type', 'New Threat by Type').click();
        withinVisibleModal(() => {
            selectAlternateThreatType();
            cy.get('#status button.td-dropdown-toggle').click();
            cy.get('#status .td-dropdown-menu').contains('button', 'Mitigated').click();
            cy.get('#status button.td-dropdown-toggle').should('contain', 'Mitigated');
            cy.get('#severity input[type="radio"]').check('Low', { force: true });
            cy.get('#severity input[type="radio"][value="Low"]').should('be.checked');
        });

        assertNoObservedError(expectedRuntimeError);
    });

    it('updates the selected component label on every name keystroke', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');
        selectGraphLabel(/Database/);

        cy.get('#name').clear();
        cy.get('#name').type('D');
        assertSelectedGraphLabel('D');
        cy.get('#name').type('B');
        assertSelectedGraphLabel('DB');
        cy.get('#name').type('2');
        assertSelectedGraphLabel('DB2');
    });

    it('keeps the stencil and canvas scrollbars available while resizing the canvas', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');

        cy.get('.x6-widget-stencil-content').should(($content) => {
            expect($content[0].scrollHeight).to.be.greaterThan($content[0].clientHeight);
        });
        cy.get('.x6-widget-stencil-content').then(($content) => {
            $content[0].scrollTop = $content[0].scrollHeight;
            expect($content[0].scrollTop).to.be.greaterThan(0);
        });

        let initialCanvasHeight;
        let initialMetaHeight;
        cy.get('.x6-graph-scroller').should(($scroller) => {
            expect($scroller[0].scrollWidth).to.be.greaterThan($scroller[0].clientWidth);
        }).then(($scroller) => {
            initialCanvasHeight = $scroller[0].clientHeight;
            cy.get('.td-graph-meta').then(($meta) => {
                initialMetaHeight = $meta[0].getBoundingClientRect().height;
            });
        });

        cy.get('[data-resize="graph-height"]')
            .should('have.attr', 'aria-label', 'Resize canvas height');
        cy.window().then((win) => {
            cy.stub(win.HTMLElement.prototype, 'setPointerCapture').callsFake(() => {});
            cy.stub(win.HTMLElement.prototype, 'releasePointerCapture').callsFake(() => {});
        });
        resizeCanvas(80);

        cy.get('[data-resize="graph-height"]').should('have.attr', 'aria-valuenow', '80');
        cy.get('.x6-graph-scroller').should(($scroller) => {
            expect($scroller[0].clientHeight).to.be.greaterThan(initialCanvasHeight);
        });
        assertCanvasScrollbarsContained();

        resizeCanvas(-160);
        cy.get('[data-resize="graph-height"]').should('have.attr', 'aria-valuenow', '-80');
        cy.get('.x6-graph-scroller').should(($scroller) => {
            expect($scroller[0].clientHeight).to.be.lessThan(initialCanvasHeight);
        });
        assertCanvasScrollbarsContained();
        cy.get('.x6-widget-stencil-content').then(($content) => {
            $content[0].scrollTop = $content[0].scrollHeight;
            expect($content[0].scrollTop).to.be.greaterThan(0);
        });
        cy.get('.td-graph-meta').should(($meta) => {
            expect($meta[0].getBoundingClientRect().height).to.equal(initialMetaHeight);
        });
        cy.get('.x6-graph-scroller').then(($scroller) => {
            cy.get('[data-resize="graph-height"]').then(($handle) => {
                expect($handle[0].getBoundingClientRect().top)
                    .to.be.greaterThan($scroller[0].getBoundingClientRect().bottom);
            });
        });
    });

    it('keeps the right scrollbar attached while widening and narrowing the canvas', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');

        let initialWidth;
        let initialRight;
        cy.get('.td-graph-viewport').then(($viewport) => {
            const rect = $viewport[0].getBoundingClientRect();
            initialWidth = rect.width;
            initialRight = rect.right;
        });
        cy.window().then((win) => {
            cy.stub(win.HTMLElement.prototype, 'setPointerCapture').callsFake(() => {});
            cy.stub(win.HTMLElement.prototype, 'releasePointerCapture').callsFake(() => {});
        });

        resizeCanvas(-80, 'width');
        cy.get('.td-graph-viewport').should(($viewport) => {
            const rect = $viewport[0].getBoundingClientRect();
            expect(rect.width).to.be.greaterThan(initialWidth);
            expect(Math.abs(rect.right - initialRight)).to.be.lessThan(1);
        });
        assertCanvasScrollbarsContained();

        resizeCanvas(160, 'width');
        cy.get('.td-graph-viewport').should(($viewport) => {
            const rect = $viewport[0].getBoundingClientRect();
            expect(rect.width).to.be.lessThan(initialWidth);
            expect(Math.abs(rect.right - initialRight)).to.be.lessThan(1);
        });
        assertCanvasScrollbarsContained();
    });

    it('keeps the first touch drag active when another touch moves or ends', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');
        cy.window().then((win) => {
            cy.stub(win.HTMLElement.prototype, 'setPointerCapture').callsFake(() => {});
            cy.stub(win.HTMLElement.prototype, 'releasePointerCapture').callsFake(() => {}).as('releaseResizePointer');
        });

        cy.get('[data-resize="graph-height"]').then(($handle) => {
            const handle = $handle[0];
            const rect = handle.getBoundingClientRect();

            cy.window().then((win) => {
                const pointer = (type, pointerId, delta = 0) => handle.dispatchEvent(new win.PointerEvent(type, {
                    bubbles: true,
                    button: 0,
                    pointerType: 'touch',
                    pointerId,
                    clientX: rect.x + rect.width / 2,
                    clientY: rect.y + rect.height / 2 + delta
                }));
                const nextFrame = () => new Cypress.Promise((resolve) => win.requestAnimationFrame(resolve));

                pointer('pointerdown', 1);
                pointer('pointerdown', 2, 60);
                pointer('pointermove', 2, 160);
                return nextFrame().then(() => {
                    expect(handle.getAttribute('aria-valuenow')).to.equal('0');
                    pointer('pointerup', 2);
                    pointer('pointercancel', 2);
                    pointer('pointermove', 1, 80);
                    return nextFrame().then(() => {
                        expect(handle.getAttribute('aria-valuenow')).to.equal('80');
                        pointer('pointerup', 1, 80);
                    });
                });
            });
        });
        cy.get('@releaseResizePointer').should('have.been.calledOnceWithExactly', 1);
        assertCanvasScrollbarsContained();
    });

    it('resizes stencil width in both directions on a large display', () => {
        cy.viewport(3600, 2000);
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');

        cy.get('.td-graph-editor').should(($editor) => {
            expect($editor[0].clientWidth).to.be.greaterThan(3500);
        });
        cy.get('.td-graph-stencil').should('have.css', 'width', '480px');
        cy.window().then((win) => {
            cy.stub(win.HTMLElement.prototype, 'setPointerCapture').callsFake(() => {});
            cy.stub(win.HTMLElement.prototype, 'releasePointerCapture').callsFake(() => {});
        });

        resizeCanvas(-80, 'width');
        cy.get('.td-graph-stencil').should('have.css', 'width', '400px');
        resizeCanvas(160, 'width');
        cy.get('.td-graph-stencil').should('have.css', 'width', '560px');

        cy.get('[data-resize="stencil"]').trigger('keydown', { key: 'Home' });
        cy.get('.td-graph-stencil').should('have.css', 'width', '320px');
        cy.get('[data-resize="stencil"]').trigger('keydown', { key: 'End' });
        cy.get('.td-graph-stencil').should('have.css', 'width', '740px');
        assertCanvasScrollbarsContained();
    });

    it('resizes a canvas taller than 1000px in both directions', () => {
        cy.viewport(3600, 2000);
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');

        cy.get('.td-graph-viewport').should('have.css', 'height', '1300px');
        cy.window().then((win) => {
            cy.stub(win.HTMLElement.prototype, 'setPointerCapture').callsFake(() => {});
            cy.stub(win.HTMLElement.prototype, 'releasePointerCapture').callsFake(() => {});
        });

        resizeCanvas(-80);
        cy.get('.td-graph-viewport').should('have.css', 'height', '1220px');
        resizeCanvas(160);
        cy.get('.td-graph-viewport').should('have.css', 'height', '1380px');

        cy.get('[data-resize="graph-height"]').trigger('keydown', { key: 'Home' });
        cy.get('.td-graph-viewport').should('have.css', 'height', '1060px');
        cy.get('[data-resize="graph-height"]').trigger('keydown', { key: 'End' });
        cy.get('.td-graph-viewport').should('have.css', 'height', '1800px');
        assertCanvasScrollbarsContained();
    });

    it('provides visible resize targets sized for the available pointer', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');

        cy.window().then((win) => {
            const minimumSize = win.matchMedia('(any-pointer: coarse)').matches ? 44 : 20;

            cy.get('.td-resize-handle:visible').each(($handle) => {
                const rect = $handle[0].getBoundingClientRect();
                const horizontal = $handle.attr('aria-orientation') === 'horizontal';
                const size = horizontal ? rect.height : rect.width;

                expect(size).to.be.at.least(minimumSize);
                expect(win.getComputedStyle($handle[0]).cursor).to.equal(horizontal ? 'row-resize' : 'col-resize');
            });
        });
    });

    it('opens with the complete drawing centered without resetting later zoom choices', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');
        assertDrawingFitsViewport();

        cy.get('button[title="Zoom out"]').click();
        cy.get('#graph-container .x6-graph-svg-viewport').then(($viewport) => {
            const scale = $viewport[0].getCTM().a;
            selectGraphLabel(/Database/);
            cy.get('#graph-container .x6-graph-svg-viewport').should(($updated) => {
                expect($updated[0].getCTM().a).to.equal(scale);
            });
        });
    });

    ['SVG', 'PNG'].forEach((format) => {
        it(`exports a visible ${format} drawing with negative coordinates through the dropdown`, () => {
            const diagramTitle = `${format} export ${Date.now()}`;
            const extension = format.toLowerCase();
            cy.get('#local-login-btn').click();
            cy.get('a[href="#/local/threatmodel/import"]').click();
            cy.fixture('v2-model').then((model) => {
                const diagram = model.detail.diagrams[0];
                diagram.title = diagramTitle;
                diagram.cells = diagram.cells.filter((cell) => cell.position).slice(0, 2);
                diagram.cells[0].position = { x: -1600, y: -900 };
                diagram.cells[1].position = { x: -300, y: -100 };
                model.detail.diagrams = [diagram];

                cy.get('#json-input').invoke('val', JSON.stringify(model)).trigger('input');
                cy.get('#td-import-btn').click();
                openDiagramEditor(diagramTitle);
                selectGraphLabel(/Web\sApplication/);

                cy.get('#graph-container .x6-graph-svg-viewport').then(($viewport) => {
                    const matrix = $viewport[0].getCTM();
                    const scale = matrix.a;
                    expect(matrix.e !== 0 || matrix.f !== 0, 'editor has a translated viewport').to.equal(true);

                    cy.get('#export-graph-btn .td-dropdown-toggle').click();
                    cy.get(`#export-graph-${extension}`).should('be.visible').click();
                    cy.get('#export-graph-btn .td-dropdown-toggle').should('have.attr', 'aria-expanded', 'false');
                    const encoding = format === 'SVG' ? 'utf8' : 'base64';
                    cy.readFile(`${Cypress.config('downloadsFolder')}/${diagramTitle}.${extension}`, encoding)
                        .then((content) => {
                            if (format === 'SVG') {
                                const svg = new DOMParser().parseFromString(content, 'image/svg+xml');

                                expect(svg.querySelector('parsererror')).to.equal(null);
                                expect(svg.querySelectorAll('.x6-node')).to.have.length(2);
                                expect(svg.documentElement.textContent.replace(/\s/g, ' ')).to.include('Web Application');
                                return assertImageHasDrawing(`data:image/svg+xml,${encodeURIComponent(content)}`);
                            }
                            return assertImageHasDrawing(`data:image/png;base64,${content}`);
                        });
                    cy.get('#graph-container .x6-graph-svg-viewport').should(($updated) => {
                        expect($updated[0].getCTM().a).to.equal(scale);
                    });
                    assertSelectedGraphLabel('Web Application');
                });
            });
            cy.window().its('__tdObservedErrors').should('deep.equal', []);
        });
    });

    it('fits drawings with negative coordinates on entry', () => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/local/threatmodel/import"]').click();
        cy.fixture('v2-model').then((model) => {
            const diagram = model.detail.diagrams[0];
            const nodes = diagram.cells.filter((cell) => cell.position).slice(0, 2);
            nodes[0].position = { x: -1600, y: -900 };
            nodes[1].position = { x: -300, y: -100 };
            diagram.cells = nodes;
            model.detail.diagrams = [diagram];

            cy.get('#json-input').invoke('val', JSON.stringify(model)).trigger('input');
            cy.get('#td-import-btn').click();
            openDiagramEditor(diagram.title);
            assertDrawingFitsViewport();
        });
    });

    it('keeps the canvas background visible across scrolling and zooming', () => {
        openDemoModel('Demo Threat Model');
        openDiagramEditor('Main Request Data Flow');
        assertCanvasBackgroundCoversViewport();

        cy.get('button[title="Zoom out"]').click();
        cy.get('.x6-graph-scroller').scrollTo('bottomRight');
        assertCanvasBackgroundCoversViewport();
        cy.get('.x6-graph-scroller').scrollTo('topLeft');
        assertCanvasBackgroundCoversViewport();

        cy.get('button[title="Toggle grid"]').click();
        cy.get('.td-graph-viewport').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });

    it('shows the full background for an empty diagram', () => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/local/threatmodel/import"]').click();
        cy.fixture('v2-model').then((model) => {
            const diagram = model.detail.diagrams[0];
            diagram.cells = [];
            model.detail.diagrams = [diagram];

            cy.get('#json-input').invoke('val', JSON.stringify(model)).trigger('input');
            cy.get('#td-import-btn').click();
            cy.contains('.diagram-edit', diagram.title).click();
            cy.get('.x6-graph-scroller').should('be.visible');
            assertCanvasBackgroundCoversViewport();
        });
    });

    it('does not render javascript: links in the exercised threat-model flows', () => {
        assertNoJavascriptLinks();

        openDemoModel('Demo Threat Model');
        assertNoJavascriptLinks();

        openDiagramEditor('Main Request Data Flow');
        assertNoJavascriptLinks();
        selectGraphLabel(/Database/);
        assertNoJavascriptLinks();

        cy.contains('.threat-card a', 'Unauthorised access')
            .should('have.attr', 'href', '#');
    });

    it('updates Bootstrap contributor tags without runtime errors', () => {
        openDemoModel('Demo Threat Model');

        cy.get('#td-edit-btn').click();
        addSeparatedFormTags('#contributors', 'a', 'b');

        assertNoObservedError(expectedRuntimeError);
        assertNoSecurityPolicyViolation();
    });
});
