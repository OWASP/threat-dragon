const por = {
    auth: {
        sessionExpired: 'Sua sessão expirou. Por favor, faça login novamente para continuar.'
    },
    operator: {
        heading: 'Operador',
        operatedby: 'Este site e instância do OWASP Threat Dragon é operado por:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'o operador deste site'}`,
        contact: 'Contato: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(informações de contato não fornecidas)'),
    },
    tos: {
        title: 'Termos de Serviço',
        lastUpdated: '4 de abril de 2025',
        introduction: 'Bem-vindo à nossa instância do OWASP Threat Dragon. Estes Termos de Uso ("Termos") regem seu acesso e uso deste site, que é uma instância de um aplicativo web de código aberto disponibilizado pelo operador listado acima ("O Operador").',
        sections: [
            {
                heading: '1. Aceitação dos Termos',
                content: 'Ao acessar e usar este site, você aceita e concorda em cumprir os termos e disposições deste acordo. Se você não concordar com estes termos, por favor, não use este site.'
            },
            {
                heading: '2. Uso do Site',
                content: 'Você pode usar o site apenas para fins legais. Você concorda em não abusar, interromper ou tentar obter acesso não autorizado ao site ou seus sistemas subjacentes.'
            },
            {
                heading: '3. Sem Garantia',
                content: 'O site é fornecido "como está" sem garantias de qualquer tipo, expressas ou implícitas, incluindo, mas não se limitando a, adequação a uma finalidade específica, disponibilidade ou precisão. Não garantimos operação ininterrupta ou livre de erros.'
            },
            {
                heading: '4. Limitação de Responsabilidade',
                content: 'Na extensão máxima permitida por lei, o Operador não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou incapacidade de usar o site.'
            },
            {
                heading: '5. Software de Código Aberto',
                content: 'Este site executa o software OWASP Threat Dragon, e seu código-fonte está disponível em https://www.github.com/OWASP/threat-dragon. Seu uso do software está sujeito aos termos de sua licença de código aberto. Não somos responsáveis pelo software em si, apenas pela operação desta instância. O operador deste site não é afiliado à OWASP.'
            },
            {
                heading: '6. Alterações nos Termos',
                content: 'O Operador pode atualizar estes Termos a qualquer momento. O uso contínuo do site após as alterações constitui aceitação dos Termos atualizados.'
            },
            {
                heading: '7. Rescisão',
                content: 'O Operador reserva-se o direito de suspender ou encerrar o acesso ao site a critério do Operador, sem aviso prévio, por qualquer motivo.'
            },
            {
                heading: '8. Lei Aplicável',
                content: 'Estes Termos são regidos pelas leis da jurisdição em que o Operador está sediado (no caso de uma organização) ou reside (no caso de um indivíduo), sem considerar princípios de conflito de leis.'
            }
        ],
        contact: 'Se você tiver alguma dúvida sobre estes Termos, entre em contato com o operador.'
    },
    privacy: {
        title: 'Política de Privacidade',
        lastUpdated: '4 de abril de 2025',
        introduction: 'O Operador deste site está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como suas informações são tratadas.',
        sections: [
            {
                heading: 'Uso Mínimo de Dados para Operações',
                content: 'O Operador não coleta, armazena ou processa dados pessoais dos usuários para rastreamento, criação de perfil ou compartilhamento com terceiros. Logs temporários, que podem incluir endereços IP ou nomes de usuário, são gerados exclusivamente para fins operacionais e de depuração. Esses logs são descartados em um curto período de tempo e não são retidos ou usados além desses propósitos limitados.'
            },
            {
                heading: 'Conformidade Legal',
                content: 'O Operador só divulgará informações se for obrigado a fazê-lo por lei, como em resposta a uma ordem governamental válida ou intimação. Nesses casos, o Operador cumprirá as obrigações legais aplicáveis.'
            },
            {
                heading: 'Alterações nesta Política',
                content: 'O Operador pode atualizar esta Política de Privacidade de tempos em tempos. Quaisquer alterações serão publicadas nesta página com uma data "Última Atualização" atualizada.'
            },
            {
                heading: 'Contate-nos',
                content: 'Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato com o operador.'
            }
        ]
    },
    nav: {
        v2Warning:
            'Os modelos de ameaça da versão 2.0 não são compatíveis com versões anteriores dos modelos Threat Dragon 1.x. Os modelos da versão 1.x importados serão atualizados para o esquema da versão 2.0',
        loggedInAs: 'Logado como',
        logOut: 'Log out',
        tos: 'Termos de Serviço',
        privacy: 'Política de Privacidade'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo do Threat Dragon',
        description:
            'OWASP Threat Dragon é um aplicativo gratuito, de código aberto e multiplataforma para criar modelos de ameaças. Use-o para desenhar diagramas de modelagem de ameaças e identificar ameaças para seu sistema. Com ênfase na flexibilidade e simplicidade, é facilmente acessível para todos os tipos de usuários.'
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
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'Abrir',
            description:
                'Selecione um arquivo de modelo de ameaça ou pasta de destino do Google Drive',
            saveThreatModel: 'Salvar Modelo de Ameaça no Google Drive',
            saveDescription: 'Selecione uma pasta no Google Drive para salvar seu modelo de ameaça',
            fileName: 'Nome do Arquivo',
            fileNamePlaceholder: 'Digite um nome para seu arquivo',
            selectFolder: 'Selecione uma pasta no Google Drive',
            selectFile: 'Selecione um arquivo do Google Drive',
            selectThreatModel: 'Selecione um Modelo de Ameaça do Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'Desejamos boas-vindas! Ficamos felizes em te ter por aqui!',
            description:
                'Com OWASP Threat Dragon, você terá os mecanismos para tornar os designs de seus aplicativos mais seguros! Você pode abrir um modelo de ameaça (threat model) existente ou criar um modelo do zero! Basta escolher uma das opções abaixo!'
        },
        actions: {
            openExisting: 'Abrir um modelo de ameaça (threat model) existente',
            createNew: 'Criar um novo modelo de ameaça (threat model) do zero',
            readDemo: 'Baixar e explorar um exemplo de modelo de ameaça (threat model)',
            importExisting: 'Importar um modelo de ameaça via JSON'
        }
    },
    demo: {
        select: 'Selecione um modelo de ameaça de demonstração da lista abaixo'
    },
    desktop: {
        file: {
            heading: 'Arquivo',
            clearRecentDocs: 'Limpar Menu',
            close: 'Fechar Modelo',
            closeWindow: 'Fechar Janela',
            new: 'Novo Modelo',
            open: 'Abrir Modelo',
            recentDocs: 'Abrir Recente',
            save: 'Salvar Modelo',
            saveAs: 'Salvar Modelo Como'
        },
        help: {
            heading: 'Ajuda',
            docs: 'Documentação',
            visit: 'Visite-nos na OWASP',
            sheets: 'Folhas de Dicas OWASP',
            github: 'Visite-nos no GitHub',
            submit: 'Enviar um Problema',
            check: 'Verificar atualizações ...'
        }
    },
    repository: {
        select: 'Selecionar',
        from: 'repositório da lista abaixo',
        noneFound: 'Nenhum repositório encontrado. Para começar, crie um novo repositório em'
    },
    branch: {
        select: 'Selecionar uma branch',
        from: 'da lista abaixo ou',
        chooseRepo: 'escolher outro repositório',
        or: 'ou',
        addNew: 'adicionar um novo branch',
        protectedBranch: 'Branch protegida',
        nameRequired: 'Nome da branch é obrigatório',
        nameExists: 'Nome da branch já existe',
        refBranch: 'Branch de referência',
        add: 'Adicionar branch',
        cancel: 'Cancelar',
        name: 'Nome da branch'
    },
    folder: {
        select: 'Selecionar',
        from: 'pasta da lista abaixo',
        noneFound: 'Esta pasta está vazia. Você pode criar um novo modelo de ameaça aqui.'
    },
    threatmodelSelect: {
        select: 'Selecione um Modelo de Ameaça de',
        from: 'da lista abaixo, ou escolher outra',
        branch: 'branch',
        or: 'ou',
        repo: 'repositório',
        newThreatModel: 'Criar um Novo Modelo de Ameaça'
    },
    threatmodel: {
        contributors: 'Contribuidores',
        contributorsPlaceholder: 'Adicionar um novo contribuidor',
        description: 'Descrição de alto nível do sistema (high level system)',
        dragAndDrop: 'Arraste e solte ou ',        jsonPaste: 'Solte um arquivo JSON de modelo de ameaça ou cole seu conteúdo aqui:',
        owner: 'Proprietário',
        reviewer: 'Revisor',
        title: 'Título',
        new: {
            title: 'Criar Novo Modelo de Ameaça',
            description: 'Insira informações sobre seu novo modelo de ameaça'
        },
        edit: {
            title: 'Editar Modelo de Ameaça',
            description: 'Modificar informações sobre seu modelo de ameaça'
        },
        placeholder: {
            title: 'Título do Modelo de Ameaça',
            owner: 'Nome do Proprietário ou Equipe',
            description: 'Insira uma descrição de alto nível do sistema sendo modelado',
            reviewer: 'Nome do Revisor'
        },        diagram: {
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
                defaultTitle: 'Novo diagrama DIE',
                defaultDescription: 'Descrição do novo diagrama DIE',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Novo diagrama CIA',
                defaultDescription: 'Descrição do novo diagrama CIA',
                select: 'CIA'
            }
        },
        threats: 'Ameaças',
        errors: {
            dropSingleFileOnly: 'Arrastar e soltar requer um único arquivo.',
            invalidJson: 'JSON inválido. Por favor, verifique seu modelo e tente novamente.',
            onlyJsonAllowed: 'Apenas arquivos com extensão .json são suportados.',
            open: 'Erro ao abrir este Modelo de Ameaça. Verifique o console do desenvolvedor para mais informações',
            save: 'Erro ao salvar o Modelo de Ameaça. Verifique o console do desenvolvedor para mais informações',
            googleDriveSave: 'Erro ao salvar no Google Drive. Certifique-se de ter as permissões adequadas.'
        },
        localFilePicker: {
            title: 'Selecione um Arquivo de Modelo de Ameaça',
            noFiles: 'Nenhum arquivo neste diretório',
            errors: {
                loadDirectory: 'Erro ao carregar diretório. Por favor, tente novamente.'
            }
        },
        opened: 'Modelo de ameaça aberto com sucesso',
        saved: 'Modelo de ameaça salvo com sucesso',
        properties: {
            title: 'Propriedades',
            emptyState: 'Selecione um elemento do diagrama para modificar suas propriedades',
            name: 'Nome',
            text: 'Texto',
            description: 'Descrição',
            outOfScope: 'Fora do Escopo',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Razão por estar fora de escopo',
            handlesCardPayment: 'Pagamento com cartão',
            handlesGoodsOrServices: 'Bens ou Serviços',
            isALog: 'É um Log',
            isEncrypted: 'Criptografado',
            isSigned: 'Assinado',
            isWebApplication: 'Aplicação Web',
            privilegeLevel: 'Nível de Privilégio',
            providesAuthentication: 'Fornecimento de Autenticação',
            protocol: 'Protocolo',
            publicNetwork: 'Rede Pública',
            storesCredentials: 'Armazenamento de Credenciais',
            storesInventory: 'Armazena Inventário'
        },
        controlButtons: {
            delete: 'Excluir selecionado',
            redo: 'Refazer edição',
            shortcuts: 'Atalhos de teclado',
            toggleGrid: 'Alternar grade',
            undo: 'Desfazer edição',
            zoomIn: 'Ampliar',
            zoomOut: 'Reduzir',
            save: 'Salvar'
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
        discardTitle: 'Descartar Alterações?',
        discardMessage: 'Tem certeza de que deseja descartar suas alterações?',
        edit: 'Editar',
        create: 'Criar',
        export: 'Exportar',
        exportAs: 'Exportar Modelo Como',
        exportHtml: 'HTML Reporte',
        exportPdf: 'PDF Reporte',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Importar',
        ok: 'OK',
        open: 'Abrir',
        openModel: 'Abrir Modelo',
        print: 'Imprimir',
        reload: 'Recarregar',
        remove: 'Remover',
        report: 'Reporte',
        save: 'Salvar',
        saveAs: 'Salvar Como',
        saveModel: 'Salvar Modelo',
        saveModelAs: 'Salvar Modelo Como',
        search: 'Pesquisar',
        next: 'próximo',
        previous: 'anterior',
        requiredField: 'Campo obrigatório'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidencialidade',
                integrity: 'Integridade',
                availability: 'Disponibilidade'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distribuído',
                immutable: 'Imutável',
                ephemeral: 'Efêmero'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Vinculabilidade',
                identifiability: 'Identificabilidade',
                nonRepudiation: 'Não-repúdio',
                detectability: 'Detectabilidade',
                disclosureOfInformation: 'Divulgação de informações',
                unawareness: 'Falta de consciência',
                nonCompliance: 'Não conformidade'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Técnica & Processos',
                accessibility: 'Acessibilidade',
                identifiabilityLinkability: 'Identificabilidade & Vinculabilidade',
                security: 'Segurança',
                safety: 'Proteção',
                unawareness: 'Falta de consciência',
                ethicsHumanRights: 'Ética & Direitos Humanos',
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
            default: 'Nova ameaça genérica',
            cia: 'Nova ameaça da CIA',
            die: 'Nova ameaça da DIE',
            linddun: 'Nova ameaça LINDDUN',
            plot4ai: 'Nova ameaça PLOT4ai',
            stride: 'Nova ameaça STRIDE'
        },
        new: 'Nova Ameaça',
        edit: 'Editar Ameaça',
        confirmDeleteTitle: 'Confirmar Exclusão',
        confirmDeleteMessage: 'Tem certeza de que realmente deseja excluir esta ameaça?',
        description: 'Forneça uma descrição para esta ameaça',
        emptyThreat: 'Selecione um elemento no gráfico para adicionar uma ameaça',
        mitigation: 'Forneça uma mitigação para esta ameaça ou uma razão se o status for N/A',
        newThreat: 'Nova Ameaça',
        newThreatByType: 'Nova Ameaça por Tipo',
        newThreatByContext: 'Nova Ameaça por Contexto',
        properties: {
            description: 'Descrição',
            mitigation: 'Mitigações',
            modelType: 'Tipo de Modelo',
            number: 'Número',
            priority: 'Prioridade',
            score: 'Pontuação',
            status: 'Status',
            title: 'Título',
            type: 'Tipo'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Aberto',
            mitigated: 'Mitigado'
        },
        priority: {
            tbd: 'A Definir',
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta',
            critical: 'Crítica'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Mostrar elementos fora do escopo',
            showMitigatedThreats: 'Mostrar ameaças mitigadas',
            showModelDiagrams: 'Mostrar diagramas do modelo',
            showEmpty: 'Mostrar elementos vazios',
            showProperties: 'Mostrar propriedades dos elementos',
            showBranding: 'Logo do Threat Dragon'
        },
        title: 'Relatório do modelo de ameaças para',
        dateGenerated: 'Data Gerada',
        executiveSummary: 'Resumo Executivo',
        notProvided: 'Não fornecido',
        summary: 'Resumo',
        threatStats: {
            total: 'Ameaças totais',
            mitigated: 'Total Mitigado',
            notMitigated: 'Não atenuado',
            openCritical: 'Abrir / Crítica Prioridade',
            openHigh: 'Abrir / Alta Prioridade',
            openMedium: 'Abrir / Prioridade Média',
            openLow: 'Abrir / Baixa Prioridade',
            openTbd: 'Abrir / TBD Prioridade',
            openUnknown: 'Prioridade Aberta / Desconhecida'
        }
    }
};

export default por;
