const pt = {
    auth: {
            sessionExpired : 'Sua sessão expirou. Faça login novamente para continuar.'
    },
    nav: {
    v2Warning: 'Esta é a versão 2.0 do OWASP Threat Dragon, que ainda está dentro desenvolvimento . Por favor , não use isso _ versão para editar modelos já existente , um dessa vez _ versão posso quebre-os !',
            loggedInAs : ' Logado como '
    },
    home: {
    title: 'OWASP Threat Dragon',
            imgAlt : 'Logotipo do Dragão da Ameaça',
    description: 'Threat Dragon é uma ferramenta de modelagem de ameaças gratuita e de código aberto da OWASP que pode ser usada via desktop para Windows , MacOS e Linux ou Como um aplicativo da web . A aplicativo de desktop é ótimo se você ele quer experimente sem _ conceder Acesso para o seus Repositórios GitHub. No entanto , se você escolha a versão web , você pode libere o incrível poder do GitHub em seus modelos de ameaças ! _ Obviamente , para fazer isso será _ requeridos faça login no GitHub e permita o acesso para repositório de interesse!',
            loginWith : 'Login com'
    },
    providors: {
            github : {
                displayName : 'GitHub'
        },
    local: {
                displayName : ' Sessão Local'
        }
    },
    dashboard: {
    welcome: {
    title: ' Damos - lhe as boas- vindas ! nós ficamos feliz dentro vocês Ter por aqui !',
    description: 'Com OWASP Threat Dragon, você terá vocês mecanismos para fazer os desenhos do seu aplicativos a maioria seguro ! Você ele pode abrir um modelo de ameaça existente _ _ ou crie um modelo do zero! Basta escolher uma das opções para baixo !'
        },
    actions: {
                openExisting : ' Abrir um modelo de ameaça existente ' ,
                createNew : ' Criar um novo modelo de ameaça do zero',
    download: 'Baixe e explore um exemplo de modelo de ameaça ' ,
    import: 'Importar um modelo de ameaça via JSON'
        }
    },
    demo: {
    select: 'Selecione um modelo de ameaça de demonstração na lista abaixo'
    },
    desktop: {
    file: {
    heading: 'Arquivo',
    close: 'Fechar Modelo',
    open: 'Modelo Aberto',
    save: 'Salvar modelo',
    saveAs : 'Salvar modelo como'
        },
    help: {
    heading: 'Ajuda',
    docs: 'Documentação',
    visit: 'Visite-nos na OWASP',
    sheets: 'folhas de dicas OWASP',
    github : 'Visite-nos no GitHub',
    submit: 'Enviar um problema',
    check: 'Verificar atualizações ...'
        }
    },
    repository: {
    select: 'escolher ' ,
    from: ' repositório da lista abaixo ',
            noneFound : 'Nenhum repositório encontrado. Para começar, crie um novo repositório em'
    },
    branch: {
    select: ' Selecione um ramo',
    from: 'da lista abaixo de ou ',
            chooseRepo : ' escolha outro repositório '
    },
        threatmodelSelect: {
    select: ' Selecionar um modelo de ameaça de',
    from: 'da lista abaixo , ou escolher outro ',
    branch: 'ramo',
    or: ' ou ',
    repo: ' repositório ',
            newThreatModel : 'Criar um novo modelo de ameaça'
    },
threatmodel: {
    contibutors: ' Contribuintes ',
            contributorsPlaceholder : ' Adicionar um novo colaborador ',
    description : ' Descrição do sistema de alto nível ',
            dragAndDrop : 'Arraste e solte ou ',
    editing: ' Editar ',
            jsonPaste : 'Solte um arquivo JSON de modelo de ameaça ou cole seu conteúdo aqui:',
    owner: ' Proprietário ',
    reviewer: 'Revisor',
    title: ' Título ',
    diagram: {
    diagrams: ' Diagramas ',
                addNewDiagram : ' Adicionar um novo diagrama ...',
    generic: {
                    diagramTitle : 'Novo diagrama genérico',
                    diagramDescription : 'Nova descrição genérica do diagrama',
    selecione: 'Genérico'
    },
    stride: {
                    diagramTitle : 'Novo diagrama STRIDE',
                    diagramDescription : 'Nova descrição do diagrama STRIDE',
    selecione: 'STRIDE'
            },
                linddun: {
                    diagramTitle : 'Novo diagrama LINDDUN',
                    diagramDescription : 'Nova descrição do diagrama LINDDUN',
    select: 'LINDUN'
            },
                cia : {
                    diagramTitle : 'Novo diagrama CIA',
                    diagramDescription : 'Nova descrição do diagrama CIA',
    select: 'CIA'
            }
        },
    threats: 'Ameaças',
    errors: {
                dropSingleFileOnly : 'Arrastar e soltar requer um único arquivo.',
                invalidJson : 'JSON inválido. Verifique seu modelo e tente novamente.',
                onlyJsonAllowed : 'Apenas arquivos que terminam com . json são suportados.',
    open: 'Erro ao abrir este Modelo de Ameaça. Verifique o console do desenvolvedor para obter mais informações',
    save: 'Erro ao salvar o Modelo de Ameaça. Verifique o console do desenvolvedor para obter mais informações'
        },
    opened: 'Modelo de ameaça aberto com sucesso',
    saved: 'Modelo de ameaça salvo com sucesso',
    properties: {
    title: ' Propriedades ',
    emptyState : ' Selecione um elemento do diagrama para modificar sua propriedades ',
    name: 'nome',
    text: ' Texto ',
    description: ' Descrição ',
    outOfScope : 'Fora do escopo ',
    reasonOutOfScope : ' Motivo por estar fora do escopo ',
    privilegeLevel : ' Nível de privilégio ' ,
    isALog : 'É um registro',
    storeCredentials : ' Loja de Credenciais ' ,
    isEncrypted : ' Criptografado ',
    isSigned : ' Assinado ',
    providesAuthentication: ' Fornecer Autenticação ' ,
    protocol: ' Protocolo ',
publicNetwork : ' Rede pública '
        },
    buttons: {
    delete: 'Excluir selecionado',
    redo: 'Refazer edição',
    shortcuts: 'Atalhos de teclado',
    toggleGrid : 'Alternar grade',
    undo: 'Desfazer edição',
    zoomIn : 'Aumentar o zoom',
    zoomOut : 'Afastar'
        },
    shortcuts: {
    title: ' Atalhos ',
    copy: {
    shortcut: '(ctrl/ cmd ) + c',
    action: ' Copiar '
            },
    paste: {
    shortcut: '(ctrl/ cmd ) + v',
    action: ' Colar '
            },
    undo: {
    shortcut: '(ctrl/ cmd ) + z',
    action: ' Desfazer '
            },
    redo: {
    shortcut: '(ctrl/ cmd ) + y',
    action: ' Refazer '
            },
    delete: {
    shortcut: 'del',
    action: ' Excluir '
            },
    pan: {
    shorrtcut: 'shift + botão mouse esquerdo ( segure e arraste )',
    action: ' Mover por tudo o imagem do diagrama '
            },
                multiSelect :{
    shortcut: 'clique no botão rato esquerdo no espaço esvazie e arraste ',
    action: ' Seleção múltiplo '
            },
    zoom: {
    shortcut: '(ctrl/ cmd ) + rolagem do mouse ',
    action: 'Zoom'
            }
        },
    stencil: {
    boundaries: ' Fronteiras ',
    components: 'Componentes',
    entities: ' Entidades ',
    metadata: ' Metadados ',
    search: ' Pesquisar ',
                notFound : ' Ainda não temos isso ! :( Mas, eu gostaria de abrir um problema? :) '
        },
    shapes: {
    actor: ' Ator ',
    flow: ' Fluxo de Dados',
                flowStencil : ' Fluxo de Dados ',
    process: ' Processo ',
    store: ' Armazenamento ',
    text: ' Texto opcional ',
                trustBoundary : ' Limite de confiança '
        }
    },
    forms: {
    apply: 'Aplicar',
    cancel: ' Cancelar ',
    close: ' Fechar ',
            closeModel : 'Fechar Modelo',
    delete: ' Excluir ',
            discardTitle : 'Descartar alterações?',
            discardMessage : 'Tem certeza que deseja descartar suas alterações?',
    edit: ' Editar ',
    import: 'Importar',
    ok: 'OK',
    open: 'Abrir',
            openModel : 'Modelo Aberto',
    print: 'Imprimir',
    reload: ' Recarregar ',
    remove: 'Remover',
    report: 'Relatório ' ,
    save: ' Salvar ',
            saveAs : 'Salvar como',
            saveModel : 'Salvar Modelo',
            saveModelAs : 'Salvar modelo como',
            savePdf : 'Salvar PDF',
    search: 'Pesquisar'
    },
    threats: {
    model: {
cia: {
    header: '--- CIA ---',
    confidentiality: 'Confidencialidade',
    integrity: 'Integridade',
    availability: 'Disponibilidade'
            },
                linddun : {
    header: '--- LINDDUN ---',
                    linkability : ' Vinculabilidade ',
    identifiability: 'Identificabilidade',
                    nonRepudiation : ' Não-repúdio ',
    detectability: 'Detectabilidade',
                    disclosureOfInformation : 'Divulgação de informações',
    unawareness: 'Inconsciência',
                    nonComplicance : 'Não-conformidade'
            },
    stride: {
    header: '--- STRIDE ---',
    spoofing: 'Falsificação',
    tampering: 'Adultação',
    repudiation: 'Repúdio',
                    informationDisclosure : 'Divulgação de informações',
                    denialOfService : 'Negação de serviço',
                    elevationOfPrivilege: ' Elevação de privilégio'
            }
        },
    generic: {
    dafault: 'Nova ameaça genérica',
                cia : 'Nova ameaça da CIA',
                linddun : 'Nova ameaça LINDDUN',
    stride: 'Nova ameaça STRIDE'
        },
    edit: 'Editar Ameaça',
            confirmDeleteTitle : 'Confirmar exclusão',
            confirmDeleteMessage : 'Tem certeza de que deseja realmente excluir esta ameaça?',
    description: 'Forneça uma descrição para esta ameaça',
            emptyThreat : 'Selecione um elemento no gráfico para adicionar uma ameaça',
    mitigation: 'Fornecer mitigação ou prevenção para esta ameaça',
newThreat : 'Nova Ameaça',
            newThreatByType : 'Nova ameaça por tipo',
            newThreatByContext : 'Nova ameaça por contexto',
    properties: {
    description: 'Descrição',
    mitigation: 'Mitigações',
                modelType : 'Tipo de modelo',
    number: 'Número',
    priority: 'Prioridade',
    score: 'Pontuação',
    status: 'Estado',
    title: 'Título',
    type: 'Tipo'
        },
    status: {
                notApplicable : 'N/A',
    open: 'Abrir',
    mitigated: 'Mitigado'
        },
    priority: {
    low: 'baixo',	
    medium: 'Médio',
    high: 'Alto'
        }
    },
    report: {
    options: {
                showOutOfScope : 'Mostrar elementos fora do escopo',
                showMitigatedThreats : 'Mostrar ameaças atenuadas',
                showModelDiagrams : 'Mostrar diagramas de modelos',
                showBranding : 'Mostre a marca do Dragão de Ameaça'
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
    header: ' Atualização do Threatmodel ',
    welcome: 'Bem-vindo à versão 2 do OWASP Threat Dragon!',
    p1: 'A versão 2 usa uma biblioteca de desenho diferente, que mudará a forma como partes de seus modelos de ameaças são salvas. Embora a maioria dos diagramas tenha a mesma aparência das versões anteriores do Threat Dragon, há casos em que eles podem precisar ser ligeiramente ajustados.',
    p2: 'Após fechar este modal, você verá como cada diagrama neste modelo é renderizado no formato da versão 2. Por favor, anote quaisquer diagramas que você possa precisar ajustar. Esta é uma atualização única e você não deverá ver esta mensagem novamente depois de salvar este modelo.'
        },
    instuctions: 'Ótimo! Vamos levá -lo ao seu modelo.',
    continue: 'Continuar para o Modelo de Ameaça'
    }
};
    
    export default pt ;
    
