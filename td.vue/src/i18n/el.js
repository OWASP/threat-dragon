const el = {
    auth: {
        sessionExpired: 'Η συνεδρία σας έχει λήξει.  Παρακαλούμε συνδεθείτε εκ νέου για να συνεχίσετε.'
    },
    nav: {
        v2Warning: 'Αυτή είναι η έκδοση 2.0 του OWASP Threat Dragon και είναι ακόμα υπό ανάπτυξη. Μην την χρησιμοποιείτε για να τροποποιήσετε υπάρχοντα μοντέλα, καθώς αυτή η έκδοση μπορεί να τα χαλάσει!',
        loggedInAs: 'Σύνδεση ως'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'Το Threat Dragon είναι ένα δωρεάν, ανοιχτού κώδικα εργαλείο μοντελοποίησης απειλών (threat modeling) του Οργανισμού OWASP. Μπορεί να χρησιμοποιηθεί ως μια αυτόνομη desktop εφαρμογή για Windows, MacOS και Linux ή ως μια web εφαρμογή. Η desktop εφαρμογή είναι ιδανική αν θέλετε να δοκιμάσετε την εφαρμογή χωρίς να της δώσετε πρόσβαση στα github αποθετήρια σας, αλλά αν επιλέξετε την online έκδοση τότε θα "εξαπολύσετε" την φοβερή δύναμη του GitHub στα μοντέλα απειλών σας! Προφανώς, για να το κάνετε αυτό θα πρέπει πρώτα να συνδεθείτε.',
        loginWith: 'Είσοδος με'
    },
    providers: {
        github: {
            displayName: 'GitHub',
        },
        local: {
            displayName: 'Τοπική Συνεδρία'
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
            demo: 'Εξερευνήστε ένα δείγμα μοντέλου απειλών',
            import: 'Εισάγετε ένα μοντέλο απειλών σε μορφή JSON'
        }
    },
    demo: {
        select: 'Επιλέξτε ένα δείγμα μοντέλου απειλών από την παρακάτω λίστα'
    },
    desktop: {
        file: {
            heading: 'File',
            close: 'Close Model',
            open: 'Open Model',
            save: 'Save Model',
            saveAs: 'Save Model As',
        },
        help: {
            heading: 'Help',
            docs: 'Documentation',
            visit: 'Visit us at OWASP',
            sheets: 'OWASP Cheat Sheets',
            github: 'Visit us on GitHub',
            submit: 'Submit an Issue',
            check: 'Check for updates ...'
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
        chooseRepo: 'επιλέξτε ένα άλλο αποθετήριο'
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
        dragAndDrop: 'Drag and drop or ',
        editing: 'Υπό επεξεργασία',
        invalidJson: 'Μη έγκυρο JSON.  Παρακαλούμε ελέγξτε το μοντέλο και προσπαθήστε ξανά.',
        jsonPaste: 'Κάντε επικόλληση (Paste) του JSON από το μοντέλο απειλών σας εδώ',
        owner: 'Ιδιοκτήτης',
        reviewer: 'Αξιολογητής',
        title: 'Τίτλος',
        diagram: {
            diagrams: 'Διαγράμματα',
            addNewDiagram: 'Προσθέστε ένα νέο διάγραμμα...',
            generic: {
                diagramTitle: 'New generic diagram',
                select: `Generic`
            },
            stride: {
                diagramTitle: 'New STRIDE diagram',
                select: `STRIDE`
            },
            linddun: {
                diagramTitle: 'New LINDDUN diagram',
                select: `LINDDUN`
            },
            cia: {
                diagramTitle: 'New CIA diagram',
                select: `CIA`,
            }
        },
        threats: 'Απειλές',
        errors: {
            open: 'Error opening this Threat Model. Check the developer console for more information',
            save: 'Error saving the Threat Model. Check the developer console for more information'
        },
        opened: 'Threat model successfully opened',
        saved: 'Threat model successfully saved',
        properties: {
            title: 'Ιδιότητες',
            emptyState: 'Επιλέξτε ένα στοιχείο στο διάγραμμα για να το επεξεργαστείτε',
            name: 'Όνομα',
            text: 'Κείμενο',
            description: 'Περιγραφή',
            outOfScope: 'Εκτός πεδίου εφαρμογής',
            reasonOutOfScope: 'Λόγος εκτός πεδίου εφαρμογής',
            privilegeLevel: 'Επίπεδο δικαιώματος',
            isALog: 'Είναι αρχείο καταγραφής',
            storesCredentials: 'Αποθηκεύει στοιχεία πρόσβασης',
            isEncrypted: 'Κρυπτογραφημένο',
            isSigned: 'Υπογεγραμμένο',
            providesAuthentication: 'Παρέχει αυθεντικοποίηση',
            protocol: 'Πρωτόκολλο',
            publicNetwork: 'Δημόσιο Δίκτυο'
        },
        buttons: {
            delete: 'Delete selected',
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
            }
        },
        stencil: {
            boundaries: 'Όρια',
            components: 'Components',
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
        apply: 'Apply',
        cancel: 'Ακύρωση',
        close: 'Κλείσιμο',
        closeModel: 'Close Model',
        delete: 'Διαγραφή',
        discardTitle: 'Discard Changes?',
        discardMessage: 'Are you sure you want to discard your changes?',
        edit: 'Επεξεργασία',
        import: 'Εισαγωγή',
        ok: 'OK',
        open: 'Open',
        openModel: 'Open Model',
        print: 'Print',
        reload: 'Φόρτωση εκ νέου',
        remove: 'Αφαίρεση',
        report: 'Αναφορά',
        save: 'Αποθήκευση',
        saveAs: 'Save As',
        saveModel: 'Save Model',
        saveModelAs: 'Save Model As',
        savePdf: 'Save PDF',
        search: 'Αναζήτηση'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Εμπιστευτικότητα',
                integrity: 'Ακεραιότητα',
                availability: 'Διαθεσιμότητα'
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
            default: 'New generic threat',
            cia: 'New CIA threat',
            linddun: 'New LINDDUN threat',
            stride: 'New STRIDE threat'
        },
        edit: 'Επεξεργασία Απειλής',
        confirmDeleteTitle: 'Επιβεβαίωση Διαγραφής',
        confirmDeleteMessage: 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την απειλή;',
        description: 'Provide a description for this threat',
        emptyThreat: 'Select an element on the graph to add a threat',
        mitigation: 'Provide mitigation or prevention for this threat',
        newThreat: 'Νέα Απειλή',
        newThreatByType: 'New Threat by Type',
        newThreatByContext: 'New Threat by Context',
        properties: {
            description: 'Περιγραφή',
            mitigation: 'Μέτρα Μετριασμού Κινδύνου (mitigations)',
            modelType: 'Τύπος Μοντέλου',
            number: 'Number',
            priority: 'Προτεραιότητα',
            score: 'Score',
            status: 'Κατάσταση',
            title: 'Τίτλος',
            type: 'Τύπος'
        },
        status: {
            notApplicable: 'Δεν έχει εφαρμογή',
            open: 'Ανοιχτή',
            mitigated: 'Καλύφθηκε'
        },
        priority: {
            low: 'Χαμηλή',
            medium: 'Μεσαία',
            high: 'Υψηλή'
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
        executiveSummary: 'Executive Summary',
        notProvided: 'Not provided',
        summary: 'Summary',
        threatStats: {
            total: 'Total Threats',
            mitigated: 'Total Mitigated',
            notMitigated: 'Not Mitigated',
            openHigh: 'Open / High Priority',
            openMedium: 'Open / Medium Priority',
            openLow: 'Open / Low Priority',
            openUnknown: 'Open / Unknown Priority',
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

export default el;
