const fr = {
    auth: {
        sessionExpired: 'Votre session est expirée. Veuillez vous reconnecter pour continuer.'
    },
    nav: {
        v2Warning: 'Voici la version 2.0 de OWASP Threat Dragon et elle est en cours de développement. Ne l\'utilisez pas pour modifier des modèles existants, car cette version pourrait les briser!',
        loggedInAs: 'Connecté en tant que'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo Threat Dragon',
        description: 'Threat Dragon est un outil de modélisation des menaces open-source et gratuit d\'OWASP. Il peut être utilisé comme une application de bureau sur Windows, MacOS et Linux, ou comme une application Web. L\'application de bureau est idéale si vous voulez essayer Threat Dragon sans lui donner accès à vos projets GitHub, mais si vous choisissez la version en ligne, vous pouvez profiter de la puissance impressionnante de GitHub sur vos modèles de menace! Pour ce faire, vous devez d\'abord vous connecter.',
        loginWith: 'Login with'
    },
    providers: {
        github: {
            displayName: 'GitHub',
        },
        local: {
            displayName: 'Session Locale'
        }
    },
    dashboard: {
        welcome: {
            title: 'Bienvenue!',
            description: 'Vous êtes prêt à rendre vos conception d\'application plus sécuritaires. Vous pouvez ouvrir un modèle de menace existant ou en créer un nouveau en choisissant l\'une des options ci-dessous.'
        },
        actions: {
            openExisting: 'Ouvrir un modèle de menace existant',
            createNew: 'Créer un nouveau modèle de menace',
            demo: 'Explorez un exemple de modèle de menace',
            import: 'Importer un modèle de menace via JSON'
        }
    },
    demo: {
        select: 'Sélectionnez une démo de modèle de menace dans la liste ci-dessous'
    },
    desktop: {
        file: {
            heading: 'File',
            close: 'Fermer Projet',
            open: 'Ouvrir',
            save: 'Sauvegarder',
            saveAs: 'Save As',
        },
        help: {
            heading: 'Help',
            docs: 'Documentation',
            visit: 'Visit us at OWASP',
            sheets: 'OWASP Cheat Sheets',
            github: 'Visit us on GitHub',
            submit: 'Submit an Issue',
            check: 'Check for updates ...'
        }
    },
    repository: {
        select: 'Sélectionnez un',
        from: 'projet de la liste ci-dessous',
        noneFound: 'Aucun projet trouvé.  Pour commencer, créez un nouveau projet sur'
    },
    branch: {
        select: 'Sélectionnez une branche parmi',
        from: 'parmi la liste ci-dessous ou',
        chooseRepo: 'choisir un autre projet'
    },
    threatmodelSelect: {
        select: 'Sélectionnez un modèle de menace parmi',
        from: 'parmi la liste ci-dessous, ou choisissez une autre',
        branch: 'branche',
        or: 'ou',
        repo: 'projet',
        newThreatModel: 'Créer un nouveau modèle de menace'
    },
    threatmodel: {
        contributors: 'Contributeurs',
        contributorsPlaceholder: 'Ajouter un nouveau contributeur',
        description: 'Description de haut niveau du système',
        editing: 'Modification',
        jsonPaste: 'Collez le JSON de votre modèle de menace ici :',
        invalidJson: 'JSON invalide. Veuillez vérifier votre modèle et réessayer.',
        owner: 'Auteur',
        reviewer: 'Réviseur',
        title: 'Titre',
        diagram: {
            diagrams: 'Diagrammes',
            addNewDiagram: 'Ajouter un nouveau diagramme...',
            generic: {
                diagramTitle: 'Nouveau diagramme générique',
	            select: `Générique`
	        },
	        stride: {
                diagramTitle: 'Nouveau diagramme STRIDE',
                select: `STRIDE`
            },
            linddun: {
                diagramTitle: 'Nouveau diagramme LINDDUN',
                select: `LINDDUN`
            },
            cia: {
                diagramTitle: 'Nouveau diagramme CIA',
                select: `CIA`,
            }
        },
        threats: 'Menaces',
        errors: {
            open: 'Error opening this Threat Model. Check the developer console for more information',
            save: 'Error saving the Threat Model. Check the developer console for more information'
        },
        opened: 'Threat model successfully opened',
        saved: 'Threat model successfully saved',
        properties: {
            title: 'Propriétés',
            emptyState: 'Sélectionnez un élément du graphique à modifier',
            name: 'Nom',
            text: 'Texte',
            description: 'Description',
            outOfScope: 'Hors du domaine visé',
            reasonOutOfScope: 'Raison de l\'exclusion du domaine visé',
            privilegeLevel: 'Niveau de privilège',
            isALog: 'Est un journal',
            storesCredentials: 'Conserve les informations d\'identification',
            isEncrypted: 'Encrypté',
            isSigned: 'Signé',
            providesAuthentication: 'Fournit de l\'authentification',
            protocol: 'Protocole',
            publicNetwork: 'Réseau public'
        },
        buttons: {
            delete: 'Delete selected',
            redo: 'Rétablir',
            shortcuts: 'Raccourcis clavier',
            toggleGrid: 'Grille d\'affichage',
            undo: 'Annuler',
            zoomIn: 'Agrandir',
            zoomOut: 'Rétrécir'
        },
        shortcuts: {
            title: 'Raccourcis',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Copier'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Coller'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Annuler'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Rétablir'
            },
            delete: {
                shortcut: 'del',
                action: 'Supprimer'
            },
            pan: {
                shortcut: 'shift + clic gauche (maintenir/glisser)',
                action: 'Déplacer'
            },
            multiSelect: {
                shortcut: 'clic gauche dans l\'espace vide et glisser',
                action: 'Multi-sélection'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + molette de souris',
                action: 'Agrandir'
            }
        },
        stencil: {
            boundaries: 'Délimitations',
            components: 'Components',
            entities: 'Entités',
            metadata: 'Métadonnées',
            search: 'Recherche',
            notFound: 'Nous ne l\'avons pas encore, voulez-vous le proposer? :)'
        },
        shapes: {
            actor: 'Acteur',
            flow: 'Flux de données',
            flowStencil: 'Flux de données',
            process: 'Processus',
            store: 'Stockage',
            text: 'Texte arbitraire',
            trustBoundary: 'Délimitations de confiance'
        }
    },
    forms: {
        apply: 'Apply',
        cancel: 'Annuler',
        close: 'Fermer',
        closeModel: 'Close Model',
        delete: 'Supprimer',
        discardTitle: 'Discard Changes?',
        discardMessage: 'Are you sure you want to discard your changes?',
        edit: 'Modifier',
        import: 'Importer',
        ok: 'OK',
        open: 'Open',
        openModel: 'Open Model',
        print: 'Print',
        reload: 'Recharger',
        remove: 'Retirer',
        report: 'Rapport',
        save: 'Sauvegarder',
        saveAs: 'Save As',
        saveModel: 'Save Model',
        saveModelAs: 'Save Model As',
        savePdf: 'Save PDF',
        search: 'Rechercher'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentialité',
                integrity: 'Intégrité',
                availability: 'Disponibilité'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Capacité de liaison',
                identifiability: 'Identifiabilité',
                nonRepudiation: 'Non-répudiation',
                detectability: 'Détectabilité',
                disclosureOfInformation: 'Divulgation d\'information',
                unawareness: 'Inconscience',
                nonCompliance: 'Non-conformité'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'Usurpation d\'identité',
                tampering: 'Falsification',
                repudiation: 'Répudiation',
                informationDisclosure: 'Divulgation d\'information',
                denialOfService: 'Déni de service',
                elevationOfPrivilege: 'Élévation de privilège'
            }
        },
        generic: {
            default: 'New generic threat',
            cia: 'New CIA threat',
            linddun: 'New LINDDUN threat',
            stride: 'New STRIDE threat'
        },
        edit: 'Modifier la menace',
        confirmDeleteTitle: 'Confirmer Supprimer',
        confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer cette menace ?',
        description: 'Provide a description for this threat',
        emptyThreat: 'Select an element on the graph to add a threat',
        mitigation: 'Provide mitigation or prevention for this threat',
        newThreat: 'Nouvelle menace',
        newThreatByType: 'New Threat by Type',
        newThreatByContext: 'New Threat by Context',
        properties: {
            description: 'Description',
            mitigation: 'Mesures d\'atténuation',
            modelType: 'Type de modèle',
            number: 'Number',
            priority: 'Priorité',
            score: 'Score',
            status: 'Status',
            title: 'Titre',
            type: 'Type'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Ouvrir',
            mitigated: 'Atténué'
        },
        priority: {
            low: 'Faible',
            medium: 'Moyen',
            high: 'Élevé'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Show out of scope elements',
            showMitigatedThreats: 'Show mitigated threats',
            showModelDiagrams: 'Show model diagrams',
            showBranding: 'Show Threat Dragon Branding'
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
            openHigh: 'Open / High Priority',
            openMedium: 'Open / Medium Priority',
            openLow: 'Open / Low Priority',
            openUnknown: 'Open / Unknown Priority',
        }
    },
    upgrade: {
        modal: {
            header: 'Threatmodel Update',
            welcome: 'Welcome to version 2 of OWASP Threat Dragon!',
            p1: 'Version 2 uses a different drawing library, which will change the way parts of your threat models are saved. While most diagrams will look the same as they did in previous versions of Threat Dragon, there are cases where they may need to be adjusted slightly.',
            p2: 'After closing this modal, you will see how each diagram in this model renders in the version 2 format. Please make note of any diagrams you may need to adjust. This is a one-time upgrade, and you should not see this message again after saving this model.'
        },
        instructions: 'Great! Let\'s get you to your model.',
        continue: 'Continue to Threat Model'
    }
};

export default fr;
