const pt = {
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
            download: 'Baixar e explorar um exemplo de modelo de ameaça (threat model)'
        }
    },
    repository: {
        select: 'Selecionar',
        from: 'repositório da lista abaixo'
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
        repo: 'repositório'
    },
    threatmodel: {
        owner: 'Proprietário',
        reviewer: 'Revisor',
        contributors: 'Contribuidores',
        contributorsPlaceholder: 'Adicionar um novo contribuidor',
        description: 'Descrição de alto nível do sistema (high level system)',
        editing: 'Edição',
        title: 'Título',
        diagram: {
            diagrams: 'Diagramas',
            addNewDiagram: 'Adicionar um novo diagrama...'
        },
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
            entities: 'Entidades',
            boundaries: 'Limites',
            metadata: 'Metadados',
            search: 'Pesquisar',
            notFound: 'Ainda não temos isso! :( Mas, gostaria de abrir uma issue? :)'
        },
        shapes: {
            actor: 'Ator',
            flowStencil: 'Fluxo de Dados',
            process: 'Processo',
            store: 'Armazenamento',
            text: 'Texto facultativo',
            trustBoundary: 'Limite de Confiança'
        }
    },
    forms: {
        edit: 'Editar',
        report: 'Reporte',
        delete: 'Deletar',
        remove: 'Remover',
        save:   'Salvar',
        reload: 'Recarregar',
        cancel: 'Cancelar',
        close: 'Fechar'
    }
};

export default pt;
