const el = {
    auth: {
        sessionExpired: 'Your session has expired.  Please log in again to continue.'
    },
    nav: {
        v2Warning: 'Αυτή είναι η έκδοση 2.0 του OWASP Threat Dragon και είναι ακόμα υπό ανάπτυξη. Μην την χρησιμοποιείτε για να τροποποιήσετε υπάρχοντα μοντέλα, καθώς αυτή η έκδοση μπορεί να τα χαλάσει!',
        loggedInAs: 'Σύνδεση ως'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'Το Threat Dragon είναι ένα δωρεάν, ανοιχτού κώδικα εργαλείο μοντελοποίησης απειλών (threat modeling) του Οργανισμού OWASP. Μπορεί να χρησιμοποιηθεί ως μια αυτόνομη desktop εφαρμογή για Windows, MacOS και Linux ή ως μια web εφαρμογή. Η desktop εφαρμογή είναι ιδανική αν θέλετε να δοκιμάσετε την εφαρμογή χωρίς να της δώσετε πρόσβαση στα github αποθετήρια σας, αλλά αν επιλέξετε την online έκδοση τότε θα "εξαπολύσετε" την φοβερή δύναμη του GitHub στα μοντέλα απειλών σας! Προφανώς, για να το κάνετε αυτό θα πρέπει πρώτα να συνδεθείτε.',
        loginWith: 'Είσοδος με'
    },
    providers: {
        github: {
            displayName: 'GitHub',
        },
        local: {
            displayName: 'Τοπική Συνεδρία'
        }
    },
    dashboard: {
        welcome: {
            title: 'Καλώς ήρθατε!',
            description: 'Είστε έτοιμοι να ξεκινήσετε να κάνετε τα σχέδια των εφαρμογών σας πιο ασφαλή. Μπορείτε να ανοίξετε ένα υφιστάμενο μοντέλο απειλών ή να δημιουργήσετ ένα καινούργιο επιλέγοντας μία από τις παρακάτω επιλογές. '
        },
        actions: {
            openExisting: 'Άνοιγμα ενός υφιστάμενου μοντέλου απειλών',
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
            nonRepudiation: 'Non-repudiation',
            detectability: 'Detectability',
            disclosureOfInformation: 'Disclosure of information',
            unawareness: 'Unawareness',
            nonCompliance: 'Non-compliance',
            spoofing: 'Spoofing',
            tampering: 'Tampering',
            repudiation: 'Repudiation',
            informationDisclosure: 'Information disclosure',
            denialOfService: 'Denial of service',
            elevationOfPrivilege: 'Elevation of privilege'
        },
        edit: 'Edit Threat',
        confirmDeleteTitle: 'Confirm Delete',
        confirmDeleteMessage: 'Are you sure you really want to delete this threat?',
        newThreat: 'New Threat',
        properties: {
            title: 'Title',
            status: 'Status',
            priority: 'Priority',
            type: 'Type',
            description: 'Description',
            mitigation: 'Mitigations',
            modelType: 'Model Type'
        },
        status: {
            notApplicable: 'Not Applicable',
            open: 'Open',
            mitigated: 'Mitigated'
        },
        priority: {
            low: 'Low',
            medium: 'Medium',
            high: 'High'
        }
    }
};

export default en;
