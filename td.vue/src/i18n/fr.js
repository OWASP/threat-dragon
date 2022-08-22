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
        description: 'Threat Dragon est un outil de modélisation des menaces open-source et gratuit d\'OWASP. Il peut être utilisé comme une application de bureau sur Windows, MacOS et Linux, ou comme une application Web. L\'application de bureau est idéale si vous voulez essayer Threat Dragon sans lui donner accès à vos projets GitHub, mais si vous choisissez la version en ligne, vous pouvez profiter de la puissance impressionnante de GitHub sur vos modèles de menace! Pour ce faire, vous devez d\'abord vous connecter.'
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
        jsonPaste: 'Collez le JSON de votre modèle de menace ici :',
        invalidJson: 'JSON invalide. Veuillez vérifier votre modèle et réessayer.',
        owner: 'Auteur',
        reviewer: 'Réviseur',
        contributors: 'Contributeurs',
        contributorsPlaceholder: 'Ajouter un nouveau contributeur',
        description: 'Description de haut niveau du système',
        editing: 'Modification',
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
            shortcuts: 'Raccourcis clavier',
            undo: 'Annuler',
            redo: 'Rétablir',
            zoomIn: 'Agrandir',
            zoomOut: 'Rétrécir',
            toggleGrid: 'Grille d\'affichage'
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
            entities: 'Entités',
            boundaries: 'Délimitations',
            metadata: 'Métadonnées',
            search: 'Recherche',
            notFound: 'Nous ne l\'avons pas encore, voulez-vous le proposer? :)'
        },
        shapes: {
            actor: 'Acteur',
            flowStencil: 'Flux de données',
            process: 'Processus',
            store: 'Stockage',
            text: 'Texte arbitraire',
            trustBoundary: 'Délimitations de confiance'
        }
    },
    forms: {
        edit: 'Modifier',
        report: 'Rapport',
        delete: 'Supprimer',
        remove: 'Retirer',
        save: 'Sauvegarder',
        reload: 'Recharger',
        cancel: 'Annuler',
        close: 'Fermer',
        search: 'Rechercher',
        import: 'Importer'
    },
    threats: {
        model: {
            cia: {
                confidentiality: 'Confidentialité',
                integrity: 'Intégrité',
                availability: 'Disponibilité'
            },
            linddun: {
                linkability: 'Capacité de liaison',
                identifiability: 'Identifiabilité',
                nonRepudiation: 'Non-répudiation',
                detectability: 'Détectabilité',
                disclosureOfInformation: 'Divulgation d\'information',
                unawareness: 'Inconscience',
                nonCompliance: 'Non-conformité'
            },
            stride: {
                spoofing: 'Usurpation d\'identité',
                tampering: 'Falsification',
                repudiation: 'Répudiation',
                informationDisclosure: 'Divulgation d\'information',
                denialOfService: 'Déni de service',
                elevationOfPrivilege: 'Élévation de privilège'
            }
        },
        edit: 'Modifier la menace',
        confirmDeleteTitle: 'Confirmer Supprimer',
        confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer cette menace ?',
        newThreat: 'Nouvelle menace',
        properties: {
            title: 'Titre',
            status: 'Status',
            priority: 'Priorité',
            type: 'Type',
            description: 'Description',
            mitigation: 'Mesures d\'atténuation',
            modelType: 'Type de modèle'
        },
        status: {
            notApplicable: 'Non applicable',
            open: 'Ouvrir',
            mitigated: 'Atténué'
        },
        priority: {
            low: 'Faible',
            medium: 'Moyen',
            high: 'Élevé'
        }
    }
};

export default fr;
