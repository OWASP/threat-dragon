const spa = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    nav: {
        v2Warning: 'Version 2.0 threat models are not backwardly compatible with version 1.x Threat Dragon models. Imported version 1.x models will be upgraded to the version 2.0 schema',
        loggedInAs: 'Conectado como'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo do Threat Dragon',
        description: 'Threat Dragon es una herramienta de modelado de amenazas de fuente abierta y gratuita da OWASP. Se puede utilizar a través de desktop para Windows, MacOS y Linux o como una aplicación web. La aplicación de desktop es excelente si desea probarla sin otorgar acceso a sus repositorios do GitHub. Sin embargo, si elige la versión web, podrá liberar el increíble poder do GitHub en sus modelos de amenazas (threat model). Por supuesto, para hacer esto, deberá iniciar sesión en GitHub y permitir el acceso al repositorio de interés',
        loginWith: 'Conectado con'
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
            readDemo: 'Descargar y explotar un ejemplo de modelo de amenazas (threat model)',
            importExisting: 'Importar un modelo de amenazas (threat model) de JSON'
        }
    },
    demo: {
        select: 'Seleccion un ejemplo de modelo de amenazas de la lista a continuación'
    },
    desktop: {
        file: {
            heading: 'Archivo',
            close: 'Cerrar Modelo',
            new: 'Modelo Nuevo',
            open: 'Abrir Model',
            save: 'Salvar Modelo',
            saveAs: 'Salvar Modelo Como'
        },
        help: {
            heading: 'Help',
            docs: 'Documentation',
            visit: 'Visit us at OWASP',
            sheets: 'OWASP Cheat Sheets',
            github: 'Visit us on GitHub',
            submit: 'Abrir una issue',
            check: 'Check for updates ...'
        }
    },
    repository: {
        select: 'Seleccione',
        from: 'repositório de los enumerados a continuación',
        noneFound: 'No repositories found. To get started, create a new repository on'
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
        contributors: 'Colaboradores',
        contributorsPlaceholder: 'Agregar un nuevo colaborador',
        description: 'Descripción de alto nível del sistema (high level system)',
        dragAndDrop: 'Drag and drop or ',
        editing: 'Edición',
        jsonPaste: 'Pegue el JSON de su modelo de amenazas aquí',
        owner: 'Propietario',
        reviewer: 'Revisor',
        title: 'Título',
        diagram: {
            diagrams: 'Diagramas',
            addNewDiagram: 'Agregar un nuevo diagrama...',
            generic: {
                diagramTitle: 'Nuevo diagram genérico',
                diagramDescription: 'New generic diagram description',
                select: 'Genérico'
            },
            stride: {
                diagramTitle: 'Nuevo diagrama STRIDE',
                diagramDescription: 'New STRIDE diagram description',
                select: 'STRIDE'
            },
            linddun: {
                diagramTitle: 'Nuevo diagrama LINDDUN',
                diagramDescription: 'New LINDDUN diagram description',
                select: 'LINDDUN'
            },
            cia: {
                diagramTitle: 'Nuevo diagrama CIA',
                diagramDescription: 'New CIA diagram description',
                select: 'CIA'
            }
        },
        threats: 'Amenazas',
        errors: {
            dropSingleFileOnly: 'Drag and drop requires a single file.',
            invalidJson: 'JSON erróneo. Comproba su modelo y pegue otro vez',
            onlyJsonAllowed: 'Only files that end with .json are supported.',
            open: 'Error al abrir el modelo de amenazas. Consulte la consola del desarrollador para obtener más información.',
            save: 'Error al cerrar el modelo de amenazas. Consulte la consola del desarrollador para obtener más información.'
        },
        opened: 'Modelo de amenazas se abrió con éxito',
        saved: 'Modelo de amenazas se cerró con éxito',
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
        buttons: {
            delete: 'Delete selected',
            redo: 'Redo edit',
            shortcuts: 'Keyboard shortcuts',
            toggleGrid: 'Alternar cuadrícula',
            undo: 'Undo edit',
            zoomIn: 'Ampliar zoom',
            zoomOut: 'Reducir zoom'
        },
        shortcuts: {
            title: 'Atajos',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Copiar'
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
            boundaries: 'Límites',
            components: 'Components',
            entities: 'Entidades',
            metadata: 'Metadados',
            search: 'Buscar',
            notFound: 'Todavia no tenemos esto. :( Pero, te gustaría abrir una issue? :)'
        },
        shapes: {
            actor: 'Actor',
            flow: 'Flujo de Dados',
            flowStencil: 'Flujo de Dados',
            process: 'Proceso',
            store: 'Almacenameinto',
            text: 'Texto opcional',
            trustBoundary: 'Límite de Confianza'
        }
    },
    forms: {
        apply: 'Applicar',
        cancel: 'Cancelar',
        close: 'Cerrar',
        closeModel: 'Cerrar Modelo',
        delete: 'Eliminar',
        discardTitle: '¿Descartar los cambios?',
        discardMessage: '¿Estás seguro de descartes tus cambios?',
        edit: 'Editar',
        import: 'Importar',
        ok: 'OK',
        open: 'Abrir',
        openModel: 'Abrir Modelo',
        print: 'Print',
        reload: 'Recargar',
        remove: 'Eliminar',
        report: 'Reporte',
        save: 'Salvar',
        saveAs: 'Salvar Como',
        saveModel: 'Salvar modelo',
        saveModelAs: 'Salvar modelo Como',
        savePdf: 'Salvar PDF',
        search: 'Buscar'
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
            description: 'Descripción',
            mitigation: 'Mitigaciones',
            modelType: 'Tipo de Modelo',
            number: 'Numero',
            priority: 'Prioridad',
            score: 'Score',
            status: 'Estado',
            title: 'Título',
            type: 'Tipo'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Abierto',
            mitigated: 'Mitigada'
        },
        priority: {
            low: 'Baja',
            medium: 'Media',
            high: 'Alta'
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
        executiveSummary: 'Resumen Ejecutivo',
        notProvided: 'Not provided',
        summary: 'Resumen',
        threatStats: {
            total: 'Amenazas Totales',
            mitigated: 'Amenazas Totales Mitigadas',
            notMitigated: 'No Mitigadas',
            openHigh: 'Abierto / Alta Prioridad',
            openMedium: 'Abierto / Prioridad Media',
            openLow: 'Abierto / Baja Prioridad',
            openUnknown: 'Abierto / Prioridad Desconocida'
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

export default spa;
