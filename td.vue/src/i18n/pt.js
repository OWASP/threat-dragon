const por = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    nav: {
        v2Warning: 'Version 2.0 threat models are not backwardly compatible with version 1.x Threat Dragon models. Imported version 1.x models will be upgraded to the version 2.0 schema',
        loggedInAs: 'Logado como',
        logOut: 'Log out'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo do Threat Dragon',
        description: 'Threat Dragon é uma ferramenta gratuita e open-souce de modelagem de ameaças da OWASP e que pode ser utilizada via desktop para Windows, MacOS e Linux ou como uma aplicação web. A aplicação de desktop é excelente se você quiser experimentá-la sem conceder acesso aos seus repositórios do GitHub. No entanto, se você escolher a versão web, poderá liberar o incrível poder do GitHub em seus modelos de ameaça (threat model)! Obviamente, para fazer isso, será necessário realizar o login no GitHub e permitir o acesso ao repositório de interesse!'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Start'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Login com'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Login com'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Login com'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Login com'
        },
        local: {
            displayName: 'Sessão Local',
            loginWith: 'Login com'
        }
    },
    dashboard: {
        welcome: {
            title: 'Desejamos boas-vindas! Ficamos felizes em te ter por aqui!',
            description: 'Com OWASP Threat Dragon, você terá os mecanismos para tornar os designs de seus aplicativos mais seguros! Você pode abrir um modelo de ameaça (threat model) existente ou criar um modelo do zero! Basta escolher uma das opções abaixo!'
        },
        actions: {
            openExisting: 'Abrir um modelo de ameaça (threat model) existente',
            createNew: 'Criar um novo modelo de ameaça (threat model) do zero',
            readDemo: 'Baixar e explorar um exemplo de modelo de ameaça (threat model)',
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
            check: 'Check for updates ...'
        }
    },
    repository: {
        select: 'Selecionar',
        from: 'repositório da lista abaixo',
        noneFound: 'No repositories found. To get started, create a new repository on'
    },
    branch: {
        select: 'Selecionar uma branch',
        from: 'da lista abaixo ou',
        chooseRepo: 'escolher outro repositório'
    },
    threatmodelSelect: {
        select: 'Selecion a Threat Model from',
        from: 'da lista abaixo, ou escolher outra',
        branch: 'branch',
        or: 'ou',
        repo: 'repositório',
        newThreatModel: 'Create a New Threat Model'
    },
    threatmodel: {
        contributors: 'Contribuidores',
        contributorsPlaceholder: 'Adicionar um novo contribuidor',
        description: 'Descrição de alto nível do sistema (high level system)',
        dragAndDrop: 'Drag and drop or ',
        editing: 'Edição',
        jsonPaste: 'Drop a threat model JSON file or paste its content here:',
        owner: 'Proprietário',
        reviewer: 'Revisor',
        title: 'Título',
        diagram: {
            diagrams: 'Diagramas',
            addNewDiagram: 'Adicionar um novo diagrama...',
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
            save: 'Error saving the Threat Model. Check the developer console for more information'
        },
        opened: 'Threat model successfully opened',
        saved: 'Threat model successfully saved',
        properties: {
            title: 'Propriedades',
            emptyState: 'Selecione um elemento do diagrama para modificar suas propriedades',
            name: 'Nome',
            text: 'Texto',
            description: 'Descrição',
            outOfScope: 'Fora do Escopo',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Razão por estar fora de escopo',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'É um Log',
            isEncrypted: 'Criptografado',
            isSigned: 'Assinado',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Nível de Privilégio',
            providesAuthentication: 'Fornecimento de Autenticação',
            protocol: 'Protocolo',
            publicNetwork: 'Rede Pública',
            storesCredentials: 'Armazenamento de Credenciais',
            storesInventory: 'Stores Inventory'
        },
        buttons: {
            delete: 'Delete selected',
            redo: 'Redo edit',
            shortcuts: 'Keyboard shortcuts',
            toggleGrid: 'Toggle grid',
            undo: 'Undo edit',
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out'
        },
        shortcuts: {
            title: 'Atalhos',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Copiar'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Colar'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Desfazer'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Refazer'
            },
            delete: {
                shortcut: 'del',
                action: 'Deletar'
            },
            pan: {
                shortcut: 'shift + botão esquerdo do mouse (segurar e arrastar)',
                action: 'Movimentar-se por toda a imagem do diagrama'
            },
            multiSelect: {
                shortcut: 'clique no botão esquerdo mouse no espaço vazio e arrastar',
                action: 'Seleção múltipla'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + rolagem do mouse',
                action: 'Zoom'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'Limites',
            components: 'Components',
            entities: 'Entidades',
            metadata: 'Metadados',
            search: 'Pesquisar',
            notFound: 'Ainda não temos isso! :( Mas, gostaria de abrir uma issue? :)'
        },
        shapes: {
            actor: 'Ator',
            flow: 'Fluxo de Dados',
            flowStencil: 'Fluxo de Dados',
            process: 'Processo',
            store: 'Armazenamento',
            text: 'Texto facultativo',
            trustBoundary: 'Limite de Confiança'
        }
    },
    forms: {
        apply: 'Apply',
        cancel: 'Cancelar',
        close: 'Fechar',
        closeModel: 'Close Model',
        delete: 'Deletar',
        discardTitle: 'Discard Changes?',
        discardMessage: 'Are you sure you want to discard your changes?',
        edit: 'Editar',
        exportAs: 'Export Model As',
        exportHtml: 'HTML Reporte',
        exportPdf: 'PDF Reporte',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Import',
        ok: 'OK',
        open: 'Open',
        openModel: 'Open Model',
        print: 'Print',
        reload: 'Recarregar',
        remove: 'Remover',
        report: 'Reporte',
        save: 'Salvar',
        saveAs: 'Save As',
        saveModel: 'Save Model',
        saveModelAs: 'Save Model As',
        search: 'Search',
        next: 'próximo',
        previous: 'anterior'
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
            dafault: 'Nova ameaça genérica',
            cia : 'Nova ameaça da CIA',
            die : 'Nova ameaça da DIE',
            linddun : 'Nova ameaça LINDDUN',
            plot4ai : 'Nova ameaça PLOT4ai',
            stride: 'Nova ameaça STRIDE'
        },
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
            low: 'Low',
            medium: 'Medium',
            high: 'High'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Show out of scope elements',
            showMitigatedThreats: 'Show mitigated threats',
            showModelDiagrams: 'Show model diagrams',
            showEmpty: 'Show empty elements',
            showBranding: 'Threat Dragon logo'
        },
        title: 'Relatório do modelo de ameaças para',
        dateGenerated : 'Data Gerada',
        executiveSummary : 'Resumo Executivo',
        notProvided : 'Não fornecido',
        summary: 'Resumo',
        threatStats : {
            total: 'Ameaças totais',
            mitigated: 'Total Mitigado',
            notMitigated : 'Não atenuado',
            openHigh : 'Abrir / Alta Prioridade',
            openMedium : 'Abrir / Prioridade Média',
            openLow : 'Abrir / Baixa Prioridade',
            openUnknown : 'Prioridade Aberta / Desconhecida'
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

export default por;
