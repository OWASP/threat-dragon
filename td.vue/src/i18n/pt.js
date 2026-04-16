const por = {
    auth: {
        sessionExpired: 'A sua sessão expirou. Por favor, inicie sessão novamente para continuar.'
    },
    nav: {
        loggedInAs: 'Autenticado como',
        logOut: 'Sair',
        contentManagement: 'Gestor de Conteúdos'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logótipo do Threat Dragon',
        description: 'O OWASP Threat Dragon é uma aplicação gratuita, open-source e multiplataforma para criar modelos de ameaça. Utilize-a para desenhar diagramas de modelação de ameaças e identificar ameaças para o seu sistema. Com ênfase na flexibilidade e simplicidade, é uma ferramenta acessível para todos os tipos de utilizadores.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Iniciar'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Iniciar sessão com'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Iniciar sessão com'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Iniciar sessão com'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Iniciar sessão com'
        },
        local: {
            displayName: 'Sessão Local',
            loginWith: 'Iniciar sessão com'
        }
    },
    dashboard: {
        welcome: {
            title: 'Bem-vindo!',
            description: 'Está pronto para começar a tornar os designs das suas aplicações mais seguros. Pode abrir um modelo de ameaça existente ou criar um novo escolhendo uma das opções em baixo.'
        },
        actions: {
            openExisting: 'Abrir um modelo de ameaça existente',
            createNew: 'Criar um novo modelo de ameaça vazio',
            readDemo: 'Explorar um exemplo de modelo de ameaça',
            importExisting: 'Importar um modelo de ameaça via JSON',
            createFromTemplate: 'Criar modelo de ameaça a partir de um template'
        }
    },
    demo: {
        select: 'Selecione um modelo de ameaça de demonstração da lista abaixo'
    },
    desktop: {
        file: {
            heading: 'Ficheiro',
            clearRecentDocs: 'Limpar menu',
            close: 'Fechar Modelo',
            closeWindow: 'Fechar Janela',
            new: 'Novo Modelo',
            open: 'Abrir Modelo',
            recentDocs: 'Abrir Recentes',
            save: 'Guardar Modelo',
            saveAs: 'Guardar Modelo Como'
        },
        help: {
            heading: 'Ajuda',
            docs: 'Documentação',
            visit: 'Visite-nos em OWASP',
            sheets: 'Folhas de Dicas OWASP',
            github: 'Visite-nos no GitHub',
            submit: 'Submeter um problema',
            check: 'Verificar atualizações ...',
            about: {
                about: 'Acerca',
                version: 'Versão'
            }
        }
    },
    repository: {
        select: 'Selecione um',
        from: 'repositório da lista abaixo para guardar o novo Modelo de Ameaça / escolher um Modelo de Ameaça existente',
        noneFound: 'Nenhum repositório encontrado. Para começar, crie um novo repositório em'
    },
    branch: {
        select: 'Selecione um branch de',
        from: 'da lista em baixo ou',
        chooseRepo: 'escolha outro repositório',
        or: 'ou',
        addNew: 'adicione um novo branch',
        protectedBranch: 'Branch protegido',
        refBranch: 'Branch de referência',
        nameRequired: 'O nome do branch é obrigatório',
        nameExists: 'O nome do branch já existe',
        add: 'adicionar branch',
        cancel: 'Cancelar',
        name: 'nome do branch',
    },
    folder: {
        select: 'Selecione uma',
        from: 'pasta da lista abaixo',
        noneFound: 'Esta pasta está vazia. Pode criar um novo modelo de ameaça aqui.'
    },
    threatmodelSelect: {
        select: 'Selecione um Modelo de Ameaça de',
        from: 'da lista em baixo, ou escolha outro',
        branch: 'branch',
        or: 'ou',
        repo: 'repositório',
        newThreatModel: 'Criar um Novo Modelo de Ameaça'
    },
    template: {
        startFromLocalTemplate: 'Iniciar a partir de um Template Local',
        select: 'Selecione um Template da lista em baixo',
        selectDescription: 'Os templates fornecem um ponto de partida para novos modelos de ameaça, pré-preenchidos com componentes e ameaças relevantes.',
        noTemplates: 'Nenhum template encontrado',
        templatesLocalSession: 'Templates remotos não estão disponíveis para sessões locais.',
        search: 'Pesquisar templates...',
        exportTemplate: 'Exportar como Template',
        tags: 'Etiquetas (tags)',
        name: 'Nome do Template',
        description: 'Descrição do Template',
        saveTemplate: 'Guardar Template',
        addNew: 'Adicionar Novo Template',
        manage: 'Gerir Templates',
        manageDescription: 'Importe, exporte e faça a gestão dos seus templates de modelo de ameaça aqui.',
        editTemplate: 'Editar Template',
        addTagsPlaceholder: 'Adicionar etiquetas (tags)...',
        updateSuccess: 'Template atualizado com sucesso',
        importSuccess: 'Template importado com sucesso',
        deleteSuccess: 'Template eliminado com sucesso',
        deleteTitle: 'Confirmar Eliminação',
        deleteConfirm: 'Tem a certeza de que deseja eliminar "{name}"?',
        errors: {
            invalidJson: 'JSON inválido. Por favor, verifique o seu ficheiro de template e tente novamente.',
            invalidTemplate: 'Formato de template inválido. Por favor, verifique o seu ficheiro de template e tente novamente.',
            loadFailed: 'Falha ao carregar templates. Por favor, tente novamente.',
            duplicateTemplate: 'Já existe um template com este nome. Por favor, utilize um nome diferente.',
            updateFailed: 'Falha ao atualizar template',
            deleteFailed: 'Falha ao eliminar template'
        },
        warnings: {
            templateSave: 'Não foi possível guardar o template. Verifique a consola do programador para mais informações.',
            invalidSchema: 'O template não corresponde estritamente ao esquema. Detalhes na consola do programador.'
        },
        prompts: {
            templateSaved: 'Template guardado com sucesso',
            templateDownloading: 'A descarregar template'
        },
        repo: {
            notInitialized: {
                title: 'Repositório de Templates Não Inicializado',
                userMessage: 'O repositório de templates não foi inicializado. Por favor, contacte o administrador.',
                adminMessage: 'Por favor, vá à página Gerir Templates para inicializar o repositório de templates.'
            },
            notConfigured: {
                title: 'Repositório de Templates Não Configurado',
                userMessage: 'O repositório de templates não está configurado. Por favor, configure o repositório para aceder aos templates.'
            },
            notFound: {
                title: 'Repositório de Templates Não Encontrado',
                userMessage: 'O repositório {repoName} não é um repositório válido. Por favor, verifique a sua configuração.'
            },
            bootstrap: {
                bootstrapping: 'A iniciar...',
                title: 'Iniciar Repositório de Templates',
                description: 'Isto criará a estrutura de pastas necessária dentro do repositório, se ainda não existir.',
                action: 'Iniciar',
                success: 'Repositório de templates iniciado com sucesso.',
                error: 'Não foi possível iniciar o repositório de templates. Verifique a consola do programador para mais informações.'
            }
        },
    },
    threatmodel: {
        contributors: 'Contribuidores',
        contributorsPlaceholder: 'Comece a digitar para adicionar um contribuidor',
        description: 'Descrição geral do sistema',
        dragAndDrop: 'Arrastar e soltar ou ',
        editing: 'A editar',
        jsonPaste: 'Solte um ficheiro JSON de modelo de ameaça ou cole o seu conteúdo aqui:',
        owner: 'Proprietário',
        reviewer: 'Revisor',
        title: 'Título',
        diagram: {
            diagrams: 'Diagramas',
            addNewDiagram: 'Adicionar um novo diagrama...',
            generic: {
                defaultTitle: 'Novo diagrama genérico',
                defaultDescription: 'Descrição do novo diagrama genérico',
                select: 'Genérico'
            },
            stride: {
                defaultTitle: 'Novo diagrama STRIDE',
                defaultDescription: 'Descrição do novo diagrama STRIDE',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Novo diagrama LINDDUN',
                defaultDescription: 'Descrição do novo diagrama LINDDUN',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Novo diagrama PLOT4ai',
                defaultDescription: 'Descrição do novo diagrama PLOT4ai',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Novo diagrama CIA-DIE',
                defaultDescription: 'Descrição do novo diagrama CIA-DIE',
                select: 'CIADIE'
            },
            cia: {
                defaultTitle: 'Novo diagrama CIA',
                defaultDescription: 'Descrição do novo diagrama CIA',
                select: 'CIA'
            },
            eop: {
                defaultTitle: 'Novo diagrama EoP jogos',
                defaultDescription: 'Descrição do novo diagrama EoP jogos',
                select: 'EoP Jogos'
            }
        },
        threats: 'Ameaças',
        errors: {
            create: 'Não foi possível criar o ficheiro de modelo de ameaça. Verifique a consola do programador para mais informações.',
            dropSingleFileOnly: 'Arrastar e soltar requer um único ficheiro.',
            invalidJson: 'JSON inválido. Por favor, verifique o seu modelo e tente novamente.',
            invalidModel: 'O ficheiro de modelo de ameaça não é válido. Por favor, verifique o seu modelo e tente novamente.',
            onlyJsonAllowed: 'Apenas ficheiros com extensão .json são suportados.',
            open: 'Erro ao abrir este Modelo de Ameaça. Verifique a consola do programador para mais informações.',
            save: 'Erro ao guardar o Modelo de Ameaça. Verifique a consola do programador para mais informações.',
            createConflict: 'Já existe um modelo de ameaça com este nome. Por favor, utilize um nome diferente.'
        },
        warnings: {
            export: 'Não foi possível exportar o Modelo de Ameaça. Verifique a consola do programador para mais informações.',
            jsonSchema: 'O modelo não corresponde estritamente ao esquema. Detalhes na consola do programador.',
            noModelOpen: 'Nenhum modelo aberto',
            otmUnsupported: 'A importação do formato de ficheiro Open Threat Model ainda não é suportada.',
            save: 'Não foi possível guardar o Modelo de Ameaça. Verifique a consola do programador para mais informações.',
            tmUnsupported: 'A importação do formato de ficheiro TM-BOM é experimental e está sujeita a alterações que podem quebrar modelos.',
            v1Translate: 'Os modelos importados da versão 1.x serão atualizados para o esquema da versão 2.0.'
        },
        prompts: {
            created: 'Modelo de ameaça criado com sucesso',
            exported: 'Modelo de ameaça exportado',
            opened: 'Modelo de ameaça aberto com sucesso',
            downloading: 'A descarregar modelo de ameaça',
            saved: 'Modelo de ameaça guardado com sucesso'
        },
        properties: {
            title: 'Propriedades',
            emptyState: 'Selecione um elemento no diagrama para editar',
            name: 'Nome',
            text: 'Texto',
            description: 'Descrição',
            outOfScope: 'Fora do âmbito',
            bidirection: 'Bidirecional',
            reasonOutOfScope: 'Razão para estar fora do âmbito',
            handlesCardPayment: 'Pagamento com cartão',
            handlesGoodsOrServices: 'Bens ou Serviços',
            isALog: 'É um registo',
            isEncrypted: 'Encriptado',
            isSigned: 'Assinado',
            isWebApplication: 'Aplicação Web',
            privilegeLevel: 'Nível de privilégio',
            providesAuthentication: 'Fornece autenticação',
            protocol: 'Protocolo',
            publicNetwork: 'Rede pública',
            storesCredentials: 'Armazena credenciais',
            storesInventory: 'Armazena inventário',
        },
        buttons: {
            delete: 'Eliminar selecionado',
            redo: 'Refazer edição',
            shortcuts: 'Atalhos de teclado',
            toggleGrid: 'Alternar grelha',
            undo: 'Desfazer edição',
            zoomIn: 'Aumentar zoom',
            zoomOut: 'Diminuir zoom',
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
                action: 'Eliminar'
            },
            pan: {
                shortcut: 'shift + clique esquerdo (segurar/arrastar)',
                action: 'Mover'
            },
            multiSelect: {
                shortcut: 'clique esquerdo no espaço vazio e arrastar',
                action: 'Seleção múltipla'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + roda do rato',
                action: 'Zoom'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Guardar'
            }
        },
        stencil: {
            boundaries: 'Limites',
            components: 'Componentes',
            entities: 'Entidades',
            metadata: 'Metadados',
            search: 'Pesquisar',
            notFound: 'Ainda não temos isso, e que tal abrir um issue? :)'
        },
        shapes: {
            actor: 'Ator',
            flow: 'Fluxo de Dados',
            flowStencil: 'Fluxo de Dados',
            process: 'Processo',
            store: 'Armazenamento',
            text: 'Texto descritivo',
            trustBoundary: 'Limite de Confiança'
        }
    },
    forms: {
        apply: 'Aplicar',
        cancel: 'Cancelar',
        close: 'Fechar',
        closeModel: 'Fechar Modelo',
        delete: 'Eliminar',
        discardTitle: 'Descartar alterações?',
        discardMessage: 'Tem a certeza de que quer descartar as suas alterações?',
        duplicate: 'Duplicar',
        edit: 'Editar',
        export: 'Exportar',
        exportAs: 'Exportar Modelo Como',
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
        save: 'Guardar',
        saveAs: 'Guardar Como',
        saveModel: 'Guardar Modelo',
        saveModelAs: 'Guardar Modelo Como',
        search: 'Pesquisar',
        next: 'próximo',
        previous: 'anterior',
        manage: 'Gerir...',
        exportTemplate: 'Exportar como Template'
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
                ephemeral: 'Efémero'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Associabilidade',
                identifiability: 'Identificabilidade',
                nonRepudiation: 'Não repúdio',
                detectability: 'Detetabilidade',
                disclosureOfInformation: 'Divulgação de informações',
                unawareness: 'Desconhecimento',
                nonCompliance: 'Não conformidade'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Técnica e Processos',
                accessibility: 'Acessibilidade',
                identifiabilityLinkability: 'Identificabilidade e Associabilidade',
                security: 'Segurança',
                safety: 'Seguro',
                unawareness: 'Desconhecimento',
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
            },
            eop: {
                header: '--- EoP ---',
                dataValidationAndEncoding: 'Data Validation & Encoding', 
                authentication: 'Authentication', 
                sessionManagement: 'Session Management', 
                authorization: 'Authorization', 
                cryptography: 'Cryptography', 
                cornucopia: 'Cornucopia',
                wildCard: 'Wild Card'
            }
        },
        generic: {
            default: 'Nova ameaça genérica',
            cia: 'Nova ameaça CIA',
            ciadie: 'Nova ameaça CIA-DIE',
            linddun: 'Nova ameaça LINDDUN',
            plot4ai: 'Nova ameaça PLOT4ai',
            stride: 'Nova ameaça STRIDE',
            eop: 'Nova ameaça EoP'
        },
        edit: 'Editar Ameaça',
        confirmDeleteTitle: 'Confirmar Eliminação',
        confirmDeleteMessage: 'Tem a certeza de que realmente quer eliminar a ameaça?',
        description: 'Forneça uma descrição para a ameaça',
        emptyThreat: 'Selecione um elemento no diagrama para adicionar a ameaça',
        mitigation: 'Forneça uma mitigação para a ameaça ou uma razão se o estado for N/A',
        newThreat: 'Nova Ameaça',
        newThreatByType: 'Nova Ameaça por Tipo',
        newThreatByContext: 'Nova Ameaça por Contexto',
        properties: {
            description: 'Descrição',
            mitigation: 'Mitigações',
            modelType: 'Tipo de Modelo',
            number: 'Número',
            severity: 'Severidade',
            score: 'Pontuação',
            status: 'Estado',
            title: 'Título',
            type: 'Tipo'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Aberta',
            mitigated: 'Mitigada'
        },
        severity: {
            tbd: 'Por definir',
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta',
            critical: 'Crítica'
        },
        validation: {
            error: 'O número do cartão é obrigatório.',
            cardNumberRequired: 'Deve selecionar um número de cartão antes de guardar.'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Mostrar elementos fora do âmbito',
            showMitigatedThreats: 'Mostrar ameaças mitigadas',
            showModelDiagrams: 'Mostrar diagramas do modelo',
            showEmpty: 'Mostrar elementos vazios',
            showProperties: 'Mostrar propriedades dos elementos',
            showBranding: 'Logótipo do Threat Dragon'
        },
        title: 'Relatório do modelo de ameaças para',
        dateGenerated: 'Data de geração',
        executiveSummary: 'Resumo Executivo',
        notProvided: 'Não fornecido',
        summary: 'Resumo',
        threatStats: {
            total: 'Total de Ameaças',
            mitigated: 'Total Mitigadas',
            notApplicable: 'Total Não Aplicáveis',
            notMitigated: 'Total Abertas',
            openCritical: 'Abertas / Severidade Crítica',
            openHigh: 'Abertas / Severidade Alta',
            openMedium: 'Abertas / Severidade Média',
            openLow: 'Abertas / Severidade Baixa',
            openTbd: 'Abertas / Severidade Por Definir',
            openUnknown: 'Abertas / Severidade Desconhecida'
        }
    },
    upgrade: {
        modal: {
            header: 'Atualização do Modelo de Ameaça',
            welcome: 'Bem-vindo à versão 2 do OWASP Threat Dragon!',
            p1: 'A versão 2 utiliza uma biblioteca de desenho diferente, o que alterará a forma como partes dos seus modelos de ameaça são guardadas. Embora a maioria dos diagramas pareça igual às versões anteriores do Threat Dragon, em alguns casos podem necessitar de pequenos ajustes.',
            p2: 'Após fechar esta janela, verá como cada diagrama deste modelo é renderizado no formato da versão 2. Por favor, anote quaisquer diagramas que possam precisar de ajustes. Esta é uma atualização única e não deverá ver esta mensagem novamente depois de guardar este modelo.'
        },
        instructions: 'Ótimo! Vamos levá-lo ao seu modelo.',
        continue: 'Continuar para o Modelo de Ameaça'
    }
};

export default por;
