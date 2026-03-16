const por = {
    auth: {
        sessionExpired: 'Sua sessão está expirada. Por favor, faça login novamente.'
    },
    nav: {
        loggedInAs: 'Logado como',
        logOut: 'Desconectar',
        contentManagement: 'Gestor de Conteudos'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo do Threat Dragon',
        description: 'Threat Dragon é uma ferramenta gratuita e open-souce de modelagem de ameaças da OWASP e que pode ser utilizada via desktop para Windows, MacOS e Linux ou como uma aplicação web. A aplicação de desktop é excelente se você quiser experimentá-la sem conceder acesso aos seus repositórios do GitHub. No entanto, se você escolher a versão web, poderá liberar o incrível poder do GitHub em seus modelos de ameaça (threat model)! Obviamente, para fazer isso, será necessário realizar o login no GitHub e permitir o acesso ao repositório de interesse!'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Iniciar'
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
            importExisting: 'Importar um modelo de ameaça (threat model) via JSON',
            createFromTemplate: 'Criar um novo modelo de ameaça (threat model) apartir de um template'
        }
    },
    demo: {
        select: 'Selecione uma demonstração de modelo de ameaça (threat model) da lista abaixo'
    },
    desktop: {
        file: {
            heading: 'Arquivo',
            clearRecentDocs: 'Limpar Menu',
            close: 'Fechar Modelo',
            closeWindow: 'Fechar Janela',
            new: 'Novo Modelo',
            open: 'Abrir Modelo',
            recentDocs: 'Abrir Modelos Recentes',
            save: 'Salvar Modelo',
            saveAs: 'Salvar Modelo como'
        },
        help: {
            heading: 'Ajuda',
            docs: 'Documentação',
            visit: 'Visite nos em OWASP',
            sheets: 'OWASP Folha de Dicas',
            github: 'Visite nos no GitHub',
            submit: 'Registrar um problema',
            check: 'Checar por atualizações ...',
            about: {
                about: 'Sobre',
                version: 'Versão'
            }
        }
    },
    repository: {
        select: 'Selecionar',
        from: 'repositório da lista abaixo',
        noneFound: 'Nenhum repositório encontrado. Para iniciar, crie um novo repositório em'
    },
    branch: {
        select: 'Selecionar uma branch',
        from: 'da lista abaixo ou',
        chooseRepo: 'escolher outro repositório',
        or: 'ou',
        addNew: 'adicionar uma nova branch',
        protectedBranch: 'Branch protegida',
        refBranch: 'Branch de referência',
        nameRequired: 'Nome da branch é obrigatório',
        nameExists: 'Nome da branch já existe',
        add: 'Adicionar branch',
        cancel: 'Cancelar',
        name: 'Nome da branch',
    },
    folder: {
        select: 'Selecione uma',
        from: 'pasta da lista abaixo',
        noneFound: 'Esta pasta está vazia, você pode criar um novo modelo de ameaça (threat model) aqui.'
    },
    threatmodelSelect: {
        select: 'Selecionar um modelo de ameaça (Threat Model)',
        from: 'da lista abaixo, ou escolher outra',
        branch: 'branch',
        or: 'ou',
        repo: 'repositório',
        newThreatModel: 'Criar um novo Modelo de Ameaça (Threat Model)'
    },
    template: {
        startFromLocalTemplate: 'Começar de um modelo base (template) local',
        select: 'Selecione um modelo base (template) da lista abaixo',
        selectDescription: 'Os modelos base (templates) fornecem um ponto de partida para novos modelos de ameaça (threat models), pré-preenchidos com componentes e ameaças relevantes.',
        noTemplates: 'Nenhum modelo base (template) encontrado',
        templatesLocalSession: 'Modelos base (templates) remotos não estão disponíveis para sessões locais.',
        search: 'Pesquisar modelos base (templates)...',
        exportTemplate: 'Exportar como modelo base (template)',
        tags: 'Etiquetas (Tags)',
        name: 'Nome do modelo base (template)',
        description: 'Descrição do modelo base (template)',
        saveTemplate: 'Salvar modelo base (template)',
        addNew: 'Adicionar novo modelo base (template)',
        manage: 'Gerenciar modelos base (templates)',
        manageDescription: 'Importe, exporte e gerencie seus modelos base (template) de ameaça aqui.',
        editTemplate: 'Editar modelo base (template)',
        addTagsPlaceholder: 'Adicionar etiquetas (tags)...',
        updateSuccess: 'Modelo base (template) atualizado com sucesso',
        importSuccess: 'Modelo base (template) importado com sucesso',
        deleteSuccess: 'Modelo base (template) excluído com sucesso',
        deleteTitle: 'Confirmar exclusão',
        deleteConfirm: 'Tem certeza de que deseja excluir "{name}"?',
        errors: {
            invalidJson: 'JSON inválido. Verifique seu arquivo de modelo base (template) e tente novamente.',
            invalidTemplate: 'Formato de modelo base inválido. Verifique seu arquivo de modelo base (template) e tente novamente.',
            loadFailed: 'Falha ao carregar modelos base (templates). Tente novamente.',
            duplicateTemplate: 'Já existe um modelo base (template) com este nome. Use um nome diferente.',
            updateFailed: 'Falha ao atualizar modelo base (template)',
            deleteFailed: 'Falha ao excluir modelo base (template)'
        },
        warnings: {
            templateSave: 'Não foi possível salvar o modelo base (template). Verifique o console do desenvolvedor para mais informações.',
            invalidSchema: 'O modelo base (template) não corresponde estritamente ao esquema. Detalhes no console do desenvolvedor.'
        },
        prompts: {
            templateSaved: 'Modelo base (template) salvo com sucesso',
            templateDownloading: 'Baixando modelo base (template)'
        },
        repo: {
            notInitialized: {
                title: 'Repositório de modelos base (templates) não inicializado',
                userMessage: 'O repositório de modelos base (templates) não foi inicializado. Entre em contato com o administrador.',
                adminMessage: 'Acesse a página Gerenciar Modelos Base para inicializar o repositório de modelos base (templates).'
            },
            notConfigured: {
                title: 'Repositório de modelos base (templates) não configurado',
                userMessage: 'O repositório de modelos base (templates) não está configurado. Configure o repositório para acessar os modelos base.'
            },
            notFound: {
                title: 'Repositório de modelos base (templates) não encontrado',
                userMessage: 'O repositório {repoName} não é um repositório válido. Verifique sua configuração.'
            },
            bootstrap: {
                bootstrapping:'Inicializando..',
                title: 'Inicializar repositório de modelos base (templates)',
                description: 'Isso criará a estrutura de pastas necessária dentro do repositório, se ela ainda não existir.',
                action: 'Inicializar',
                success: 'Repositório de modelos base (templates) inicializado com sucesso.',
                error: 'Não foi possível inicializar o repositório de modelos base (templates). Verifique o console do desenvolvedor para mais informações.'
            }
        },
    },
    threatmodel: {
        contributors: 'Contribuidores',
        contributorsPlaceholder: 'Adicionar um novo contribuidor',
        description: 'Descrição de alto nível do sistema (high level system)',
        dragAndDrop: 'Arrastar e soltar ou ',
        editing: 'Edição',
        jsonPaste: 'Arrastar um arquivo JSON de modelo de ameaça ou colar seu conteúdo aqui:',
        owner: 'Proprietário',
        reviewer: 'Revisor',
        title: 'Título',
        diagram: {
            diagrams: 'Diagramas',
            addNewDiagram: 'Adicionar um novo diagrama...',
            generic: {
                defaultTitle: 'Novo diagrama genérico',
                defaultDescription: 'Descrição de novo diagrama genérico',
                select: 'Genérico'
            },
            stride: {
                defaultTitle: 'Novo diagrama STRIDE',
                defaultDescription: 'Descrição de novo diagrama STRIDE',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Novo diagrama LINDDUN',
                defaultDescription: 'Descrição de novo diagrama LINDDUN',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Novo diagrama PLOT4ai',
                defaultDescription: 'Descrição de novo diagrama PLOT4ai',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Novo diagrama CIA-DIE',
                defaultDescription: 'Descrição de novo diagrama CIA-DIE',
                select: 'CIADIE'
            },
            cia: {
                defaultTitle: 'Novo diagrama CIA',
                defaultDescription: 'Descrição de novo diagrama CIA',
                select: 'CIA'
            },
            eop: {
                defaultTitle: 'Novo diagrama EoP jogos',
                defaultDescription: 'Descrição de novo diagrama EoP jogos',
                select: 'EoP jogos'
            }
        },
        threats: 'Ameaças',
        errors: {
            create: 'Não foi possível criar o arquivo de modelo de ameaça. Verifique o console do desenvolvedor para mais informações.',
            dropSingleFileOnly: 'Arrastar e soltar requer um arquivo único',
            invalidJson: 'JSON inválido. Por favor, confira seu modelo e tente novamente',
            invalidModel: 'Threat Dragon não consegue entender este Modelo de Ameaça. Por favor, configura seu modelo e tente novamente',
            onlyJsonAllowed: 'Apenar arquivos com extensão .json são suportados',
            open: 'Erro ao abrir este Modelo de Ameaça. Confira o console do desenvolvedor para mais informações',
            save: 'Erro ao salvar este Modelo de Ameaça. Confira o console do desenvolvedor para mais informações',
            createConflict: 'Já existe um modelo de ameaça com este nome. Use um nome diferente.'
        },
        warnings: {
            export: 'Não foi possível exportar o modelo de ameaça. Verifique o console do desenvolvedor para mais informações.',
            jsonSchema: 'Modelo não corresponde estritamente com o esquema. Detalhes no console do desenvolvedor',
            noModelOpen: 'Nenhum modelo aberto',
            otmUnsupported: 'A importação do formato de arquivo Open Threat Model ainda não é suportada.',
            save: 'Não foi possível salvar o modelo de ameaça. Verifique o console do desenvolvedor para mais informações.',
            tmUnsupported: 'A importação do formato de arquivo TM-BOM é experimental e está sujeita a alterações que podem quebrar modelos.',
            v1Translate: 'Importar modelos versão 1.x serão atualizadas para os esquemas versão 2.0'
        },
        prompts: {
            created: 'Modelo de ameaça criado com sucesso',
            exported: 'Modelo de ameaça exportado',
            opened: 'Modelo de Ameaça aberto com sucesso',
            downloading: 'Baixando modelo de ameaça',
            saved: 'Modelo de Ameaça salvo com sucesso'
        },
        properties: {
            title: 'Propriedades',
            emptyState: 'Selecione um elemento do diagrama para modificar suas propriedades',
            name: 'Nome',
            text: 'Texto',
            description: 'Descrição',
            outOfScope: 'Fora do Escopo',
            bidirection: 'Bidirecional',
            reasonOutOfScope: 'Razão por estar fora de escopo',
            handlesCardPayment: 'Pagamento com cartão',
            handlesGoodsOrServices: 'Bens ou serviços',
            isALog: 'É um Log',
            isEncrypted: 'Criptografado',
            isSigned: 'Assinado',
            isWebApplication: 'Aplicação Web',
            privilegeLevel: 'Nível de Privilégio',
            providesAuthentication: 'Fornecimento de Autenticação',
            protocol: 'Protocolo',
            publicNetwork: 'Rede Pública',
            storesCredentials: 'Armazenamento de Credenciais',
            storesInventory: 'Estoque de Armazenamento',
        },
        buttons: {
            delete: 'Deletar selecionado',
            redo: 'Refazer edição',
            shortcuts: 'Atalhos de teclado',
            toggleGrid: 'Alternar grade',
            undo: 'Desfazer edição',
            zoomIn: 'Aumentar o zoom',
            zoomOut: 'Diminuir o zoom',
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
                action: 'Salvar'
            }
        },
        stencil: {
            boundaries: 'Limites',
            components: 'Componentes',
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
        apply: 'Aplicar',
        cancel: 'Cancelar',
        close: 'Fechar',
        closeModel: 'Fechar Modelo',
        delete: 'Deletar',
        discardTitle: 'Descartar mudanças?',
        discardMessage: 'Você tem certeza que quer descartar suas mudanças?',
        duplicate: 'Duplicar',
        edit: 'Editar',
        export: 'Exportar',
        exportAs: 'Exportar Modelo como',
        exportHtml: 'Relatório HTML',
        exportPdf: 'Relatório PDF',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Importar',
        ok: 'OK',
        open: 'Abrir',
        openModel: 'Abrir Modelo',
        print: 'Imprimir',
        reload: 'Recarregar',
        remove: 'Remover',
        report: 'Relatório',
        save: 'Salvar',
        saveAs: 'Salvar como',
        saveModel: 'Salvar Modelo',
        saveModelAs: 'Salvar Modelo como',
        search: 'Buscar',
        next: 'próximo',
        previous: 'anterior',
        manage: 'Gerenciar...',
        exportTemplate: 'Exportar como modelo base'
    },
    cards: {
        details: 'Detalhes do cartão',
        noDetails: 'nenhum detalhe disponível',
        unknown: 'Desconhecido',
        properties: {
            suit: 'Categoria',
            number: 'Número'
        },
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidencialidade',
                integrity: 'Integridade',
                availability: 'Disponibilidade'
            },
            ciadie: {
                header: '--- CIA-DIE ---',
                confidentiality: 'Confidencialidade',
                integrity: 'Integridade',
                availability: 'Disponibilidade',
                distributed: 'Distribuído',
                immutable: 'Imutável',
                ephemeral: 'Efêmero'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Ligabilidade',
                identifiability: 'Identificabilidade',
                nonRepudiation: 'Não-repúdio',
                detectability: 'Detectabilidade',
                disclosureOfInformation: 'Divulgação de informações',
                unawareness: 'Desconhecido',
                nonCompliance: 'Não conformidade'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Técnica e Processos',
                accessibility: 'Acessibilidade',
                identifiabilityLinkability: 'Identificabilidade e Ligabilidade',
                security: 'Segurança',
                safety: 'Seguro',
                unawareness: 'Desconhecido',
                ethicsHumanRights: 'Ética e Direitos Humanos',
                nonCompliance: 'Não conformidade'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'Falsificação',
                tampering: 'Adulteração',
                repudiation: 'Repúdio',
                informationDisclosure: 'Divulgação de informações',
                denialOfService: 'Negação de serviço',
                elevationOfPrivilege: 'Elevação de privilégio'
            }
        },
        generic: {
            dafault: 'Nova ameaça genérica',
            cia : 'Nova ameaça CIA',
            die : 'Nova ameaça CIA-DIE',
            linddun : 'Nova ameaça LINDDUN',
            plot4ai : 'Nova ameaça PLOT4ai',
            stride: 'Nova ameaça STRIDE',
            eop: 'Nova ameaça EoP jogos'
        },
        edit: 'Editar Ameaça',
        confirmDeleteTitle: 'Confirma Exclusão',
        confirmDeleteMessage: 'Você tem certeza que quer excluir esta ameaça?',
        description: 'Forneça uma descrição para esta ameaça',
        emptyThreat: 'Selecione um elemento do gráfico para adicionar uma nova ameaça',
        mitigation: 'Forneça uma mitigação para esta ameaça ou a ração para o status N/A',
        newThreat: 'Nova Ameaça',
        newThreatByType: 'Nova Ameaça por Tipo',
        newThreatByContext: 'Nova Ameaça por Contexto',
        properties: {
            description: 'Descrição',
            mitigation: 'Mitigação',
            modelType: 'Tipo de Modelo',
            number: 'Número',
            severity: 'Severidade',
            score: 'Pontuação',
            status: 'Status',
            title: 'Título',
            type: 'Tipo'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Aberta',
            mitigated: 'Mitigada'
        },
        severity: {
            tbd: 'A definir',
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta',
            critical: 'Crítica'
        },
        validation: {
            error: 'O número do cartão é obrigatório.',
            cardNumberRequired: 'Você deve selecionar um número de cartão antes de salvar.'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Mostrar os elementos fora do escopo',
            showMitigatedThreats: 'Mostrar ameaças mitigadas',
            showModelDiagrams: 'Mostrar diagramas do modelo',
            showEmpty: 'Mostrar elementos vazios',
            showProperties: 'Mostrar propriedades',
            showBranding: 'Logomarca do Threat Dragon'
        },
        title: 'Relatório do modelo de ameaças para',
        dateGenerated : 'Data de geração',
        executiveSummary : 'Resumo Executivo',
        notProvided : 'Não fornecido',
        summary: 'Resumo',
        threatStats : {
            total: 'Ameaças totais',
            mitigated: 'Total Mitigada',
            notApplicable: 'Total Não Aplicável',
            notMitigated : 'Não Mitigada',
            openCritical : 'Aberta / Severidade Crítica',
            openHigh : 'Aberta / Severidade Alta',
            openMedium : 'Aberta / Severidade Média',
            openLow : 'Aberta / Severidade Baixa',
            openTbd : 'Aberta / Severidade A Definir',
            openUnknown : 'Aberta / Severidade Desconhecida'
        }
    },
    upgrade: {
        modal: {
            header: 'Modelo de Ameaça atualizado',
            welcome: 'Bem-vindo a versão 2 do OWASP Threat Dragon!',
            p1: 'A Versão 2 utiliza uma biblioteca de desenho diferente, o que alterará a forma como partes dos seus modelos de ameaça são salvas. Embora a maioria dos diagramas parecerá igual às versões anteriores do Threat Dragon, em alguns casos pode ser necessário fazer ajustes menores.',
            p2: 'Após fechar este modal, você verá como cada diagrama deste modelo é renderizado no formato da versão 2. Por favor, anote quaisquer diagramas que possam precisar de ajuste. Esta é uma atualização única e você não deverá ver esta mensagem novamente após salvar este modelo.'
        },
        instructions: 'Ótimo! Vamos levá-lo ao seu modelo.',
        continue: 'Continue para Modelo de Ameaça'
    }
};

export default por;
