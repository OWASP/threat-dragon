const fra = {
    auth: {
        sessionExpired: 'Votre session est expirée. Veuillez vous reconnecter pour continuer.'
    },
    nav: {
        v2Warning: 'Version 2.0 threat models are not backwardly compatible with version 1.x Threat Dragon models. Imported version 1.x models will be upgraded to the version 2.0 schema',
        loggedInAs: 'Connecté en tant que',
        logOut: 'Log out'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo Threat Dragon',
        description: 'Threat Dragon est un outil de modélisation des menaces open-source et gratuit d\'OWASP. Il peut être utilisé comme une application de bureau sur Windows, MacOS et Linux, ou comme une application Web. L\'application de bureau est idéale si vous voulez essayer Threat Dragon sans lui donner accès à vos projets GitHub, mais si vous choisissez la version en ligne, vous pouvez profiter de la puissance impressionnante de GitHub sur vos modèles de menace! Pour ce faire, vous devez d\'abord vous connecter.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Start'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Se connecter avec'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Se connecter avec'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Se connecter avec'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Se connecter avec'
        },
        local: {
            displayName: 'une session locale',
            loginWith: 'Se connecter avec'
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
            readDemo: 'Explorez un exemple de modèle de menace',
            importExisting: 'Importer un modèle de menace via JSON'
        }
    },
    demo: {
        select: 'Sélectionnez une démo de modèle de menace dans la liste ci-dessous'
    },
    desktop: {
        file: {
            heading: 'File',
            clearRecentDocs: 'Clear Menu',
            close: 'Fermer Projet',
            closeWindow: 'Close Window',
            new: 'New Model',
            open: 'Ouvrir',
            recentDocs: 'Open Recent',
            save: 'Sauvegarder',
            saveAs: 'Sauvergarder en tant que'
        },
        help: {
            heading: 'Aide',
            docs: 'Documentation',
            visit: 'Visitez-nous à OWASP',
            sheets: 'OWASP Aide-mémoire',
            github: 'Visitez-nous sur GitHub',
            submit: 'Soumettre un problème',
            check: 'Vérifier les mises à jour ...'
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
        dragAndDrop: 'Glissez-déposez ou ',
        editing: 'Modification',
        jsonPaste: 'Collez le JSON de votre modèle de menace ici',
        owner: 'Auteur',
        reviewer: 'Réviseur',
        title: 'Titre',
        diagram: {
            diagrams: 'Diagrammes',
            addNewDiagram: 'Ajouter un nouveau diagramme...',
            generic: {
                defaultTitle: 'Nouveau diagramme générique',
                defaultDescription: 'New generic diagram description',
                select: 'Générique'
            },
            stride: {
                defaultTitle: 'Nouveau diagramme STRIDE',
                defaultDescription: 'New STRIDE diagram description',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Nouveau diagramme LINDDUN',
                defaultDescription: 'New LINDDUN diagram description',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Nouveau diagramme PLOT4ai',
                defaultDescription: 'New PLOT4ai diagram description',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'New DIE diagram',
                defaultDescription: 'New DIE diagram description',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Nouveau diagramme CIA',
                defaultDescription: 'New CIA diagram description',
                select: 'CIA'
            }
        },
        threats: 'Menaces',
        errors: {
            dropSingleFileOnly: 'Drag and drop requires a single file.',
            invalidJson: 'JSON invalide. Veuillez vérifier votre modèle et réessayer.',
            onlyJsonAllowed: 'Only files that end with .json are supported.',
            open: 'Erreur lors de l\'ouverture de ce modèle de menace. Vérifiez la console de développement pour plus d\'informations',
            save: 'Erreur lors de la sauvegarde de ce modèle de menace. Vérifiez la console de développement pour plus d\'informations'
        },
        opened: 'Modèle de menace ouvert avec succès',
        saved: 'Modèle de menace sauvegardé avec succès',
        properties: {
            title: 'Propriétés',
            emptyState: 'Sélectionnez un élément du graphique à modifier',
            name: 'Nom',
            text: 'Texte',
            description: 'Description',
            outOfScope: 'Hors du domaine visé',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Raison de l\'exclusion du domaine visé',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'Est un journal',
            isEncrypted: 'Encrypté',
            isSigned: 'Signé',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Niveau de privilège',
            providesAuthentication: 'Fournit de l\'authentification',
            protocol: 'Protocole',
            publicNetwork: 'Réseau public',
            storesCredentials: 'Conserve les informations d\'identification',
            storesInventory: 'Stores Inventory'
        },
        buttons: {
            delete: 'Supprimer la sélection',
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
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
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
        apply: 'Appliquer',
        cancel: 'Annuler',
        close: 'Fermer',
        closeModel: 'Fermer le modèle',
        delete: 'Supprimer',
        discardTitle: 'Annuler les modifications?',
        discardMessage: 'Êtes-vous sûr de vouloir abandonner vos modifications?',
        edit: 'Modifier',
        exportAs: 'Export Model As',
        exportHtml: 'Rapport HTML',
        exportPdf: 'Rapport PDF',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Importer',
        ok: 'OK',
        open: 'Ouvrir',
        openModel: 'Ouvrir le modèle',
        print: 'Imprimer',
        reload: 'Rafraîchir',
        remove: 'Retirer',
        report: 'Rapport',
        save: 'Sauvegarder',
        saveAs: 'Sauvergarder en tant que',
        saveModel: 'Sauvergarder le modèle',
        saveModelAs: 'Sauvergarder le modèle en tant que',
        search: 'Rechercher',
        next: 'suivant',
        previous: 'précédent'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentialité',
                integrity: 'Intégrité',
                availability: 'Disponibilité'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distributed',
                immutable: 'Immutable',
                ephemeral: 'Ephemeral'
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
                spoofing: 'Usurpation d\'identité',
                tampering: 'Falsification',
                repudiation: 'Répudiation',
                informationDisclosure: 'Divulgation d\'information',
                denialOfService: 'Déni de service',
                elevationOfPrivilege: 'Élévation de privilège'
            }
        },
        generic: {
            default: 'Nouvelle menace générique',
            cia: 'Nouvelle menace CIA',
            die: 'Nouvelle menace DIE',
            linddun: 'Nouvelle menace LINDDUN',
            plot4ai: 'Nouvelle menace PLOT4ai',
            stride: 'Nouvelle menace STRIDE'
        },
        edit: 'Modifier la menace',
        confirmDeleteTitle: 'Confirmer Supprimer',
        confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer cette menace?',
        description: 'Fournissez une description de cette menace',
        emptyThreat: 'Sélectionnez un élément du graphique pour ajouter une menace',
        mitigation: 'Fournir des mesures de mitigation ou de prévention pour cette menace',
        newThreat: 'Nouvelle Menace',
        newThreatByType: 'Nouvelle Menace par Type',
        newThreatByContext: 'Nouvelle Menace par Contexte',
        properties: {
            description: 'Description',
            mitigation: 'Mesures de mitigation',
            modelType: 'Type de modèle',
            number: 'Numéro',
            priority: 'Priorité',
            score: 'Score',
            status: 'Status',
            title: 'Titre',
            type: 'Type'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Ouvrir',
            mitigated: 'Mitigé'
        },
        priority: {
            low: 'Faible',
            medium: 'Moyen',
            high: 'Élevé'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Afficher les éléments hors du domaine visé',
            showMitigatedThreats: 'Afficher les menaces mitigées',
            showModelDiagrams: 'Afficher les diagrammes du modèle',
            showEmpty: 'Show empty elements',
            showBranding: 'Icône de Threat Dragon'
        },
        title: 'Rapport sur le modèle de menace pour',
        dateGenerated: 'Date de Création',
        executiveSummary: 'Résumé Exécutif',
        notProvided: 'Non fourni',
        summary: 'Résumé',
        threatStats: {
            total: 'Menaces Totales',
            mitigated: 'Menaces Totales Mitigées',
            notMitigated: 'Menaces Totales Non-Mitigées',
            openHigh: 'Ouvert / Haute Priorité',
            openMedium: 'Ouvert / Moyenne Priorité',
            openLow: 'Ouvert / Faible Priorité',
            openUnknown: 'Ouvert / Priorité Inconnue'
        }
    },
    upgrade: {
        modal: {
            header: 'Mise à jour du modèle de menace - Threat Model',
            welcome: 'Bienvenue à la version 2 de OWASP Threat Dragon!',
            p1: 'La version 2 utilise une bibliothèque de dessins différente, ce qui modifie la façon dont certaines parties de vos modèles de menace sont enregistrées. Bien que la plupart des diagrammes se présenteront de la même manière que dans les versions précédentes de Threat Dragon, il est possible que de légères modifications soient nécessaires dans certains cas.',
            p2: 'Après avoir fermé cette fenêtre, vous verrez comment chaque diagramme de ce modèle est rendu dans le format de la version 2. Veuillez noter les diagrammes que vous devrez éventuellement ajuster. Il s\'agit d\'une mise à jour unique, et vous ne devriez plus voir ce message après avoir sauvegardé ce modèle.'
        },
        instructions: 'Excellent! Allons à votre modèle.',
        continue: 'Continuer au modèle de menace'
    }
};

export default fra;
