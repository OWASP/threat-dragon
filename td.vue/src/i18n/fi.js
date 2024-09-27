const fin = {
    auth: {
        sessionExpired: 'Istuntosi on vanhentunut. Ole hyvä ja kirjaudu sisään uudelleen jatkaaksesi.'
    },
    nav: {
        v2Warning: 'Version 2.0 uhkamallit eivät ole taaksepäin yhteensopivia version 1.x kanssa. Version 1.x mallit päivitetään automaattisesti version 2.0 uhkamalleiksi.',
        loggedInAs: 'Kirjautunut käyttäjänä',
        logOut: 'Log out'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'OWASP Threat Dragon on ilmainen avoimen lähdekoodin alustariippumaton sovellus uhkamallintamiseen. Voit piirtää sovelluksella uhkamallinnuskaavioita ja tunnistaa järjestelmän uhkia. Erilaiset käyttäjät voivat helposti lähestyä sovellusta, koska se on yksinkertainen ja joustava.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Aloita'
        },
        github: {
            displayName: 'GitHubilla',
            loginWith: 'Kirjaudu sisään'
        },
        gitlab: {
            displayName: 'GitLabilla',
            loginWith: 'Kirjaudu sisään'
        },
        bitbucket: {
            displayName: 'Bitbucketissa',
            loginWith: 'Kirjaudu sisään'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Kirjaudu sisään'
        },
        local: {
            displayName: 'paikallisesti',
            loginWith: 'Kirjaudu sisään'
        }
    },
    dashboard: {
        welcome: {
            title: 'Tervetuloa!',
            description: 'Voit nyt aloittaa järjestelmäsi suunnittelun. Voit avaita olemassa olevan uhkamallin tai tehdä uuden valitsemalla jonkin seuraavista vaihtoehdoista. '
        },
        actions: {
            openExisting: 'Avaa olemassa oleva uhkamalli',
            createNew: 'Tee uusi tyhjä uhkamalli',
            readDemo: 'Tutki esimerkkejä',
            importExisting: 'Tuo uhkamalli JSON-tiedostosta'
        }
    },
    demo: {
        select: 'Valitse uhkamalli alla olevista'
    },
    desktop: {
        file: {
            heading: 'Tiedosto',
            clearRecentDocs: 'Clear Menu',
            close: 'Sulje Uhkamalli',
            closeWindow: 'Close Window',
            new: 'Uusi Uhkamalli',
            open: 'Avaa Uhkamalli',
            recentDocs: 'Open Recent',
            save: 'Tallenna Uhkamalli',
            saveAs: 'Tallenna Uhkamalli Nimellä'
        },
        help: {
            heading: 'OHje',
            docs: 'Dokumentaatio',
            visit: 'Vieraile OWASP:n sivustolla',
            sheets: 'OWASP:n lunttilaput',
            github: 'Vieraile OWASP:n githubissa',
            submit: 'Ilmoita ongelmasta',
            check: 'Tarkist päivitykset ...'
        }
    },
    repository: {
        select: 'Valitse',
        from: 'arkisto alla olevista',
        noneFound: 'Arkistoa ei löytynyt. Aloittaaksesi tee uusi arkisto kohteeseen'
    },
    branch: {
        select: 'Valitse haara',
        from: 'alla olevista, tai',
        chooseRepo: 'valitse toinen arkisto'
    },
    threatmodelSelect: {
        select: 'Valitse uhkamalli kohteesta',
        from: 'alla olevasta listasta, tai valitse toinen',
        branch: 'haara',
        or: 'or',
        repo: 'arkisto',
        newThreatModel: 'Tee uusi uhkamalli'
    },
    threatmodel: {
        contributors: 'Osallistujat',
        contributorsPlaceholder: 'Kirjoita lisätäksesi uuden osallistujan',
        description: 'Ylätason kuvaus järjestelmästä',
        dragAndDrop: 'Raahaa ',
        editing: 'Muokkaus',
        jsonPaste: 'uhkamallin JSON-tiedosto tai leikkaa & liimaa sen sisältö tähän',
        owner: 'Omistaja',
        reviewer: 'Katselmoija',
        title: 'Otsikko',
        diagram: {
            diagrams: 'Kaaviot',
            addNewDiagram: 'Lisää uusi kaavio...',
            generic: {
                defaultTitle: 'Uusi yleinen kaavio',
                defaultDescription: 'Uuden yleisen kaavion kuvaus',
                select: 'Yleinen'
            },
            stride: {
                defaultTitle: 'Uusi STRIDE-kaavio',
                defaultDescription: 'Uuden STRIDE-kaavion kuvaus',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Uusi LINDDUN-kaavio',
                defaultDescription: 'Uuden LINDDUN-kaavion kuvaus',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Uusi PLOT4ai-kaavio',
                defaultDescription: 'Uuden PLOT4ai-kaavion kuvaus',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Uusi DIE-kaavio',
                defaultDescription: 'Uuden DIE-kaavion kuvaus',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Uusi CIA-kaavio',
                defaultDescription: 'Uuden CIA-kaavion kuvaus',
                select: 'CIA'
            }
        },
        threats: 'Uhat',
        errors: {
            dropSingleFileOnly: 'Voit pudottaa vain yhden tiedoston.',
            invalidJson: 'JSON-tiedoton muoto on virheellinen. Tarkista tiedosto ja yritä uudelleen.',
            onlyJsonAllowed: 'Sovellus tukee vain .json -päätteisiä tiedostoja.',
            open: 'Virhe uhkamallin lukemisessa. Yksityiskohtaisemmat tiedot virheestä löytyvät kehittäjän konsolista.',
            save: 'Virhe uhkamallin tallentamisessa. Yksityiskohtaisemmat tiedot virheestä löytyvät kehittäjän konsolista.'
        },
        opened: 'Uhkamallin avaaminen onnistui',
        saved: 'Uhkamallin tallentaminen onnistui',
        properties: {
            title: 'Ominaisuudet',
            emptyState: 'Valitse kaavion osa muokataksesi',
            name: 'Nimi',
            text: 'Teksti',
            description: 'Kuvaus',
            outOfScope: 'Rajattu ulos',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Ulos rajaamisen peruste',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'On loki',
            isEncrypted: 'Salattu',
            isSigned: 'Allekirjoitettu',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Käyttöoikeustaso',
            providesAuthentication: 'Tarjoaa tunnistautumisen',
            protocol: 'Protokolla',
            publicNetwork: 'Julkinen tietoverkko',
            storesCredentials: 'Tallentaa tunnistetietoja',
            storesInventory: 'Stores Inventory'
        },
        buttons: {
            delete: 'Poista valitut',
            redo: 'Muokkaa uudestaan',
            shortcuts: 'Pikavalinnat',
            toggleGrid: 'Ruudukko',
            undo: 'Kumoa muokkaus',
            zoomIn: 'Lähennä',
            zoomOut: 'Loitonna'
        },
        shortcuts: {
            title: 'Pikavalinnat',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Kopioi'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Liitä'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Kumoa'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Tee uudelleen'
            },
            delete: {
                shortcut: 'del',
                action: 'Poista'
            },
            pan: {
                shortcut: 'vaihto + hiiren vasen (pidä pohjassa & vedä)',
                action: 'Siirrä näkymää'
            },
            multiSelect: {
                shortcut: 'hiiren vasen ja vedä tyhjällä alueella',
                action: 'Valitse useita'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + rulla',
                action: 'Suurennos'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'Rajat',
            components: 'Komponentit',
            entities: 'Entiteetit',
            metadata: 'Metadata',
            search: 'Etsi',
            notFound: 'Toimintoa ei ole vielä, ilmoita puutteesta? :)'
        },
        shapes: {
            actor: 'Toimija',
            flow: 'Tietovirta',
            flowStencil: 'Tietovirta',
            process: 'Prosessi',
            store: 'Säilö',
            text: 'Kuvausteksti',
            trustBoundary: 'Luottamusraja'
        }
    },
    forms: {
        apply: 'Käytä',
        cancel: 'Peruuta',
        close: 'Sulje',
        closeModel: 'Sulje uhkamalli',
        delete: 'Poista',
        discardTitle: 'Menetä muutokset?',
        discardMessage: 'Oletko varma, että haluat menettää muutokset?',
        edit: 'Muokkaa',
        exportAs: 'Export Model As',
        exportHtml: 'Raportti HTML',
        exportPdf: 'Raportti PDF',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Tuo',
        ok: 'OK',
        open: 'Avaa',
        openModel: 'Avaa Uhkamalli',
        print: 'Tulosta',
        reload: 'Lataa uudelleen',
        remove: 'Poista',
        report: 'Raportti',
        save: 'Tallenna',
        saveAs: 'Tallenna Nimellä',
        saveModel: 'Tallenna Uhkamalli',
        saveModelAs: 'Tallenna Uhkamalli Nimellä',
        search: 'Etsi',
        next: 'Seuraava',
        previous: 'Edellinen'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentiality',
                integrity: 'Integrity',
                availability: 'Availability'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distributed',
                immutable: 'Immutable',
                ephemeral: 'Ephemeral'
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
                spoofing: 'Spoofing',
                tampering: 'Tampering',
                repudiation: 'Repudiation',
                informationDisclosure: 'Information disclosure',
                denialOfService: 'Denial of service',
                elevationOfPrivilege: 'Elevation of privilege'
            }
        },
        generic: {
            default: 'Uusi yleinen uhka',
            cia: 'Uusi CIA-uhka',
            die: 'Uusi DIE-uhka',
            linddun: 'Uusi LINDDUN-uhka',
            plot4ai: 'Uusi PLOT4ai-uhka',
            stride: 'Uusi STRIDE-uhka'
        },
        edit: 'Muokkaa Uhkaa',
        confirmDeleteTitle: 'Vahvista Poistaminen',
        confirmDeleteMessage: 'Oletko varma, että haluat poistaa tämän uhkan?',
        description: 'Anna kuvaus tälle uhkalle',
        emptyThreat: 'Valitse kaaviosta elementti, johon haluat liittää uhkan',
        mitigation: 'Anna uhkalle hallintakeino tai perustele miksi ei ole sovellettavissa (N/A)',
        newThreat: 'Uusi Uhka',
        newThreatByType: 'Uusi Uhka Tyypillä',
        newThreatByContext: 'Uusi Uhka Yhteydellä',
        properties: {
            description: 'Kuvaus',
            mitigation: 'Hallintakeinot',
            modelType: 'Uhkamallin Tyyppi',
            number: 'Numero',
            priority: 'Tärkeys',
            score: 'Pisteytys',
            status: 'Tila',
            title: 'Otsikko',
            type: 'Tyyppi'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Avoin',
            mitigated: 'Hallittu'
        },
        priority: {
            low: 'Alhainen',
            medium: 'Keskitaso',
            high: 'Korkea'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Näytä ulos rajatut elementit',
            showMitigatedThreats: 'Näytä hallitut uhkat',
            showModelDiagrams: 'Näytä uhkamallin kaaviot',
            showEmpty: 'Näytä tyhjät elementit',
            showBranding: 'Threat Dragon logo'
        },
        title: 'Uhkamallinnus kohteelle',
        dateGenerated: 'Luomispäivä',
        executiveSummary: 'Johdon yhteenveto',
        notProvided: 'Ei sisälly',
        summary: 'Yhteenveto',
        threatStats: {
            total: 'Uhkia yhteensä',
            mitigated: 'Hallittuja uhkia',
            notMitigated: 'Hallitsemattomia uhkia',
            openHigh: 'Avoin / Korkea tärkeys',
            openMedium: 'Avoin / Keskitason tärkeys',
            openLow: 'Avoin / Alhainen tärkeys',
            openUnknown: 'Avoin / Tuntematon tärkeys'
        }
    },
    upgrade: {
        modal: {
            header: 'Uhkamallin päivitys',
            welcome: 'Tervetuloa versioon 2 OWASP Threat Dragon -työkalusta!',
            p1: 'Versio 2 käyttää erilaista piirustuskirjastoa, mikä muuttaa uhkamallien osien tallennustapaa. Vaikka useimmat kaaviot näyttävät samalta kuin Threat Dragonin aiemmissa versioissa, joissakin tapauksissa niitä on ehkä hieman muutettava.',
            p2: 'Suljettuasi tämän ilmoituksen näet, miten tämän mallin kukin kaavio esitetään versio 2 -muodossa. Merkitse muistiin kaikki kaaviot, joita saatat joutua muokkaamaan. Tämä on kertaluonteinen päivitys, eikä tätä viestiä pitäisi enää tulla mallin tallentamisen jälkeen.'
        },
        instructions: 'Hienoa! Jatketaan uhkamallin pariin.',
        continue: 'Jatka uhkamalliin'
    }
};

export default fin;
