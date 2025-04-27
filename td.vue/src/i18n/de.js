const deu = {
    auth: {
        sessionExpired: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
    },
    operator: {
        heading: 'Betreiber',
        operatedby: 'Diese Website und Instanz von OWASP Threat Dragon wird betrieben von:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'dem Betreiber dieser Website'}`,
        contact: 'Kontakt: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(Kontaktinformationen nicht angegeben)'),
    },
    tos: {
        title: 'Nutzungsbedingungen',
        lastUpdated: '4. April 2025',
        introduction: 'Willkommen bei unserer Instanz von OWASP Threat Dragon. Diese Nutzungsbedingungen ("Bedingungen") regeln Ihren Zugriff auf und die Nutzung dieser Website, die eine Instanz einer Open-Source-Webanwendung ist, die vom oben aufgeführten Betreiber ("Der Betreiber") zur Verfügung gestellt wird.',
        sections: [
            {
                heading: '1. Annahme der Bedingungen',
                content: 'Durch den Zugriff auf und die Nutzung dieser Website akzeptieren Sie diese Bedingungen und stimmen zu, an die Bestimmungen dieser Vereinbarung gebunden zu sein. Wenn Sie diesen Bedingungen nicht zustimmen, nutzen Sie diese Website bitte nicht.'
            },
            {
                heading: '2. Nutzung der Website',
                content: 'Sie dürfen die Website nur für rechtmäßige Zwecke nutzen. Sie stimmen zu, die Website nicht zu missbrauchen, zu stören oder unbefugten Zugriff auf die Website oder ihre zugrunde liegenden Systeme zu versuchen.'
            },
            {
                heading: '3. Keine Garantie',
                content: 'Die Website wird "wie sie ist" ohne jegliche Garantien, ausdrücklich oder stillschweigend, einschließlich, aber nicht beschränkt auf die Eignung für einen bestimmten Zweck, Verfügbarkeit oder Genauigkeit, bereitgestellt. Wir garantieren keinen ununterbrochenen oder fehlerfreien Betrieb.'
            },
            {
                heading: '4. Haftungsbeschränkung',
                content: 'Im größtmöglichen gesetzlich zulässigen Umfang haftet der Betreiber nicht für direkte, indirekte, zufällige oder Folgeschäden, die aus Ihrer Nutzung oder Unfähigkeit zur Nutzung der Website entstehen.'
            },
            {
                heading: '5. Open-Source-Software',
                content: 'Diese Website läuft mit der OWASP Threat Dragon Software, deren Quellcode unter https://www.github.com/OWASP/threat-dragon verfügbar ist. Ihre Nutzung der Software unterliegt den Open-Source-Lizenzbedingungen. Wir sind nicht für die Software selbst verantwortlich, sondern nur für den Betrieb dieser Instanz. Der Betreiber dieser Website ist nicht mit OWASP verbunden.'
            },
            {
                heading: '6. Änderungen der Bedingungen',
                content: 'Der Betreiber kann diese Bedingungen jederzeit aktualisieren. Die fortgesetzte Nutzung der Website nach Änderungen stellt die Annahme der aktualisierten Bedingungen dar.'
            },
            {
                heading: '7. Kündigung',
                content: 'Der Betreiber behält sich das Recht vor, den Zugriff auf die Website nach eigenem Ermessen, ohne Vorankündigung und aus beliebigem Grund auszusetzen oder zu beenden.'
            },
            {
                heading: '8. Geltendes Recht',
                content: 'Diese Bedingungen unterliegen den Gesetzen der Gerichtsbarkeit, in der der Betreiber seinen Hauptsitz hat (im Falle einer Organisation) oder wohnt (im Falle einer Einzelperson), ohne Rücksicht auf Kollisionsnormen.'
            }
        ],
        contact: 'Wenn Sie Fragen zu diesen Bedingungen haben, wenden Sie sich bitte an den Betreiber.'
    },
    privacy: {
        title: 'Datenschutzrichtlinie',
        lastUpdated: '4. April 2025',
        introduction: 'Der Betreiber dieser Website ist bestrebt, Ihre Privatsphäre zu schützen. Diese Datenschutzrichtlinie erklärt, wie Ihre Informationen behandelt werden.',
        sections: [
            {
                heading: 'Minimale Datennutzung für den Betrieb',
                content: 'Der Betreiber sammelt, speichert oder verarbeitet keine personenbezogenen Daten von Benutzern für Tracking, Profiling oder die Weitergabe an Dritte. Temporäre Protokolle, die IP-Adressen oder Benutzernamen enthalten können, werden ausschließlich für Betriebs- und Debugging-Zwecke erstellt. Diese Protokolle werden innerhalb kurzer Zeit verworfen und nicht über diese begrenzten Zwecke hinaus aufbewahrt oder verwendet.'
            },
            {
                heading: 'Rechtliche Compliance',
                content: 'Der Betreiber gibt Informationen nur dann weiter, wenn dies gesetzlich vorgeschrieben ist, beispielsweise als Reaktion auf eine gültige behördliche Anordnung oder Vorladung. In solchen Fällen wird der Betreiber die geltenden gesetzlichen Verpflichtungen einhalten.'
            },
            {
                heading: 'Änderungen dieser Richtlinie',
                content: 'Der Betreiber kann diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Alle Änderungen werden auf dieser Seite mit einem aktualisierten "Zuletzt aktualisiert"-Datum veröffentlicht.'
            },
            {
                heading: 'Kontaktieren Sie uns',
                content: 'Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben, wenden Sie sich bitte an den Betreiber.'
            }
        ]
    },
    nav: {
        v2Warning:
            'Version 2.0 Bedrohungsmodelle sind nicht Abwärtskompatibel mit Version 1.x Threat Dragon Modellen. Importierte Version 1.x Modelle werden auf das Version 2.0 Schema gehoben', //in line with wording of BSI Leitfaden zur Entwicklung sicherer Webanwendungen
        loggedInAs: 'Angemeldet als',
        logOut: 'Log out',
        tos: 'Nutzungsbedingungen',
        privacy: 'Datenschutzrichtlinie'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description:
            'OWASP Threat Dragon ist eine kostenlose, Open-Source, plattformübergreifende Anwendung zum Erstellen von Bedrohungsmodellen. Nutzen Sie sie, um Diagramme zur Bedrohungsmodellierung zu zeichnen und Bedrohungen für Ihr System zu identifizieren. Mit dem Schwerpunkt auf Flexibilität und Einfachheit ist sie für alle Arten von Benutzern leicht zugänglich.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Start'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Anmelden mit'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Anmelden mit'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Anmelden mit'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Anmelden mit'
        },
        local: {
            displayName: 'Lokale Sitzung',
            loginWith: 'Anmelden an'
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'Öffnen',
            description:
                'Wählen Sie eine Bedrohungsmodelldatei oder einen Zielordner aus Google Drive',
            saveThreatModel: 'Bedrohungsmodell in Google Drive speichern',
            saveDescription:
                'Wählen Sie einen Ordner in Google Drive zum Speichern Ihres Bedrohungsmodells',
            fileName: 'Dateiname',
            fileNamePlaceholder: 'Geben Sie einen Namen für Ihre Datei ein',
            selectFolder: 'Wählen Sie einen Ordner in Google Drive',
            selectFile: 'Wählen Sie eine Datei aus Google Drive',
            selectThreatModel: 'Wählen Sie ein Bedrohungsmodell aus Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'Willkommen!',
            description:
                'Sie sind bereit Ihren Applikationsentwurf sicherer zu gestalten. Sie können ein bestehendes Bedrohungsmodell öffnen, oder ein neues erstellen indem Sie eine der folgenden Optionen auswählen. '
        },
        actions: {
            openExisting: 'Ein bestehendes Bedrohungsmodell öffnen',
            createNew: 'Ein neues, leeres, Bedrohungsmodell erstellen',
            readDemo: 'Erkunden Sie ein Bespiel Bedrohungsmodell',
            importExisting: 'Ein Bedrohungsmodell als JSON importieren'
        }
    },
    demo: {
        select: 'Wählen Sie ein Beispiel Bedrohungsmodell aus der folgenden Liste'
    },
    desktop: {
        file: {
            heading: 'Datei',
            clearRecentDocs: 'Clear Menu',
            close: 'Modell schließen',
            closeWindow: 'Close Window',
            new: 'Neues Modell',
            open: 'Modell öffnen',
            recentDocs: 'Open Recent',
            save: 'Modell speichern',
            saveAs: 'Modell speichern als'
        },
        help: {
            heading: 'Hilfe',
            docs: 'Dokumentation',
            visit: 'Besuchen Sie uns auf OWASP',
            sheets: 'OWASP Cheat Sheets',
            github: 'Besuchen Sie uns auf GitHub',
            submit: 'Ein Problem melden',
            check: 'Nach Updates suchen ...'
        }
    },
    repository: {
        select: 'Wählen Sie ein',
        from: 'Repository aus folgender Liste', //in line with Github wording https://docs.github.com/de/repositories
        noneFound: 'Kein Repository gefunden. Legen Sie zum Starten eine neues Repository an.'
    },
    branch: {
        select: 'Wähle einen Branch aus', //in line with Github wording https://docs.github.com/de/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository
        from: 'aus folgender Liste aus',
        chooseRepo: 'ein anderes Repository auswählen',
        or: 'oder',
        addNew: 'füge einen neuen Branch hinzu',
        protectedBranch: 'Geschützter Branch',
        nameRequired: 'Branch Name ist erforderlich',
        nameExists: 'Branch Name existiert bereits',
        refBranch: 'Referenz Branch',
        add: 'Branch hinzufügen',
        cancel: 'Abbrechen',
        name: 'Branch Name'
    },
    folder: {
        select: 'Wählen Sie einen',
        from: 'Ordner aus der folgenden Liste',
        noneFound: 'Dieser Ordner ist leer. Sie können hier ein neues Bedrohungsmodell erstellen.'
    },
    threatmodelSelect: {
        select: 'Ein Bedrohungsmodell auswählen aus',
        from: 'aus folgenden Optionen, oder auswählen eines anderen',
        branch: 'Branch',
        or: 'oder',
        repo: 'Repository',
        newThreatModel: 'Ein neues Bedrohungsmodell erstellen'
    },
    threatmodel: {
        contributors: 'Mitwirkende',
        contributorsPlaceholder: 'Tippen Sie, um Mitwirkende hinzuzufügen',
        description: 'High-Level System Beschreibung',
        dragAndDrop: 'Ziehen und ablegen oder ',        jsonPaste:
            'Legen Sie eine Bedrohungsmodell JSON Datei ab oder kopieren Sie den Inhalt hier:',
        owner: 'Eigentümer',
        reviewer: 'Prüfer',
        title: 'Titel',
        new: {
            title: 'Neues Bedrohungsmodell erstellen',
            description: 'Geben Sie Informationen über Ihr neues Bedrohungsmodell ein'
        },
        placeholder: {
            title: 'Titel des Bedrohungsmodells',
            owner: 'Name des Eigentümers oder Teams',
            description: 'Geben Sie eine allgemeine Beschreibung des modellierten Systems ein',
            reviewer: 'Name des Prüfers'
        },
        diagram: {
            diagrams: 'Diagramme',
            addNewDiagram: 'Ein neues Diagramm hinzufügen...',
            generic: {
                defaultTitle: 'Neues generisches Diagramm',
                defaultDescription: 'Neue generische Diagramm Beschreibung',
                select: 'Generisch'
            },
            stride: {
                defaultTitle: 'Neues STRIDE Diagramm',
                defaultDescription: 'Neue STRIDE Diagramm Beschreibung',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Neues LINDDUN Diagramm',
                defaultDescription: 'Neue LINDDUN Diagramm Beschreibung',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Neues PLOT4ai Diagramm',
                defaultDescription: 'Neue PLOT4ai Diagramm Beschreibung',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'New DIE diagram',
                defaultDescription: 'Neue DIE Diagramm Beschreibung',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Neues CIA Diagramm',
                defaultDescription: 'Neue CIA Diagramm Beschreibung',
                select: 'CIA'
            }
        },
        threats: 'Bedrohungen',
        errors: {
            dropSingleFileOnly: 'Ziehen und ablegen erfordert eine einzige Datei.',
            invalidJson:
                'Ungültiges JSON. Bitte überprüfen Sie Ihr Modell und versuchen Sie es erneut.',
            onlyJsonAllowed: 'Nur Datein mit .json Endung werden unterstützt.',
            open: 'Fehler beim Öffnen des Bedrohungsmodells. Prüfen Sie die Developer Konsole für mehr Informationen',
            save: 'Fehler beim Speichern des Bedrohungsmodells. Prüfen Sie die Developer Konsole für mehr Informationen'
        },
        opened: 'Bedrohungsmodell erfolgreich geöffnet',
        saved: 'Bedrohungsmodell erfolgreich gespeichert',
        properties: {
            title: 'Eigenschaften',
            emptyState: 'Wählen Sie ein Element im Diagramm zur Bearbeitung aus',
            name: 'Name',
            text: 'Text',
            description: 'Beschreibung',
            outOfScope: 'Nicht im Geltungsbereich',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Begründung für nicht im Geltungsbereich',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'Ist ein Log',
            isEncrypted: 'Verschlüsselt',
            isSigned: 'Signiert',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Privilegstufe',
            providesAuthentication: 'Stellt Authentifizierung bereit',
            protocol: 'Protokoll',
            publicNetwork: 'Öffentliches Netzwerk',
            storesCredentials: 'Speichert Zugangsinformationen',
            storesInventory: 'Stores Inventory'
        },
        controlButtons: {
            delete: 'Auswahl löschen',
            redo: 'Bearbeitung wiederholen',
            shortcuts: 'Tastaturkürzel',
            toggleGrid: 'Gitter umschalten',
            undo: 'Bearbeitung zurücknehmen',
            zoomIn: 'Vergrößern',
            zoomOut: 'Verkleinern',
            save: 'Speichern'
        },
        shortcuts: {
            title: 'Abkürzungen',
            copy: {
                shortcut: '(Strg/cmd) + c',
                action: 'Kopieren'
            },
            paste: {
                shortcut: '(Strg/cmd) + v',
                action: 'Einfügen'
            },
            undo: {
                shortcut: '(Strg/cmd) + z',
                action: 'Zurücknehmen'
            },
            redo: {
                shortcut: '(Strg/cmd) + y',
                action: 'Wiederholen'
            },
            delete: {
                shortcut: 'Enft',
                action: 'Löschen'
            },
            pan: {
                shortcut: 'shift + Linksklick (ziehen/ablegen)',
                action: 'Schwenken'
            },
            multiSelect: {
                shortcut: 'Linksklick im leeren Bereich und ziehen',
                action: 'Mehrfachauswahl'
            },
            zoom: {
                shortcut: '(Strg/cmd) + Mausrad',
                action: 'Zoomen'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Speichern'
            }
        },
        stencil: {
            title: 'Formen',
            boundaries: 'Grenzen',
            components: 'Komponenten',
            entities: 'Einheiten',
            metadata: 'Metadata',
            search: 'Formen suchen',
            notFound: 'Noch nicht vorhanden. Wollen Sie einen Issue öffnen? :)'
        },
        shapes: {
            actor: 'Akteur',
            flow: 'Datenfluss',
            flowStencil: 'Datenfluss',
            process: 'Prozess',
            store: 'Datenspeicher',
            text: 'Beschreibender Text',
            trustBoundary: 'Vertrauensgrenze'
        }
    },
    forms: {
        apply: 'Anwenden',
        cancel: 'Abbrechen',
        close: 'Schließen',
        closeModel: 'Modell schließen',
        delete: 'Löschen',
        discardTitle: 'Änderung verwerfen?',
        discardMessage: 'Sind Sie sicher, dass Sie Ihre Änderungen verwerfen wollen?',
        edit: 'Editieren',
        export: 'Exportieren',
        exportAs: 'Modell exportieren als',
        exportHtml: 'HTML-Bericht',
        exportPdf: 'PDF-Bericht',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        exportFormats: {
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG'
        },
        import: 'Importieren',
        ok: 'OK',
        open: 'Öffnen',
        openModel: 'Modell öffnen',
        print: 'Drucken',
        reload: 'Neu laden',
        remove: 'Entfernen',
        report: 'Bericht',
        save: 'Speichern',
        saveAs: 'Speichern als',
        saveModel: 'Modell speichern',
        saveModelAs: 'Modell speichern als',
        search: 'Suchen',
        next: 'nächste',
        previous: 'vorherige',
        requiredField: 'Pflichtfeld'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Vertraulichkeit',
                integrity: 'Integrität',
                availability: 'Verfügbarkeit'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distributed',
                immutable: 'Immutable',
                ephemeral: 'Ephemeral'
            },
            linddun: {
                //unable to find german sources to Linddun. The official website is also not available on german. will leave the specific terms as in the original
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
                header: '--- STRIDE ---', //translation according to https://learn.microsoft.com/de-de/azure/security/develop/threat-modeling-tool-threats
                spoofing: 'Spoofing',
                tampering: 'Manipulation',
                repudiation: 'Nichtanerkennung',
                informationDisclosure: 'Veröffentlichung von Informationen',
                denialOfService: 'Denial of service',
                elevationOfPrivilege: 'Erhöhung von Rechten'
            }
        },
        generic: {
            default: 'Neue generische Bedrohung',
            cia: 'Neue CIA Bedrohung',
            die: 'Neue DIE Bedrohung',
            linddun: 'Neue LINDDUN Bedrohung',
            plot4ai: 'Neue PLOT4ai Bedrohung',
            stride: 'Neue STRIDE Bedrohung'
        },
        edit: 'Bedrohung bearbeiten',
        confirmDeleteTitle: 'Löschen bestätigen',
        confirmDeleteMessage: 'Sind Sie sicher, dass Sie diese Bedrohung löschen wollen?',
        description: 'Geben Sie eine Beschreibung dieser Bedrohung an',
        emptyThreat: 'Wählen Sie ein Element im Diagramm aus, um eine Bedrohung hinzuzufügen',
        mitigation:
            'Geben Sie eine Korrekturmaßnahme für diese Bedrohung oder eine Begründung N/A an',
        newThreat: 'Neue Bedrohung',
        newThreatByType: 'Neue Bedrohung nach Typ',
        newThreatByContext: 'Neue Bedrohung nach Kontext',
        properties: {
            description: 'Beschreibung',
            mitigation: 'Minderungsmaßnahme',
            modelType: 'Modell Typ',
            number: 'Nummer',
            priority: 'Priorität',
            score: 'Ergebnis',
            status: 'Status',
            title: 'Titel',
            type: 'Typ'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Offen',
            mitigated: 'Abgeschwächt'
        },
        priority: {
            tbd: 'Zu bestimmen',
            low: 'Niedrig',
            medium: 'Mittel',
            high: 'Hoch',
            critical: 'Kritisch'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Elemente außerhalb des Geltungsbereichs anzeigen',
            showMitigatedThreats: 'Abgeschwächte Bedrohungen anzeigen',
            showModelDiagrams: 'Modell Diagramme anzeigen',
            showEmpty: 'Leere Elemente anzeigen',
            showProperties: 'Elementeigenschaften anzeigen',
            showBranding: 'Threat Dragon Logo'
        },
        title: 'Bedrohungsmodell Bereicht für',
        dateGenerated: 'Erstellungsdaten',
        executiveSummary: 'Zusammenfassung',
        notProvided: 'Nicht angegeben',
        summary: 'Zusammenfassung',
        threatStats: {
            total: 'Bedrohungen insgesamt',
            mitigated: 'Bedrohungen abgeschwächt',
            notMitigated: 'Nicht abgeschwächt',
            openCritical: 'Offen / Kritische Priorität',
            openHigh: 'Offen / Hohe Priorität',
            openMedium: 'Offen / Mittlere Priorität',
            openLow: 'Offen / Niedrige Priorität',
            openTbd: 'Offen / TBD-Priorität',
            openUnknown: 'Offen / Unbekannte Priorität'
        }
    },
    pagination: {
        previous: 'Vorherige',
        next: 'Nächste'
    }
};

export default deu;
