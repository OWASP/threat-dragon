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
            description: 'Είστε έτοιμοι να ξεκινήσετε να κάνετε τα σχέδια των εφαρμογών σας πιο ασφαλή. Μπορείτε να ανοίξετε ένα υφιστάμενο μοντέλο απειλών ή να δημιουργήσετ ένα καινούργιο επιλέγοντας μία από τις παρακάτω επιλογές. '
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
        jsonPaste: 'Κάντε επικόλληση (Paste) του JSON από το μοντέλο απειλών σας εδώ:',
        invalidJson: 'Μη έγκυρο JSON.  Παρακαλούμε ελέγξτε το μοντέλο και προσπαθήστε ξανά.',
        owner: 'Ιδιοκτήτης',
        reviewer: 'Αξιολογητής',
        contributors: 'Συνεισφέροντες',
        contributorsPlaceholder: 'Προσθήκη ενός νέου συνεισφέροντος',
        description: 'Περιγραφή Συστήματος Υψηλού Επιπέδου',
        editing: 'Υπό επεξεργασία',
        title: 'Τίτλος',
        diagrams: 'Διαγράμματα',
        addNewDiagram: 'Προσθέστε ένα νέο διάγραμμα...',
        threats: 'Απειλές',
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
            shortcuts: 'Συντομεύσεις Πληκτρολογίου',
            undo: 'Αναίρεση',
            redo: 'Επανάληψη',
            zoomIn: 'Μεγένθυνση',
            zoomOut: 'Σμίκρυνση',
            toggleGrid: 'Εναλλαγή Πλέγματος'
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
            entities: 'Οντότητες',
            boundaries: 'Όρια',
            metadata: 'Μεταδεδομένα',
            search: 'Αναζήτηση',
            notFound: 'Δεν το έχουμε ακόμα αυτό, θέλετε να ανοίξετε ένα issue; :)'
        },
        shapes: {
            actor: 'Παράγοντας',
            flowStencil: 'Ροή Δεδομένων',
            process: 'Διαδικασία',
            store: 'Αποθετήριο Δεδομένων',
            text: 'Κείμενο',
            trustBoundary: 'Όριο Εμπιστοσύνης'
        }
    },
    forms: {
        edit: 'Επεξεργασία',
        report: 'Αναφορά',
        delete: 'Διαγραφή',
        remove: 'Αφαίρεση',
        save: 'Αποθήκευση',
        reload: 'Φόρτωση εκ νέου',
        cancel: 'Ακύρωση',
        close: 'Κλείσιμο',
        search: 'Αναζήτηση',
        import: 'Εισαγωγή'
    },
    threats: {
        models: {
            confidentiality: 'Εμπιστευτικότητα',
            integrity: 'Ακεραιότητα',
            availability: 'Διαθεσιμότητα',
            linkability: 'Συνδεσιμότητα',
            identifiability: 'Αναγνωρισιμότητα',
            nonRepudiation: 'Μη αποποίηση',
            detectability: 'Ανιχνευσιμότητα',
            disclosureOfInformation: 'Αποκάλυψη Πληροφοριών (Information Disclosure)',
            unawareness: 'Έλλειψη επίγνωσης (Unawareness)',
            nonCompliance: 'Μη συμμόρφωση',
            spoofing: 'Παραπλάνηση (spoofing)',
            tampering: 'Παραποίηση (Tampering)',
            repudiation: 'Αποποίηση (Repudiation)',
            informationDisclosure: 'Αποκάλυψη Πληροφοριών (Information Disclosure)',
            denialOfService: 'Άρνηση εκτέλεσης υπηρεσίας (Denial of service)',
            elevationOfPrivilege: 'Αναβάθμιση προνομίων (Elevation of Priviledge)'
        },
        edit: 'Επεξεργασία Απειλής',
        confirmDeleteTitle: 'Επιβεβαίωση Διαγραφής',
        confirmDeleteMessage: 'Είστε σίγουροι ότι θέλετε να δαιγράψετε αυτή την απειλή;',
        newThreat: 'Νέα Απειλή',
        properties: {
            title: 'Τίτλος',
            status: 'Κατάσταση',
            priority: 'Προτεραιότητα',
            type: 'Τύπος',
            description: 'Περιγραφή',
            mitigation: 'Μέτρα Μετριασμού Κινδύνου (mitigations)',
            modelType: 'Τύπος Μοντέλου'
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
    }
};

export default el;
