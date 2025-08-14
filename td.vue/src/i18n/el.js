const ell = {
    auth: {
        sessionExpired: 'Η συνεδρία σας έχει λήξει.  Παρακαλούμε συνδεθείτε εκ νέου για να συνεχίσετε.'
    },
    nav: {
        loggedInAs: 'Σύνδεση ως',
        logOut: 'Αποσύνδεση'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Λογότυπο Threat Dragon',
        description: 'Το Threat Dragon είναι ένα δωρεάν, ανοιχτού κώδικα εργαλείο μοντελοποίησης απειλών (threat modeling) του Οργανισμού OWASP. Μπορεί να χρησιμοποιηθεί ως μια αυτόνομη desktop εφαρμογή για Windows, MacOS και Linux ή ως μια web εφαρμογή. Η desktop εφαρμογή είναι ιδανική αν θέλετε να δοκιμάσετε την εφαρμογή χωρίς να της δώσετε πρόσβαση στα github αποθετήρια σας, αλλά αν επιλέξετε την online έκδοση τότε θα "εξαπολύσετε" την φοβερή δύναμη του GitHub στα μοντέλα απειλών σας! Προφανώς, για να το κάνετε αυτό θα πρέπει πρώτα να συνδεθείτε.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Έναρξη'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Είσοδος με'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Είσοδος με'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Είσοδος με'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Είσοδος με'
        },
        local: {
            displayName: 'Τοπική Συνεδρία',
            loginWith: 'Είσοδος με'
        }
    },
    dashboard: {
        welcome: {
            title: 'Καλώς ήρθατε!',
            description: 'Είστε έτοιμοι να ξεκινήσετε να κάνετε τα σχέδια των εφαρμογών σας πιο ασφαλή. Μπορείτε να ανοίξετε ένα υφιστάμενο μοντέλο απειλών ή να δημιουργήσετε ένα καινούργιο επιλέγοντας μία από τις παρακάτω επιλογές. '
        },
        actions: {
            openExisting: 'Άνοιγμα ενός υφιστάμενου μοντέλου απειλών',
            createNew: 'Δημιουργήστε ένα νέο, κενό μοντέλο απειλών',
            readDemo: 'Εξερευνήστε ένα δείγμα μοντέλου απειλών',
            importExisting: 'Εισάγετε ένα μοντέλο απειλών σε μορφή JSON'
        }
    },
    demo: {
        select: 'Επιλέξτε ένα δείγμα μοντέλου απειλών από την παρακάτω λίστα'
    },
    desktop: {
        file: {
            heading: 'Αρχείο',
            clearRecentDocs: 'Καθαρισμός ιστορικού',
            close: 'Κλείσιμο Μοντέλου',
            closeWindow: 'Κλείσιμο Παραθύρου',
            new: 'Νέο Μοντέλο',
            open: 'Άνοιγμα Μοντέλου',
            recentDocs: 'Άνοιγμα πρόσφατου αρχείου',
            save: 'Αποθήκευση Μοντέλου',
            saveAs: 'Αποθήκευση Μοντέλου ως'
        },
        help: {
            heading: 'Βοήθεια',
            docs: 'Τεκμηρίωση',
            visit: 'Επισκεφθείτε μας στον OWASP',
            sheets: 'OWASP Cheat Sheets',
            github: 'Επισκεφθείτε μας στο GitHub',
            submit: 'Υποβάλετε ένα πρόβλημα',
            check: 'Έλεγχος για ενημερώσεις ...',
            about: {
                about: 'Σχετικά',
                version: 'Έκδοση'
            }
        }
    },
    repository: {
        select: 'Επιλέξτε ένα',
        from: 'αποθετήριο (repository) από την παρακάτω λίστα',
        noneFound: 'Δε βρέθηκαν αποθετήρια. Για να ξεκινήσετε, δημιουργήστε ένα νέο αποθετήριο τώρα στο'
    },
    branch: {
        select: 'Επιλέξτε ένα παρακλάδι (branch) από',
        from: 'από την παρακάτω λίστα ή',
        chooseRepo: 'επιλέξτε ένα άλλο αποθετήριο',
        or: 'ή',
        addNew: 'να προσθέσετε έναν νέο κλάδο',
        protectedBranch: 'Προστατευμένος κλάδος',
        nameRequired: 'Το όνομα του κλάδου είναι υποχρεωτικό',
        nameExists: 'Το όνομα του κλάδου υπάρχει ήδη σε αυτό το αποθετήριο',
        refBranch: 'Κλάδος αναφοράς (Ref Branch)',
        add: 'Προσθήκη υποκαταστήματος',
        cancel: 'Ακύρωση',
        name: 'Όνομα υποκαταστήματος',
    },
    folder: {
        select: 'Επιλέξτε ένα',
        from: 'φάκελο από την παρακάτω λίστα',
        noneFound: 'Αυτός ο φάκελος είναι κενός, μπορείτε να δημιουργήσετε ένα νέο μοντέλο απειλών εδώ.'
    },
    threatmodelSelect: {
        select: 'Επιλέξτε ένα μοντέλο απειλών από',
        from: 'από την παρακάτω λίστα, ή επιλέξτε ένα άλλο',
        branch: 'παρακλάδι (branch)',
        or: 'ή',
        repo: 'αποθετήριο',
        newThreatModel: 'Δημιουργήστε ένα νέο μοντέλο απειλών'
    },
    threatmodel: {
        contributors: 'Συνεισφέροντες',
        contributorsPlaceholder: 'Προσθήκη ενός νέου συνεισφέροντος',
        description: 'Περιγραφή Συστήματος Υψηλού Επιπέδου',
        dragAndDrop: 'Μεταφορά & απόθεση ή ',
        editing: 'Υπό επεξεργασία',
        jsonPaste: 'Κάντε επικόλληση (Paste) του JSON από το μοντέλο απειλών σας εδώ',
        owner: 'Ιδιοκτήτης',
        reviewer: 'Αξιολογητής',
        title: 'Τίτλος',
        diagram: {
            diagrams: 'Διαγράμματα',
            addNewDiagram: 'Προσθέστε ένα νέο διάγραμμα...',
            generic: {
                defaultTitle: 'Νέο γενικό διάγραμμα',
                defaultDescription: 'Περιγραφή νέου γενικού διαγράμματος',
                select: 'Γενικό'
            },
            stride: {
                defaultTitle: 'Νέο διάγραμμα STRIDE',
                defaultDescription: 'Περιγραφή νέου διαγράμματος STRIDE',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Νέο διάγραμμα LINDDUN',
                defaultDescription: 'Περιγραφή νέου διαγράμματος LINDDUN',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Νέο διάγραμμα PLOT4ai',
                defaultDescription: 'Περιγραφή νέου διαγράμματος PLOT4ai',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Νέο διάγραμμα CIA-DIE',
                defaultDescription: 'Περιγραφή νέου διαγράμματος CIA-DIE',
                select: 'CIADIE'
            },
            cia: {
                defaultTitle: 'Νέο διάγραμμα CIA',
                defaultDescription: 'Περιγραφή νέου διαγράμματος CIA',
                select: 'CIA'
            }
        },
        threats: 'Απειλές',
        errors: {
            create: 'Could not create the threat model file.  Check the developer console for more information',
            dropSingleFileOnly: 'Το Drag and drop απαιτεί ένα μοναδικό αρχείο.',
            invalidJson: 'Μη έγκυρο JSON.  Παρακαλούμε ελέγξτε το μοντέλο και προσπαθήστε ξανά',
            invalidModel: 'The threat model file does not validate correctly. Please check your model and try again',
            onlyJsonAllowed: 'Υποστηρίζονται μόνο αρχεία με κατάληξη .json.',
            open: 'Σφάλμα κατά το άνοιγμα αυτού του μοντέλου απειλών. Ελέγξτε την κονσόλα του προγραμματιστή για περισσότερες πληροφορίες',
            save: 'Σφάλμα κατά την αποθήκευση του μοντέλου απειλών. Παρακαλούμε ελέγξτε την κονσόλα για περαιτέρω πληροφορίες'
        },
        warnings: {
            export: 'Could not export the Threat Model. Check the developer console for more information',
            jsonSchema: 'Model does not strictly match schema. Details from the developer console',
            noModelOpen: 'No model open',
            otmUnsupported: 'Import of Open Threat Model file format not yet supported',
            save: 'Could not save the Threat Model. Check the developer console for more information',
            tmUnsupported: 'Import of TM-BOM file format is experimental and subject to change that may break models',
            v1Translate: 'Τα εισαχθέντα μοντέλα της έκδοσης 1.x models θα αναβαθμιστούν στο σχήμα της έκδοσης 2.0'
        },
        prompts: {
            created: 'Threat model successfully created',
            exported: 'Threat model exported',
            opened: 'Το μοντέλο απειλών άνοιξε επιτυχώς',
            downloading: 'Downloading threat model',
            saved: 'Το μοντέλο απειλών αποθηκεύτηκε επιτυχώς'
        },
        properties: {
            title: 'Ιδιότητες',
            emptyState: 'Επιλέξτε ένα στοιχείο στο διάγραμμα για να το επεξεργαστείτε',
            name: 'Όνομα',
            text: 'Κείμενο',
            description: 'Περιγραφή',
            outOfScope: 'Εκτός πεδίου εφαρμογής',
            bidirection: 'Αμφίδρομο',
            reasonOutOfScope: 'Λόγος εκτός πεδίου εφαρμογής',
            handlesCardPayment: 'Πληρωμή κάρτας',
            handlesGoodsOrServices: 'Αγαθά ή υπηρεσίες',
            isALog: 'Είναι αρχείο καταγραφής',
            isEncrypted: 'Κρυπτογραφημένο',
            isSigned: 'Υπογεγραμμένο',
            isWebApplication: 'Web Εφαρμογή',
            privilegeLevel: 'Επίπεδο δικαιώματος',
            providesAuthentication: 'Παρέχει αυθεντικοποίηση',
            protocol: 'Πρωτόκολλο',
            publicNetwork: 'Δημόσιο Δίκτυο',
            storesCredentials: 'Αποθηκεύει στοιχεία πρόσβασης',
            storesInventory: 'Stores Inventory'
        },
        buttons: {
            delete: 'Διαγραφή επιλεγμένων',
            redo: 'Επανάληψη',
            shortcuts: 'Συντομεύσεις Πληκτρολογίου',
            toggleGrid: 'Εναλλαγή Πλέγματος',
            undo: 'Αναίρεση',
            zoomIn: 'Μεγένθυνση',
            zoomOut: 'Σμίκρυνση'
        },
        shortcuts: {
            title: 'Συντομεύσεις',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Αντιγραφή'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Επικόλληση'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Αναίρεση'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Επανάληψη'
            },
            delete: {
                shortcut: 'del',
                action: 'Διαγραφή'
            },
            pan: {
                shortcut: 'shift + αριστερό κλικ (κράτημα/σύρσιμο)',
                action: 'οριζόντια/κάθετη μετακίνηση'
            },
            multiSelect: {
                shortcut: 'κάντε αριστερό κλικ σε ένα άδειο σημείο και σύρετε',
                action: 'Πολλαπλή Επιλογή'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + τροχός κύλισης',
                action: 'Εστίαση'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Αποθήκευση'
            }
        },
        stencil: {
            boundaries: 'Όρια',
            components: 'Συστατικά',
            entities: 'Οντότητες',
            metadata: 'Μεταδεδομένα',
            search: 'Αναζήτηση',
            notFound: 'Δεν το έχουμε ακόμα αυτό, θέλετε να ανοίξετε ένα issue; :)'
        },
        shapes: {
            actor: 'Παράγοντας',
            flow: 'Ροή Δεδομένων',
            flowStencil: 'Ροή Δεδομένων',
            process: 'Διαδικασία',
            store: 'Αποθετήριο Δεδομένων',
            text: 'Κείμενο',
            trustBoundary: 'Όριο Εμπιστοσύνης'
        }
    },
    forms: {
        apply: 'Εφαρμογή',
        cancel: 'Ακύρωση',
        close: 'Κλείσιμο',
        closeModel: 'Κλείσιμο Μοντέλου',
        delete: 'Διαγραφή',
        discardTitle: 'Απόρριψη αλλαγών;',
        discardMessage: 'Είστε σίγουροι ότι θέλετε να απορρίψετε τις αλλαγές;',
        duplicate: 'Διπλότυπη',
        edit: 'Επεξεργασία',
        export: 'Εξαγωγή',
        exportAs: 'Εξαγωγή Μοντέλου Ως',
        exportHtml: 'Αναφορά HTML',
        exportPdf: 'Αναφορά PDF',
        exportTd: 'Πρωτότυπο (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Εισαγωγή',
        ok: 'OK',
        open: 'Άνοιγμα',
        openModel: 'Άνοιγμα Μοντέλου',
        print: 'ΕΚτύπωση',
        reload: 'Φόρτωση εκ νέου',
        remove: 'Αφαίρεση',
        report: 'Αναφορά',
        save: 'Αποθήκευση',
        saveAs: 'Αποθήκευση ως',
        saveModel: 'Αποθήκευση Μοντέλου',
        saveModelAs: 'Αποθήκευση Μοντέλου ως',
        search: 'Αναζήτηση',
        next: 'Επόμενο',
        previous: 'προηγούμενος'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Εμπιστευτικότητα',
                integrity: 'Ακεραιότητα',
                availability: 'Διαθεσιμότητα'
            },
            ciadie: {
                header: '--- CIA-DIE ---',
                confidentiality: 'Εμπιστευτικότητα',
                integrity: 'Ακεραιότητα',
                availability: 'Διαθεσιμότητα',
                distributed: 'Κατανεμημένο (Distributed)',
                immutable: 'Αμετάβλητο (Immutable)',
                ephemeral: 'Εφήμερο (Ephemeral)'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Συνδεσιμότητα',
                identifiability: 'Αναγνωρισιμότητα',
                nonRepudiation: 'Μη αποποίηση',
                detectability: 'Ανιχνευσιμότητα',
                disclosureOfInformation: 'Αποκάλυψη Πληροφοριών (Information Disclosure)',
                unawareness: 'Έλλειψη επίγνωσης (Unawareness)',
                nonCompliance: 'Μη συμμόρφωση (Non-compliance)'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Τεχνική & Διαδικασίες (Technique & Processes)',
                accessibility: 'Προσβασιμότητα (Accessibility)',
                identifiabilityLinkability: 'Αναγνωρισιμότητα & Συνδεσιμότητα (Identifiability & Linkability)',
                security: 'Ασφάλεια (Security)',
                safety: 'Ασφάλεια (Safety)',
                unawareness: 'Έλλειψη επίγνωσης (Unawareness)',
                ethicsHumanRights: 'Ηθική και Ανθρώπινα Δικαιώματα (Ethics & Human Rights)',
                nonCompliance: 'Μη συμμόρφωση (Non-compliance)'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'Παραπλάνηση (Spoofing)',
                tampering: 'Παραποίηση (Tampering)',
                repudiation: 'Αποποίηση (Repudiation)',
                informationDisclosure: 'Αποκάλυψη Πληροφοριών (Information Disclosure)',
                denialOfService: 'Άρνηση εκτέλεσης υπηρεσίας (Denial of service)',
                elevationOfPrivilege: 'Αναβάθμιση προνομίων (Elevation of Priviledge)'
            }
        },
        generic: {
            default: 'Νέα γενική απειλή',
            cia: 'Νέα απειλή CIA',
            ciadie: 'Νέα απειλή CIA-DIE',
            linddun: 'Νέα απειλή LINDDUN',
            plot4ai: 'Νέα απειλή PLOT4ai',
            stride: 'Νέα απειλή STRIDE'
        },
        edit: 'Επεξεργασία Απειλής',
        confirmDeleteTitle: 'Επιβεβαίωση Διαγραφής',
        confirmDeleteMessage: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την απειλή;',
        description: 'Παρέχετε μια περιγραφή για αυτή την απειλή',
        emptyThreat: 'Επιλέξτε ένα στοιχείο στο γράφημα για να προσθέσετε την απειλή',
        mitigation: 'Παρέχετε μετριασμό ή πρόληψη για αυτή την απειλή',
        newThreat: 'Νέα Απειλή',
        newThreatByType: 'Νέα απειλή βάσει τύπου',
        newThreatByContext: 'Νέα απειλή βάσει του γενικότερου πλαισίου (Context)',
        properties: {
            description: 'Περιγραφή',
            mitigation: 'Μέτρα Περιορισμού Κινδύνου (mitigations)',
            modelType: 'Τύπος Μοντέλου',
            number: 'Αριθμός',
            severity: 'Προτεραιότητα',
            score: 'Σκορ',
            status: 'Κατάσταση',
            title: 'Τίτλος',
            type: 'Τύπος'
        },
        status: {
            notApplicable: 'Δεν έχει εφαρμογή',
            open: 'Ανοιχτή',
            mitigated: 'Καλύφθηκε'
        },
        severity: {
            tbd: 'TBD',
            low: 'Χαμηλή',
            medium: 'Μεσαία',
            high: 'Υψηλή',
            critical: 'Κρίσιμη'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Εμφάνιση απειλών εκτός πεδίου εφαρμογής',
            showMitigatedThreats: 'Εμφάνιση απειλών που έχουν μετριαστεί',
            showModelDiagrams: 'Εμφάνιση διαγραμμάτων μοντέλων',
            showEmpty: 'Προβολή κενών στοιχείων',
            showProperties: 'Προβολή ιδιοτήτων στοιχείου',
            showBranding: 'Λογότυπο Threat Dragon'
        },
        title: 'Αναφορά μοντέλου απειλών για',
        dateGenerated: 'Ημερομηνία δημιουργίας',
        executiveSummary: 'Επιτελική Σύνοψη',
        notProvided: 'Δεν παρασχέθη',
        summary: 'Σύνοψη',
        threatStats: {
            total: 'Σύνολο απειλών',
            mitigated: 'Σύνολο μετριασμένων',
            notApplicable: 'Total Not Applicable',
            notMitigated: 'Μη μετριασμένες',
            openCritical: 'Ανοιχτές / Κρίσιμη Προτεραιότητα',
            openHigh: 'Ανοιχτές / Υψηλής Προτεραιότητας',
            openMedium: 'Ανοιχτές / Μέτριας Προτεραιότητας',
            openLow: 'Ανοιχτές / Χαμηλής Προτεραιότητας',
            openTbd: 'Ανοιχτές / TBD Προτεραιότητα',
            openUnknown: 'Ανοιχτές / Άγνωστης Προτεραιότητας'
        }
    },
    upgrade: {
        modal: {
            header: 'Ενημέρωση Μοντέλου Απειλών',
            welcome: 'Καλώς ήρθατε στην 2η έκδοση του OWASP Threat Dragon!',
            p1: 'Η 2η έκδοση χρησιμοποιεί μια διαφορετική βιβλιοθήκη σχεδίασης, η οποία θα αλλάξει τον τρόπο με τον οποίο μέρη των μοντέλων απειλών αποθηκεύονται. Ενώ τα περισσότερα διαγράμματα θα δείχνουν το ίδιο όπως στις προηγούμενες εκδόσεις του Threat Dragon, υπάρχουν περιπτώσεις κατά τις οποίες ενδέχεται να απαιτηθούν κάποιες τροποποιήσεις.',
            p2: 'Μετά το κλείσιμο του μοντέλου, θα δείτε πως κάθε διάγραμμα στο μοντέλο απεικονίζεται στη μορφή της 2ης έκδοση. Παρακαλούμε όπως σημειώσετε τα διαγράμματα που τυχόν απαιτήσουν τροποποιήσεις. Αυτή είναι μία "εφάπαξ" αναβάθμιση, και δε θα χρειαστεί να δείτε ξανά αυτό το μήνυμα μετά την αποθήκευση του μοντέλου.'
        },
        instructions: 'Τέλεια! Ας προχωρήσουμε στο μοντέλο σας.',
        continue: 'Συνέχεια στο μοντέλο απειλών'
    }
};

export default ell;
