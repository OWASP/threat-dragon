const eng = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    nav: {
        v2Warning:
            'Version 2.0 threat models are not backwardly compatible with version 1.x Threat Dragon models. Imported version 1.x models will be upgraded to the version 2.0 schema',
        loggedInAs: 'Logged in as',
        logOut: 'Log out',
        tos: 'Terms of Service',
        privacy: 'Privacy Policy'
    },
    operator: {
        heading: 'Operator',
        operatedby: 'This web site and instance of OWASP Threat Dragon is operated by:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'the operator of this web site'}`,
        contact: 'Contact: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(contact information not provided)'),
    },
    tos: {
        title: 'Terms of Service',
        lastUpdated: 'April 4, 2025',
        introduction: 'Welcome to our instance of OWASP Threat Dragon. These Terms of Use ("Terms") govern your access to and use of this web site, which is an instance of an open-source web application made available by the operator listed above ("The Operator").',
        sections: [
            {
                heading: '1. Acceptance of Terms',
                content: 'By accessing and using this web site, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this web site.'
            },
            {
                heading: '2. Use of the Web Site',
                content: 'You may use the web site for lawful purposes only. You agree not to misuse, disrupt, or attempt to gain unauthorized access to the web site or its underlying systems.'
            },
            {
                heading: '3. No Warranty',
                content: 'The web site is provided "as is" without warranties of any kind, express or implied, including but not limited to fitness for a particular purpose, availability, or accuracy. We do not guarantee uninterrupted or error-free operation.'
            },
            {
                heading: '4. Limitation of Liability',
                content: 'To the fullest extent permitted by law, The Operator shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of or inability to use the web site.'
            },
            {
                heading: '5. Open Source Software',
                content: 'This web site runs the OWASP Threat Dragon software, and its source code is available at https://www.github.com/OWASP/threat-dragon. Your use of the software is subject to its open-source license terms. We are not responsible for the software itself, only for operating this instance. The operator of this web site is not affiliated with OWASP.'
            },
            {
                heading: '6. Changes to Terms',
                content: 'The Operator may update these Terms at any time. Continued use of the web site after changes constitutes acceptance of the updated Terms.'
            },
            {
                heading: '7. Termination',
                content: 'The Operator reserves the right to suspend or terminate access to the web site at The Operator\'s discretion, without notice, for any reason.'
            },
            {
                heading: '8. Governing Law',
                content: 'These Terms are governed by the laws of the jurisdiction in which The Operator is headquartered (in the case of an organization) or resides (in the case of an individual), without regard to conflict of law principles.'
            }
        ],
        contact: 'If you have any questions about these Terms, please contact the operator.'
    },
    privacy: {
        title: 'Privacy Policy',
        lastUpdated: 'April 4, 2025',
        introduction: 'The Operator of this web site is committed to protecting your privacy. This Privacy Policy explains how your information is handled.',
        sections: [
            {
                heading: 'Minimal Data Use for Operations',
                content: 'The Operator does not collect, store, or process personal data from users for tracking, profiling, or sharing with third parties. Temporary logs, which may include IP addresses or usernames, are generated solely for operational and debugging purposes. These logs are discarded within a short period of time and are not retained or used beyond these limited purposes.'
            },
            {
                heading: 'Legal Compliance',
                content: 'The Operator will only disclose information if required to do so by law, such as in response to a valid government order or subpoena. In such cases, The Operator will comply with applicable legal obligations.'
            },
            {
                heading: 'Changes to This Policy',
                content: 'The Operator may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.'
            },
            {
                heading: 'Contact Us',
                content: 'If you have any questions about this Privacy Policy, please contact the operator.'
            }
        ]
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description:
            'OWASP Threat Dragon is a free, open-source, cross-platform application for creating threat models. Use it to draw threat modeling diagrams and to identify threats for your system. With an emphasis on flexibility and simplicity it is easily accessible for all types of users.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Start'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Login with'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Login with'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Login with'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Login with'
        },
        local: {
            displayName: 'Local Session',
            loginWith: 'Login to'
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'Open',
            description: 'Select a threat model file or destination folder from Google Drive',
            saveThreatModel: 'Save Threat Model to Google Drive',
            saveDescription: 'Select a folder in Google Drive to save your threat model',
            fileName: 'File Name',
            fileNamePlaceholder: 'Enter a name for your file',
            selectFolder: 'Select a folder in Google Drive',
            selectFile: 'Select a file from Google Drive',
            selectThreatModel: 'Select a Threat Model from Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'Welcome!',
            description:
                "You're ready to start making your application designs more secure. You can open an existing threat model or create a new one by choosing one of the options below. "
        },
        actions: {
            openExisting: 'Open an existing threat model',
            createNew: 'Create a new, empty threat model',
            readDemo: 'Explore a sample threat model',
            importExisting: 'Import a threat model via JSON'
        }
    },
    demo: {
        select: 'Select a demo threat model from the list below'
    },
    desktop: {
        file: {
            heading: 'File',
            clearRecentDocs: 'Clear Menu',
            close: 'Close Model',
            closeWindow: 'Close Window',
            new: 'New Model',
            open: 'Open Model',
            recentDocs: 'Open Recent',
            save: 'Save Model',
            saveAs: 'Save Model As'
        },
        help: {
            heading: 'Help',
            docs: 'Documentation',
            visit: 'Visit us at OWASP',
            sheets: 'OWASP Cheat Sheets',
            github: 'Visit us on GitHub',
            submit: 'Submit an Issue',
            check: 'Check for updates ...',
            about: {
                about: 'About',
                version: 'Version'
            }
        }
    },
    repository: {
        select: 'Select a',
        from: 'repository from the list below',
        noneFound: 'No repositories found. To get started, create a new repository on'
    },
    branch: {
        select: 'Select a branch from',
        from: 'from the list below or',
        chooseRepo: 'choose another repo',
        or: 'or',
        addNew: 'add a new branch',
        protectedBranch: 'Protected branch',
        refBranch: 'Reference branch',
        nameRequired: 'Branch name is required',
        nameExists: 'Branch name already exists',
        add: 'add branch',
        cancel: 'Cancel',
        name: 'branch name'
    },
    folder: {
        select: 'Select a',
        from: 'folder from the list below',
        noneFound: 'This folder is empty, You can create a new threat model here.'
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
        contributors: 'Contributors',
        contributorsPlaceholder: 'Start typing to add a contributor',
        description: 'High level system description',
        dragAndDrop: 'Drag and drop or ',
        jsonPaste: 'Drop a threat model JSON file or paste its content here:',
        owner: 'Owner',
        reviewer: 'Reviewer',
        title: 'Title',
        new: {
            title: 'Create New Threat Model',
            description: 'Enter information about your new threat model'
        },
        edit: {
            title: 'Edit Threat Model',
            description: 'Modify information about your threat model'
        },
        placeholder: {
            title: 'Threat Model Title',
            owner: 'Owner Name or Team',
            description: 'Enter a high-level description of the system being modeled',
            reviewer: 'Reviewer Name'
        },
        diagram: {
            diagrams: 'Diagrams',
            addNewDiagram: 'Add a new diagram...',
            generic: {
                defaultTitle: 'New generic diagram',
                defaultDescription: 'New generic diagram description',
                select: 'Generic'
            },
            stride: {
                defaultTitle: 'New STRIDE diagram',
                defaultDescription: 'New STRIDE diagram description',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'New LINDDUN diagram',
                defaultDescription: 'New LINDDUN diagram description',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'New PLOT4ai diagram',
                defaultDescription: 'New PLOT4ai diagram description',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'New DIE diagram',
                defaultDescription: 'New DIE diagram description',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'New CIA diagram',
                defaultDescription: 'New CIA diagram description',
                select: 'CIA'
            }
        },
        threats: 'Threats',
        errors: {
            dropSingleFileOnly: 'Drag and drop requires a single file.',
            invalidJson: 'Invalid JSON. Please check your model and try again.',
            onlyJsonAllowed: 'Only files that end with .json are supported.',
            open: 'Error opening this Threat Model. Check the developer console for more information',
            save: 'Error saving the Threat Model. Check the developer console for more information',
            googleDriveSave: 'Error saving to Google Drive. Make sure you have proper permissions.',
            invalidFormat: 'The selected file is not a valid threat model. Please select a proper threat model file.',
            fetch: 'Error fetching the threat model. Please try again or select a different file.',
            fileNotFound: 'The requested threat model file was not found. Please check the file path and try again.',
            unexpectedFormat: 'Unexpected response format from the repository. Please contact the administrator.'
        },
        localFilePicker: {
            title: 'Select a Threat Model File',
            noFiles: 'No files in this directory',
            errors: {
                loadDirectory: 'Error loading directory. Please try again.'
            }
        },
        opened: 'Threat model successfully opened',
        saved: 'Threat model successfully saved',
        properties: {
            title: 'Properties',
            emptyState: 'Select an element on the graph to edit',
            name: 'Name',
            text: 'Text',
            description: 'Description',
            outOfScope: 'Out of Scope',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Reason for out of scope',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'Is a Log',
            isEncrypted: 'Encrypted',
            isSigned: 'Signed',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Privilege Level',
            providesAuthentication: 'Provides Authentication',
            protocol: 'Protocol',
            publicNetwork: 'Public Network',
            storesCredentials: 'Stores Credentials',
            storesInventory: 'Stores Inventory'
        },
        controlButtons: {
            delete: 'Delete selected',
            redo: 'Redo edit',
            shortcuts: 'Keyboard shortcuts',
            toggleGrid: 'Toggle grid',
            undo: 'Undo edit',
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out',
            save: 'Save'
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
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            title: 'Shapes',
            boundaries: 'Boundaries',
            components: 'Components',
            entities: 'Entities',
            metadata: 'Metadata',
            search: 'Search shapes',
            notFound: "We don't have that yet, want to open an issue? :)"
        },
        shapes: {
            actor: 'Actor',
            flow: 'Data Flow',
            flowStencil: 'Data Flow',
            process: 'Process',
            store: 'Store',
            text: 'Descriptive text',
            trustBoundary: 'Trust Boundary'
        }
    },
    forms: {
        apply: 'Apply',
        cancel: 'Cancel',
        close: 'Close',
        closeModel: 'Close Model',
        create: 'Create',
        delete: 'Delete',
        discardTitle: 'Discard Changes?',
        discardMessage: 'Are you sure you want to discard your changes?',
        edit: 'Edit',
        export: 'Export',
        exportAs: 'Export Model As',
        exportHtml: 'HTML Report',
        exportPdf: 'PDF Report',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        exportFormats: {
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG'
        },
        import: 'Import',
        ok: 'OK',
        open: 'Open',
        openModel: 'Open Model',
        print: 'Print',
        reload: 'Reload',
        remove: 'Remove',
        report: 'Report',
        save: 'Save',
        saveAs: 'Save As',
        saveModel: 'Save Model',
        saveModelAs: 'Save Model As',
        search: 'Search',
        next: 'Next',
        previous: 'Previous',
        requiredField: 'Required field'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentiality',
                integrity: 'Integrity',
                availability: 'Availability'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distributed',
                immutable: 'Immutable',
                ephemeral: 'Ephemeral'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Linkability',
                identifiability: 'Identifiability',
                nonRepudiation: 'Non-repudiation',
                detectability: 'Detectability',
                disclosureOfInformation: 'Disclosure of information',
                unawareness: 'Unawareness',
                nonCompliance: 'Non-compliance'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Technique & Processes',
                accessibility: 'Accessibility',
                identifiabilityLinkability: 'Identifiability & Linkability',
                security: 'Security',
                safety: 'Safety',
                unawareness: 'Unawareness',
                ethicsHumanRights: 'Ethics & Human Rights',
                nonCompliance: 'Non-compliance'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'Spoofing',
                tampering: 'Tampering',
                repudiation: 'Repudiation',
                informationDisclosure: 'Information disclosure',
                denialOfService: 'Denial of service',
                elevationOfPrivilege: 'Elevation of privilege'
            }
        },
        generic: {
            default: 'New generic threat',
            cia: 'New CIA threat',
            die: 'New DIE threat',
            linddun: 'New LINDDUN threat',
            plot4ai: 'New PLOT4ai threat',
            stride: 'New STRIDE threat'
        },
        new: 'New Threat',
        edit: 'Edit Threat',
        confirmDeleteTitle: 'Confirm Delete',
        confirmDeleteMessage: 'Are you sure you really want to delete this threat?',
        description: 'Provide a description for this threat',
        emptyThreat: 'Select an element on the graph to add a threat',
        mitigation: 'Provide remediation for this threat or a reason if status is N/A',
        newThreat: 'New Threat',
        newThreatByType: 'New Threat by Type',
        newThreatByContext: 'New Threat by Context',
        properties: {
            description: 'Description',
            mitigation: 'Mitigations',
            modelType: 'Model Type',
            number: 'Number',
            priority: 'Priority',
            score: 'Score',
            status: 'Status',
            title: 'Title',
            type: 'Type'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Open',
            mitigated: 'Mitigated'
        },
        priority: {
            tbd: 'TBD',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            critical: 'Critical'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Show out of scope elements',
            showMitigatedThreats: 'Show mitigated threats',
            showModelDiagrams: 'Show model diagrams',
            showEmpty: 'Show empty elements',
            showProperties: 'Show element properties',
            showBranding: 'Threat Dragon logo'
        },
        title: 'Threat model report for',
        dateGenerated: 'Date Generated',
        executiveSummary: 'Executive Summary',
        notProvided: 'Not provided',
        summary: 'Summary',
        threatStats: {
            total: 'Total Threats',
            mitigated: 'Total Mitigated',
            notMitigated: 'Not Mitigated',
            openCritical: 'Open / Critical Priority',
            openHigh: 'Open / High Priority',
            openMedium: 'Open / Medium Priority',
            openLow: 'Open / Low Priority',
            openTbd: 'Open / TBD Priority',
            openUnknown: 'Open / Unknown Priority'
        }
    },
    pagination: {
        previous: 'Previous',
        next: 'Next'
    }
};

export default eng;
