const fra = {
    auth: {
        sessionExpired: 'Votre session est expirée. Veuillez vous reconnecter pour continuer.'
    },
    operator: {
        heading: 'Opérateur',
        operatedby: 'Ce site web et cette instance d\'OWASP Threat Dragon sont exploités par:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'l\'opérateur de ce site web'}`,
        contact: 'Contact: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(informations de contact non fournies)'),
    },
    tos: {
        title: 'Conditions d\'utilisation',
        lastUpdated: '4 avril 2025',
        introduction: 'Bienvenue sur notre instance d\'OWASP Threat Dragon. Ces conditions d\'utilisation ("Conditions") régissent votre accès et votre utilisation de ce site web, qui est une instance d\'une application web open-source mise à disposition par l\'opérateur mentionné ci-dessus ("L\'Opérateur").',
        sections: [
            {
                heading: '1. Acceptation des conditions',
                content: 'En accédant et en utilisant ce site web, vous acceptez d\'être lié par les termes et dispositions de cet accord. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser ce site web.'
            },
            {
                heading: '2. Utilisation du site web',
                content: 'Vous ne pouvez utiliser le site web qu\'à des fins légales. Vous acceptez de ne pas abuser, perturber ou tenter d\'accéder sans autorisation au site web ou à ses systèmes sous-jacents.'
            },
            {
                heading: '3. Aucune garantie',
                content: 'Le site web est fourni "tel quel" sans garanties d\'aucune sorte, expresses ou implicites, y compris, mais sans s\'y limiter, l\'adéquation à un usage particulier, la disponibilité ou l\'exactitude. Nous ne garantissons pas un fonctionnement ininterrompu ou sans erreur.'
            },
            {
                heading: '4. Limitation de responsabilité',
                content: 'Dans toute la mesure permise par la loi, l\'Opérateur ne sera pas responsable des dommages directs, indirects, accessoires ou consécutifs résultant de votre utilisation ou de votre incapacité à utiliser le site web.'
            },
            {
                heading: '5. Logiciel Open Source',
                content: 'Ce site web utilise le logiciel OWASP Threat Dragon, dont le code source est disponible sur https://www.github.com/OWASP/threat-dragon. Votre utilisation du logiciel est soumise à ses conditions de licence open source. Nous ne sommes pas responsables du logiciel lui-même, mais uniquement de l\'exploitation de cette instance. L\'opérateur de ce site web n\'est pas affilié à OWASP.'
            },
            {
                heading: '6. Modifications des conditions',
                content: 'L\'Opérateur peut mettre à jour ces conditions à tout moment. L\'utilisation continue du site web après les modifications constitue une acceptation des conditions mises à jour.'
            },
            {
                heading: '7. Résiliation',
                content: 'L\'Opérateur se réserve le droit de suspendre ou de résilier l\'accès au site web à sa discrétion, sans préavis, pour quelque raison que ce soit.'
            },
            {
                heading: '8. Loi applicable',
                content: 'Ces conditions sont régies par les lois de la juridiction dans laquelle l\'Opérateur a son siège social (dans le cas d\'une organisation) ou réside (dans le cas d\'un individu), sans égard aux principes de conflit de lois.'
            }
        ],
        contact: 'Si vous avez des questions concernant ces conditions, veuillez contacter l\'opérateur.'
    },
    privacy: {
        title: 'Politique de confidentialité',
        lastUpdated: '4 avril 2025',
        introduction: 'L\'opérateur de ce site web s\'engage à protéger votre vie privée. Cette politique de confidentialité explique comment vos informations sont traitées.',
        sections: [
            {
                heading: 'Utilisation minimale des données pour les opérations',
                content: 'L\'opérateur ne collecte, ne stocke ni ne traite les données personnelles des utilisateurs à des fins de suivi, de profilage ou de partage avec des tiers. Des journaux temporaires, qui peuvent inclure des adresses IP ou des noms d\'utilisateur, sont générés uniquement à des fins opérationnelles et de débogage. Ces journaux sont supprimés dans un court laps de temps et ne sont pas conservés ou utilisés au-delà de ces fins limitées.'
            },
            {
                heading: 'Conformité légale',
                content: 'L\'opérateur ne divulguera des informations que si la loi l\'exige, par exemple en réponse à une ordonnance gouvernementale valide ou à une assignation à comparaître. Dans de tels cas, l\'opérateur se conformera aux obligations légales applicables.'
            },
            {
                heading: 'Modifications de cette politique',
                content: 'L\'opérateur peut mettre à jour cette politique de confidentialité de temps à autre. Tout changement sera publié sur cette page avec une date de "Dernière mise à jour" mise à jour.'
            },
            {
                heading: 'Contactez-nous',
                content: 'Si vous avez des questions concernant cette politique de confidentialité, veuillez contacter l\'opérateur.'
            }
        ]
    },
    nav: {
        v2Warning:
            'Les modèles de menace de la version 2.0 ne sont pas rétrocompatibles avec les modèles Threat Dragon de la version 1.x. Les modèles importés de la version 1.x seront mis à niveau vers le schéma de la version 2.0',
        loggedInAs: 'Connecté en tant que',
        logOut: 'Log out',
        tos: "Conditions d'utilisation",
        privacy: 'Politique de confidentialité'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo Threat Dragon',
        description:
            "OWASP Threat Dragon est une application gratuite, open-source et multiplateforme pour créer des modèles de menaces. Utilisez-la pour dessiner des diagrammes de modélisation des menaces et identifier les menaces pour votre système. Avec un accent sur la flexibilité et la simplicité, elle est facilement accessible pour tous types d'utilisateurs."
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
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'Ouvrir',
            description:
                'Sélectionnez un fichier de modèle de menace ou un dossier de destination depuis Google Drive',
            saveThreatModel: 'Enregistrer le modèle de menace sur Google Drive',
            saveDescription:
                'Sélectionnez un dossier dans Google Drive pour enregistrer votre modèle de menace',
            fileName: 'Nom du fichier',
            fileNamePlaceholder: 'Entrez un nom pour votre fichier',
            selectFolder: 'Sélectionner un dossier dans Google Drive',
            selectFile: 'Sélectionner un fichier depuis Google Drive',
            selectThreatModel: 'Sélectionner un modèle de menace depuis Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'Bienvenue!',
            description:
                "Vous êtes prêt à rendre vos conception d'application plus sécuritaires. Vous pouvez ouvrir un modèle de menace existant ou en créer un nouveau en choisissant l'une des options ci-dessous."
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
        chooseRepo: 'choisir un autre projet',
        or: 'ou',
        addNew: 'ajouter une nouvelle branche',
        protectedBranch: 'Branche protégée',
        nameRequired: 'Le nom de la branche est requis',
        nameExists: 'Le nom de la branche existe déjà',
        refBranch: 'branche de référence',
        add: 'Ajouter une branche',
        cancel: 'Annuler',
        name: 'Nom de la branche'
    },
    folder: {
        select: 'Sélectionnez un',
        from: 'dossier dans la liste ci-dessous',
        noneFound: 'Ce dossier est vide. Vous pouvez créer un nouveau modèle de menace ici.'
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
        jsonPaste: 'Collez le JSON de votre modèle de menace ici',
        owner: 'Auteur',
        reviewer: 'Réviseur',
        title: 'Titre',
        new: {
            title: 'Créer un nouveau modèle de menace',
            description: 'Entrez les informations concernant votre nouveau modèle de menace'
        },
        placeholder: {
            title: 'Titre du modèle de menace',
            owner: "Nom du propriétaire ou de l'équipe",
            description:
                'Entrez une description de haut niveau du système en cours de modélisation',
            reviewer: 'Nom du réviseur'
        },
        diagram: {
            diagrams: 'Diagrammes',
            addNewDiagram: 'Ajouter un nouveau diagramme...',
            generic: {
                defaultTitle: 'Nouveau diagramme générique',
                defaultDescription: 'Description du nouveau diagramme générique',
                select: 'Générique'
            },
            stride: {
                defaultTitle: 'Nouveau diagramme STRIDE',
                defaultDescription: 'Description du nouveau diagramme STRIDE',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Nouveau diagramme LINDDUN',
                defaultDescription: 'Description du nouveau diagramme LINDDUN',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Nouveau diagramme PLOT4ai',
                defaultDescription: 'Description du nouveau diagramme PLOT4ai',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Nouveau diagramme DIE',
                defaultDescription: 'Description du nouveau diagramme DIE',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Nouveau diagramme CIA',
                defaultDescription: 'Description du nouveau diagramme CIA',
                select: 'CIA'
            }
        },
        threats: 'Menaces',
        errors: {
            dropSingleFileOnly: 'Le glisser-déposer nécessite un seul fichier.',
            invalidJson: 'JSON invalide. Veuillez vérifier votre modèle et réessayer.',
            onlyJsonAllowed: 'Seuls les fichiers se terminant par .json sont pris en charge.',
            open: "Erreur lors de l'ouverture de ce modèle de menace. Vérifiez la console de développement pour plus d'informations",
            save: "Erreur lors de la sauvegarde de ce modèle de menace. Vérifiez la console de développement pour plus d'informations",
            googleDriveSave:
                "Erreur lors de l'enregistrement sur Google Drive. Assurez-vous de disposer des autorisations appropriées."
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
            reasonOutOfScope: "Raison de l'exclusion du domaine visé",
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'Est un journal',
            isEncrypted: 'Encrypté',
            isSigned: 'Signé',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Niveau de privilège',
            providesAuthentication: "Fournit de l'authentification",
            protocol: 'Protocole',
            publicNetwork: 'Réseau public',
            storesCredentials: "Conserve les informations d'identification",
            storesInventory: 'Stores Inventory'
        },
        controlButtons: {
            delete: 'Supprimer la sélection',
            redo: 'Rétablir',
            shortcuts: 'Raccourcis clavier',
            toggleGrid: "Grille d'affichage",
            undo: 'Annuler',
            zoomIn: 'Agrandir',
            zoomOut: 'Rétrécir',
            save: 'Sauvegarder'
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
                shortcut: "clic gauche dans l'espace vide et glisser",
                action: 'Multi-sélection'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + molette de souris',
                action: 'Agrandir'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Sauvegarder'
            }
        },
        stencil: {
            title: 'Formes',
            boundaries: 'Délimitations',
            components: 'Composants',
            entities: 'Entités',
            metadata: 'Métadonnées',
            search: 'Recherche',
            notFound: "Nous ne l'avons pas encore, voulez-vous le proposer? :)"
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
        export: 'Exporter',
        exportAs: 'Exporter le modèle sous',
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
        previous: 'précédent',
        requiredField: 'Champ obligatoire'
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
                disclosureOfInformation: "Divulgation d'information",
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
                spoofing: "Usurpation d'identité",
                tampering: 'Falsification',
                repudiation: 'Répudiation',
                informationDisclosure: "Divulgation d'information",
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
            tbd: 'à venir',
            low: 'Faible',
            medium: 'Moyen',
            high: 'Élevé',
            critical: 'Critique'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Afficher les éléments hors du domaine visé',
            showMitigatedThreats: 'Afficher les menaces mitigées',
            showModelDiagrams: 'Afficher les diagrammes du modèle',
            showEmpty: 'Afficher les éléments vides',
            showProperties: 'Afficher les propriétés des éléments',
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
            openCritical: 'Ouvert / Critique Priorité',
            openHigh: 'Ouvert / Haute Priorité',
            openMedium: 'Ouvert / Moyenne Priorité',
            openLow: 'Ouvert / Faible Priorité',
            openTbd: 'Ouvert / Priorité à déterminer',
            openUnknown: 'Ouvert / Priorité Inconnue'
        }
    },
    pagination: {
        previous: 'précédent',
        next: 'suivant'
    }
};

export default fra;
