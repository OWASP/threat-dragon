const spa = {
    auth: {
        sessionExpired: 'Su sesión ha expirado. Por favor inicie una nueva sesión para continuar.'
    },
    nav: {
        v2Warning: 'Los modelos de amenazas(threat models) version 2.0 no son compatibles con los modelos de amenazas(threat model) de Threat Dragon versión 1.x. Los modelos importados de la versión 1.x serán actualizados acorde al esquema de la versión 2.0',
        loggedInAs: 'Conectado como',
        logOut: 'Log out'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo de Threat Dragon',
        description: 'Threat Dragon es una herramienta de modelado de amenazas de código abierto de OWASP. Se puede utilizar como aplicación desktop para Windows, MacOS y Linux o como una aplicación web. La aplicación de desktop es excelente si desea probarla sin otorgar acceso a sus repositorios de GitHub. Sin embargo, si elige la versión web, podrá liberar el increíble poder de GitHub en sus modelos de amenazas (threat models). Por supuesto, para hacer esto, deberá iniciar sesión en GitHub y permitir el acceso al repositorio de interés'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Start'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Conectarse con'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Conectarse con'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Conectarse con'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Conectarse con'
        },
        local: {
            displayName: 'Sesión Local',
            loginWith: 'Conectarse con'
        }
    },
    dashboard: {
        welcome: {
            title: '¡Le damos la bienvenida! ¡Estamos encantados de tenerlo aquí!',
            description: 'Con OWASP Threat Dragon tendrá los mecanismos para hacer que los diseños de sus aplicaciones sean más seguros. Puedes abrir un modelo de amenaza (threat model) existente o crear un modelo desde cero. Simplemente elija una de las siguientes opciones.'
        },
        actions: {
            openExisting: 'Abrir un modelo de amenazas (threat model) existente',
            createNew: 'Crear un nuevo modelo de amenazas (threat model) desde cero',
            readDemo: 'Descargar y explorar un ejemplo de modelo de amenazas (threat model)',
            importExisting: 'Importar un modelo de amenazas (threat model) de JSON'
        }
    },
    demo: {
        select: 'Seleccione un ejemplo de modelo de amenazas (threat model) de la lista a continuación'
    },
    desktop: {
        file: {
            heading: 'Archivo',
            clearRecentDocs: 'Clear Menu',
            close: 'Cerrar modelo',
            closeWindow: 'Close Window',
            new: 'Modelo nuevo',
            open: 'Abrir modelo',
            recentDocs: 'Open Recent',
            save: 'Guardar modelo',
            saveAs: 'Guardar modelo como'
        },
        help: {
            heading: 'Ayuda',
            docs: 'Documentación',
            visit: 'Visítenos en OWASP',
            sheets: 'OWASP Cheat Sheets',
            github: 'Visítenos en GitHub',
            submit: 'Abrir nuevo issue',
            check: 'Buscar actualizaciones ...'
        }
    },
    repository: {
        select: 'Seleccione',
        from: ' un repositorio de los siguientes',
        noneFound: 'Ningún repositorio encontrado. Para comenzar, cree un nuevo repositorio'
    },
    branch: {
        select: 'Seleccione un branch',
        from: 'de la lista a continuación o',
        chooseRepo: 'elija otro repositorio'
    },
    threatmodelSelect: {
        select: 'Seleccione un modelo de amenazas (threat model) ',
        from: 'de la lista a continuación o seleccione otro',
        branch: 'branch',
        or: 'o',
        repo: 'repositorio',
        newThreatModel: 'Crear un nuevo modelo de amenazas (threat model)'
    },
    threatmodel: {
        contributors: 'Colaboradores',
        contributorsPlaceholder: 'Agregar un nuevo colaborador',
        description: 'Descripción de alto nivel del sistema (high level system)',
        dragAndDrop: 'Arrastre y suelte o ',
        editing: 'Edición',
        jsonPaste: 'Arrastre el archivo JSON de su modelo de amenazas o pegue el texto aquí',
        owner: 'Propietario',
        reviewer: 'Revisor',
        title: 'Título',
        diagram: {
            diagrams: 'Diagramas',
            addNewDiagram: 'Agregar un nuevo diagrama...',
            generic: {
                defaultTitle: 'Nuevo diagrama genérico',
                defaultDescription: 'Descripción de nuevo diagrama genérico',
                select: 'Genérico'
            },
            stride: {
                defaultTitle: 'Nuevo diagrama STRIDE',
                defaultDescription: 'Descripción de nuevo diagrama STRIDE',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Nuevo diagrama LINDDUN',
                defaultDescription: 'Descripción de nuevo diagrama LINDDUN',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Nuevo diagrama PLOT4ai',
                defaultDescription: 'Descripción de nuevo diagrama PLOT4ai',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'New DIE diagram',
                defaultDescription: 'Descripción de nuevo diagrama DIE',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Nuevo diagrama CIA',
                defaultDescription: 'Descripción de Nuevo diagrama CIA',
                select: 'CIA'
            }
        },
        threats: 'Amenazas',
        errors: {
            dropSingleFileOnly: 'Arrastrar y soltar funciona con un solo archivo.',
            invalidJson: 'JSON erróneo. Compruebe su modelo e intente otra vez.',
            onlyJsonAllowed: 'Solamente archivos con extensión .json son soportados.',
            open: 'Error al abrir el modelo de amenazas. Consulte la consola de desarrollador para obtener más información.',
            save: 'Error al guardar el modelo de amenazas. Consulte la consola de desarrollador para obtener más información.'
        },
        opened: 'El modelo de amenazas se abrió con éxito',
        saved: 'El modelo de amenazas se guardó con éxito',
        properties: {
            title: 'Propiedades',
            emptyState: 'Seleccione un elemento del diagrama para modificar sus propiedades',
            name: 'Nombre',
            text: 'Texto',
            description: 'Descripción',
            outOfScope: 'Fuera de contexto',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Razón para estar fuera de contexto',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'Es un Log',
            isEncrypted: 'Está cifrado',
            isSigned: 'Está firmado',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Nivel de Privilegio',
            providesAuthentication: 'Provee Autenticación',
            protocol: 'Protocolo',
            publicNetwork: 'Red Pública',
            storesCredentials: 'Almacena Credenciales',
            storesInventory: 'Stores Inventory'
        },
        buttons: {
            delete: 'Eliminar seleccionado',
            redo: 'Rehacer edición',
            shortcuts: 'Atajos de teclado',
            toggleGrid: 'Alternar cuadrícula',
            undo: 'Deshacer Edición',
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
                action: 'Eliminar'
            },
            pan: {
                shortcut: 'shift + botón izquierdo del ratón (mantener presionado y arrastrar)',
                action: 'Moverse por toda la imagen del diagrama'
            },
            multiSelect: {
                shortcut: 'hacer clic en el botón izquierdo del ratón en el espacio vacío y arrastrar',
                action: 'Selección múltiple'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + rueda de desplazamiento del ratón',
                action: 'Zoom'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'Límites',
            components: 'Componentes',
            entities: 'Entidades',
            metadata: 'Metadatos',
            search: 'Buscar',
            notFound: 'Todavía no lo tenemos :( pero, ¿te gustaría abrir un issue? :)'
        },
        shapes: {
            actor: 'Actor',
            flow: 'Flujo de datos',
            flowStencil: 'Flujo de datos',
            process: 'Proceso',
            store: 'Dispositivo de almacenamiento',
            text: 'Texto opcional',
            trustBoundary: 'Límite de confianza'
        }
    },
    forms: {
        apply: 'Aplicar',
        cancel: 'Cancelar',
        close: 'Cerrar',
        closeModel: 'Cerrar modelo',
        delete: 'Eliminar',
        discardTitle: '¿Descartar los cambios?',
        discardMessage: '¿Está seguro de descartar sus cambios?',
        edit: 'Editar',
        exportAs: 'Export Model As',
        exportHtml: 'Reporte HTML',
        exportPdf: 'Reporte PDF',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Importar',
        ok: 'OK',
        open: 'Abrir',
        openModel: 'Abrir modelo',
        print: 'Print',
        reload: 'Recargar',
        remove: 'Eliminar',
        report: 'Reporte',
        save: 'Guardar',
        saveAs: 'Guardar como',
        saveModel: 'Guardar modelo',
        saveModelAs: 'Guardar modelo como',
        search: 'Buscar',
        next: 'próximo',
        previous: 'Previo'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentiality - Confidencialidad',
                integrity: 'Integrity - Integridad',
                availability: 'Availability - Disponibilidad'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distributed',
                immutable: 'Immutable',
                ephemeral: 'Ephemeral'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Linkability / Facilidad de vinculación',
                identifiability: 'Identifiability / Identificabilidad',
                nonRepudiation: 'Non-repudiation / No-repudiación',
                detectability: 'Detectability / Detectabilidad',
                disclosureOfInformation: 'Disclosure of information / Brecha de información ',
                unawareness: 'Unawareness / Falta de Conciencia',
                nonCompliance: 'Non-compliance / Incumplimiento'
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
                spoofing: 'Spoofing / Spoofing',
                tampering: 'Tampering / Manipulación',
                repudiation: 'Repudiation / Repudiación',
                informationDisclosure: 'Information disclosure / Brecha de información',
                denialOfService: 'Denial of service / Denegación de servicio',
                elevationOfPrivilege: 'Elevation of privilege / Elevación de privilegios'
            }
        },
        generic: {
            default: 'Nueva amenaza genérica',
            cia: 'Nueva amenaza CIA',
            die: 'Nueva amenaza DIE',
            linddun: 'Nueva amenaza LINDDUN',
            plot4ai: 'Nueva amenaza PLOT4ai',
            stride: 'Nueva amenaza STRIDE'
        },
        edit: 'Editar amenaza',
        confirmDeleteTitle: 'Confirmación de eliminación',
        confirmDeleteMessage: '¿Está seguro que realmente desea eliminar esta amenaza?',
        description: 'Introduzca una descripción para esta amenaza',
        emptyThreat: 'Seleccione un elemento en el gráfico para agregar una amenaza',
        mitigation: 'Introduzca la mitigación o prevención para esta amenaza',
        newThreat: 'Nueva amenaza',
        newThreatByType: 'Nueva amenaza por tipo',
        newThreatByContext: 'Nueva amenaza por contexto',
        properties: {
            description: 'Descripción',
            mitigation: 'Mitigaciones',
            modelType: 'Tipo de Modelo',
            number: 'Número',
            priority: 'Prioridad',
            score: 'Puntuación',
            status: 'Estado',
            title: 'Título',
            type: 'Tipo'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Abierto',
            mitigated: 'Mitigado'
        },
        priority: {
            low: 'Baja',
            medium: 'Media',
            high: 'Alta'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Mostrar elementos fuera de contexto',
            showMitigatedThreats: 'Mostrar amenazas mitigadas',
            showModelDiagrams: 'Mostrar diagramas de modelo',
            showEmpty: 'Show empty elements',
            showBranding: 'Marca de Threat Dragon'
        },
        title: 'Reporte de modelo de amenaza para',
        dateGenerated: 'Generado en fecha',
        executiveSummary: 'Resumen Ejecutivo',
        notProvided: 'No proporcionado',
        summary: 'Resumen',
        threatStats: {
            total: 'Total amenazas ',
            mitigated: 'Total amenazas mitigadas',
            notMitigated: 'No Mitigadas',
            openHigh: 'Abierto / Alta Prioridad',
            openMedium: 'Abierto / Prioridad Media',
            openLow: 'Abierto / Baja Prioridad',
            openUnknown: 'Abierto / Prioridad Desconocida'
        }
    },
    upgrade: {
        modal: {
            header: 'Actualización del modelo de amenazas',
            welcome: 'Bienvenido a la versión 2 de OWASP Threat Dragon!',
            p1: 'La versión 2 utiliza una librería de gráficos diferente, la cual cambiará la forma en que las partes de sus modelos de amenazas son guardadas. Mientras la mayoría de los diagramas se verán igual que en las versiones previas de Threat Dragon, habrá casos donde éstos necesitarán ser ligeramente ajustados.',
            p2: 'Después de cerrar este diálogo, usted podrá ver cómo cada diagrama en este modelo ha sido transformado en el formato de la versión 2. Por favor tome nota de todos los diagramas que pudieran necesitar ajustes. Esta es una actualización única, y usted no verá este mensaje otra vez después de guardar este modelo.'
        },
        instructions: '¡Genial! Vayamos a su modelo.',
        continue: 'Continuar'
    }
};

export default spa;
