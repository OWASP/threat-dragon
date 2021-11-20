const es = {
    nav: {
        v2Warning: 'Esta es la versión 2.0 do OWASP Threat Dragon que todavía está en desarrollo. No la utilice para editar pantillas existentes, ya que esta versión puede romperlas.',
        loggedInAs: 'Conectado como'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo do Threat Dragon',
        description: 'Threat Dragon es una herramienta de modelado de amenazas de fuente abierta y gratuita da OWASP. Se puede utilizar a través de desktop para Windows, MacOS y Linux o como una aplicación web. La aplicación de desktop es excelente si desea probarla sin otorgar acceso a sus repositorios do GitHub. Sin embargo, si elige la versión web, podrá liberar el increíble poder do GitHub en sus modelos de amenazas (threat model). Por supuesto, para hacer esto, deberá iniciar sesión en GitHub y permitir el acceso al repositorio de interés',
        loginWith: 'Conectado como'
    },
    providers: {
        github: {
            displayName: 'GitHub'
        },
        local: {
            displayName: 'Sesión Local'
        }
    },
    dashboard: {
        welcome: {
            title: '¡Te damos la bienvenida! ¡Estamos encantados de tenerte aquí!',
            description: 'Con OWASP Threat Dragon terás los mecanismos para hacer que los diseños de sus aplicativos sean más seguros. Puedes abrir un modelo de amenaza (threat model) existente o crear un modelo desde cero. Simplemente elija una de las siguientes opciones'
        },
        actions: {
            openExisting: 'Abrir un modelo de amenazas (threat model) existente',
            createNew: 'Crear un nuevo modelo de amenazas (threat model) desde cero',
            download: 'Descargar y explotar un ejemplo de modelo de amenazas (threat model)'
        }
    },
    repository: {
        select: 'Seleccione',
        from: 'repositório de los enumerados a continuación'
    },
    branch: {
        select: 'Seleccione una branch',
        from: 'de la lista a continuación',
        chooseRepo: 'elige otro repositorio'
    },
    threatmodelSelect: {
        select: 'Seleccione a Threat Model from',
        from: 'de la lista a continuación o elige outro',
        branch: 'branch',
        or: 'o',
        repo: 'repositório',
        newThreatModel: 'crear un nuevo modelo de amenazas (threat model)'
    },
    threatmodel: {
        owner: 'Propietario',
        reviewer: 'Revisor',
        contributors: 'Colaboradores',
        contributorsPlaceholder: 'Agregar un nuevo colaborador',
        description: 'Descripción de alto nível del sistema (high level system)',
        editing: 'Edición',
        title: 'Título',
        diagrams: 'Diagramas',
        addNewDiagram: 'Agregar un nuevo diagrama...',
        properties: {
            title: 'Propiedades',
            emptyState: 'Seleccione un elemento del diagrama para modificar sus propiedades',
            name: 'Nombre',
            text: 'Texto',
            description: 'Descripción',
            outOfScope: 'Fuera del contexto',
            reasonOutOfScope: 'Por razón de estar fuera de contexto',
            privilegeLevel: 'Nivel de Privilégio',
            isALog: 'Es un Log',
            storesCredentials: 'Almacienamiento de Credenciales',
            isEncrypted: 'Cifrado',
            isSigned: 'Firmado',
            providesAuthentication: 'Proporcionar de Autenticación',
            protocol: 'Protocolo',
            publicNetwork: 'Red Pública'
        },
        shortcuts: {
            title: 'Atajos',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Pegar'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Pegar'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Deshacer'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Rehacer'
            },
            delete: {
                shortcut: 'del',
                action: 'Eliminaer'
            },
            pan: {
                shortcut: 'shift + botón izquierdo del ratón (mantener y arrastrar)',
                action: 'Moverse por toda la imagen del diagrama'
            },
            multiSelect: {
                shortcut: 'hacer clic en el botón izquierdo del ratón en el espacio vacio y arrastrar',
                action: 'Selección múltipla'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + desplazamiento del ratón',
                action: 'Zoom'
            }
        },
        stencil: {
            entities: 'Entidades',
            boundaries: 'Límites',
            metadata: 'Metadados',
            search: 'Buscar',
            notFound: 'Todavia no tenemos esto. :( Pero, te gustaría abrir una issue? :)'
        },
        shapes: {
            actor: 'Actor',
            flowStencil: 'Flujo de Dados',
            process: 'Proceso',
            store: 'Almacenameinto',
            text: 'Texto opcional',
            trustBoundary: 'Límite de Confianza'
        }
    },
    forms: {
        edit: 'Editar',
        report: 'Reporte',
        delete: 'Eliminar',
        remove: 'Eliminar',
        save: 'Salvar',
        reload: 'Recargar',
        cancel: 'Cancelar',
        close: 'Cerrar'
    }
};

export default es;
