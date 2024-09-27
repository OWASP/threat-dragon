const deu = {
    auth: {
        sessionExpired: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
    },
    nav: {
        v2Warning: 'Version 2.0 Bedrohungsmodelle sind nicht Abwärtskompatibel mit Version 1.x Threat Dragon Modellen. Importierte Version 1.x Modelle werden auf das Version 2.0 Schema gehoben', //in line with wording of BSI Leitfaden zur Entwicklung sicherer Webanwendungen
        loggedInAs: 'Angemeldet als',
        logOut: 'Log out'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'OWASP Threat Dragon ist eine kostenlose, Open-Source, plattformübergreifende Applikation für das Erstellen von Bedrohungsmodellen. Verwenden Sie es, um Diagramme zu Bedrohungsmodellen zu erstellen und Bedrohungen für Ihre Systeme zu identifizieren. Mit Fokus auf Flexibilität und Einfachheit ist das System leicht verständlich und für alle Benutzer zugänglich.'
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
        }
    },
    dashboard: {
        welcome: {
            title: 'Willkommen!',
            description: 'Sie sind bereit Ihren Applikationsentwurf sicherer zu gestalten. Sie können ein bestehendes Bedrohungsmodell öffnen, oder ein neues erstellen indem Sie eine der folgenden Optionen auswählen. '
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
        from: 'Repository aus folgender Liste',  //in line with Github wording https://docs.github.com/de/repositories
        noneFound: 'Kein Repository gefunden. Legen Sie zum Starten eine neues Repository an.'
    },
    branch: {
        select: 'Wähle einen Branch aus', //in line with Github wording https://docs.github.com/de/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository
        from: 'aus folgender Liste aus',
        chooseRepo: 'ein anderes Repository auswählen'
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
        dragAndDrop: 'Ziehen und ablegen oder ',
        editing: 'Bearbeiten',
        jsonPaste: 'Legen Sie eine Bedrohungsmodell JSON Datei ab oder kopieren Sie den Inhalt hier:',
        owner: 'Eigentümer',
        reviewer: 'Prüfer',
        title: 'Titel',
        diagram: {
            diagrams: 'Diagramm',
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
            invalidJson: 'Ungültiges JSON. Bitte überprüfen Sie Ihr Modell und versuchen Sie es erneut.',
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
        buttons: {
            delete: 'Auswahl löschen',
            redo: 'Bearbeitung wiederholen',
            shortcuts: 'Tastaturkürzel',
            toggleGrid: 'Gitter umschalten',
            undo: 'Bearbeitung zurücknehmen',
            zoomIn: 'Vergrößern',
            zoomOut: 'Verkleinern'
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
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'Grenzen',
            components: 'Komponenten',
            entities: 'Einheiten',
            metadata: 'Metadata',
            search: 'Suchen',
            notFound: 'Noch nicht vorhanden. Wollen Sie einen Issue öffnen? :)'
        },
        shapes: {
            actor: 'Actor',
            flow: 'Data Flow',
            flowStencil: 'Data Flow',
            process: 'Process',
            store: 'Store',
            text: 'Descriptive text',
            trustBoundary: 'Trust Boundary'
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
        exportAs: 'Export Model As',
        exportHtml: 'Speichern als HTML',
        exportPdf: 'Speichern als PDF',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
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
        previous: 'vorherige'
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
            linddun: { //unable to find german sources to Linddun. The official website is also not available on german. will leave the specific terms as in the original
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
        mitigation: 'Geben Sie eine Korrekturmaßnahme für diese Bedrohung oder eine Begründung N/A an',
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
            low: 'Niedrig',
            medium: 'Mittel',
            high: 'Hoch'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Elemente außerhalb des Geltungsbereichs anzeigen',
            showMitigatedThreats: 'Abgeschwächte Bedrohungen anzeigen',
            showModelDiagrams: 'Modell Diagramme anzeigen',
            showEmpty: 'Leere Elemente anzeigen',
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
            openHigh: 'Offen / Hohe Priorität',
            openMedium: 'Offen / Mittlere Priorität',
            openLow: 'Offen / Niedrige Priorität',
            openUnknown: 'Offen / Unbekannte Priorität'
        }
    },
    upgrade: {
        modal: {
            header: 'Bedrohungsmodell Aktualisierung',
            welcome: 'Willkommen zu Version 2 von OWASP Threat Dragon!',
            p1: 'Version 2 verwendet eine andere Zeichnungsbibliothek, wodurch sich die Art wie Bedrohungsmodelle gespeichert werden, ändert. Obwohl die meisten Diagramme genauso aussehen wie in früheren Versionen von Threat Dragon, kann es vorkommen, dass in einigen Fällen die Diagramme leicht angepasst werden müssen.',
            p2: 'Nachdem schließen dieses Modells, sehen Sie wie Diagramme in diesem Modell im Version 2 Format dargestellt werden. Notieren Sie sich bitte alle Diagramme, die Sie eventuell anpassen müssen. Dies ist ein einmaliges Upgrade und Sie sollten diese Nachricht nach dem Speichern des Modells nicht erneut sehen.'
        },
        instructions: 'Super! Bringen wir Sie zu Ihrem Modell.',
        continue: 'Weiter zum Bedrohungsmodell'
    }
};

export default deu;
