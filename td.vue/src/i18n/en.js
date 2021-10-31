const en = {
    auth: {
        sessionExpired: 'Your session has expired.  Please log in again to continue.'
    },
    nav: {
        v2Warning: 'This is version 2.0 of OWASP Threat Dragon and is still under development.  Do not use this to edit existing models, as this version could break them!',
        loggedInAs: 'Logged in as'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'Threat Dragon is a free, open-source threat modeling tool from OWASP. It can be used as a standalone desktop app for Windows, MacOS and Linux or as a web application. The desktop app is great if you want to try the application without giving it access to your GitHub repos, but if you choose the online version you get to unleash the awesome power of GitHub on your threat models! Obviously, to do this you need to log in first.',
        loginWith: 'Login with'
    },
    providers: {
        github: {
            displayName: 'GitHub',
        },
        local: {
            displayName: 'Local Session'
        }
    },
    dashboard: {
        welcome: {
            title: 'Welcome!',
            description: 'You\'re ready to start making your application designs more secure. You can open an existing threat model or create a new one by choosing one of the options below. '
        },
        actions: {
            openExisting: 'Open an existing threat model',
            createNew: 'Create a new, empty threat model',
            demo: 'Explore a sample threat model',
            import: 'Import a threat model via JSON'
        }
    },
    demo: {
        select: 'Select a demo threat model from the list below'
    },
    repository: {
        select: 'Select a',
        from: 'repository from the list below',
        noneFound: 'No repositories found.  To get started, create a new repository on'
    },
    branch: {
        select: 'Select a branch from',
        from: 'from the list below or',
        chooseRepo: 'choose another repo'
    },
    threatmodelSelect: {
        select: 'Select a Threat Model from',
        from: 'from the list below, or choose another',
        branch: 'branch',
        or: 'or',
        repo: 'repo',
        newThreatModel: 'Create a New Threat Model'
    },
    threatmodel: {
        jsonPaste: 'Paste the JSON of your threat model here:',
        invalidJson: 'Invalid JSON.  Please check your model and try again.',
        owner: 'Owner',
        reviewer: 'Reviewer',
        contributors: 'Contributors',
        contributorsPlaceholder: 'Add a new contributor',
        description: 'High level system description',
        editing: 'Editing',
        title: 'Title',
        diagrams: 'Diagrams',
        addNewDiagram: 'Add a new diagram...',
        threats: 'Threats',
        properties: {
            title: 'Properties',
            emptyState: 'Select an element on the graph to edit',
            name: 'Name',
            text: 'Text',
            description: 'Description',
            outOfScope: 'Out of Scope',
            reasonOutOfScope: 'Reason for out of scope',
            privilegeLevel: 'Privilege Level',
            isALog: 'Is a Log',
            storesCredentials: 'Stores Credentials',
            isEncrypted: 'Encrypted',
            isSigned: 'Signed',
            providesAuthentication: 'Provides Authentication',
            protocol: 'Protocol',
            publicNetwork: 'Public Network'
        },
        buttons: {
            shortcuts: 'Keyboard Shortcuts',
            undo: 'Undo',
            redo: 'Redo',
            zoomIn: 'Zoom In',
            zoomOut: 'Zoom Out',
            toggleGrid: 'Toggle Grid'
        },
        shortcuts: {
            title: 'Shortcuts',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Copy'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Paste'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Undo'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Redo'
            },
            delete: {
                shortcut: 'del',
                action: 'Delete'
            },
            pan: {
                shortcut: 'shift + left-click (hold/drag)',
                action: 'Pan'
            },
            multiSelect: {
                shortcut: 'left-click on empty space and drag',
                action: 'Multi-select'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + mousewheel',
                action: 'Zoom'
            }
        },
        stencil: {
            entities: 'Entities',
            boundaries: 'Boundaries',
            metadata: 'Metadata',
            search: 'Search',
            notFound: 'We don\'t have that yet, want to open an issue? :)'
        },
        shapes: {
            actor: 'Actor',
            flowStencil: 'Data Flow',
            process: 'Process',
            store: 'Store',
            text: 'Arbitrary Text',
            trustBoundary: 'Trust Boundary'
        }
    },
    forms: {
        edit: 'Edit',
        report: 'Report',
        delete: 'Delete',
        remove: 'Remove',
        save: 'Save',
        reload: 'Reload',
        cancel: 'Cancel',
        close: 'Close',
        search: 'Search',
        import: 'Import'
    },
    threats: {
        models: {
            confidentiality: 'Confidentiality',
            integrity: 'Integrity',
            availability: 'Availability',
            linkability: 'Linkability',
            identifiability: 'Identifiability',
            nonRepudiation: 'Non-Repudiation',
            detectability: 'Detectability',
            disclosureOfInformation: 'Disclosure Of Information',
            unawareness: 'Unawareness',
            nonCompliance: 'Non-Compliance',
            spoofing: 'Spoofing',
            tampering: 'Tampering',
            repudiation: 'Repudiation',
            informationDisclosure: 'Information Disclosure',
            denialOfService: 'Denial Of Service',
            elevationOfPrivilege: 'Elevation Of Privilege'
        },
        edit: 'Edit Threat',
        confirmDeleteTitle: 'Confirm Delete',
        confirmDeleteMessage: 'Are you sure you really want to delete this threat?',
        newThreat: 'New Threat'
    }
};

export default en;
