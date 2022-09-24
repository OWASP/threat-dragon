const pt = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    nav: {
        v2Warning: 'Essa é a versão 2.0 do OWASP Threat Dragon que, ainda, está em desenvolvimento. Por gentileza, não utilize essa versão para editar modelos já existentes, uma vez que essa versão poderá quebrá-los!',
        loggedInAs: 'Logado como'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo do Threat Dragon',
        description: 'Threat Dragon é uma ferramenta gratuita e open-souce de modelagem de ameaças da OWASP e que pode ser utilizada via desktop para Windows, MacOS e Linux ou como uma aplicação web. A aplicação de desktop é excelente se você quiser experimentá-la sem conceder acesso aos seus repositórios do GitHub. No entanto, se você escolher a versão web, poderá liberar o incrível poder do GitHub em seus modelos de ameaça (threat model)! Obviamente, para fazer isso, será necessário realizar o login no GitHub e permitir o acesso ao repositório de interesse!',
        loginWith: 'Login com'
    },
    providers: {
        github: {
            displayName: 'GitHub'
        },
        local: {
            displayName: 'Sessão Local'
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
            download: 'Baixar e explorar um exemplo de modelo de ameaça (threat model)',
            import: 'Import a threat model via JSON'
        }
    },
    demo: {
        select: 'Select a demo threat model from the list below'
    },
    desktop: {
        file: {
            heading: 'File',
            close: 'Close Model',
            open: 'Open Model',
            save: 'Save Model',
            saveAs: 'Save Model As',
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
        invalidJson: 'Invalid JSON. Please check your model and try again.',
        jsonPaste: 'Paste the JSON of your threat model here',
        owner: 'Proprietário',
        reviewer: 'Revisor',
        title: 'Título',
        diagram: {
            diagrams: 'Diagramas',
            addNewDiagram: 'Adicionar um novo diagrama...',
            generic: {
                diagramTitle: 'New generic diagram',
                select: `Generic`
            },
            stride: {
                diagramTitle: 'New STRIDE diagram',
                select: `STRIDE`
            },
            linddun: {
                diagramTitle: 'New LINDDUN diagram',
                select: `LINDDUN`
            },
            cia: {
                diagramTitle: 'New CIA diagram',
                select: `CIA`,
            }
        },
        threats: 'Threats',
        errors: {
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
            reasonOutOfScope: 'Razão por estar fora de escopo',
            privilegeLevel: 'Nível de Privilégio',
            isALog: 'É um Log',
            storesCredentials: 'Armazenamento de Credenciais',
            isEncrypted: 'Criptografado',
            isSigned: 'Assinado',
            providesAuthentication: 'Fornecimento de Autenticação',
            protocol: 'Protocolo',
            publicNetwork: 'Rede Pública'
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
        savePdf: 'Save PDF',
        search: 'Search'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentiality',
                integrity: 'Integrity',
                availability: 'Availability'
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
            linddun: 'New LINDDUN threat',
            stride: 'New STRIDE threat'
        },
        edit: 'Edit Threat',
        confirmDeleteTitle: 'Confirm Delete',
        confirmDeleteMessage: 'Are you sure you really want to delete this threat?',
        description: 'Provide a description for this threat',
        emptyThreat: 'Select an element on the graph to add a threat',
        mitigation: 'Provide mitigation or prevention for this threat',
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

export default pt;
