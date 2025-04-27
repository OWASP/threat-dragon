const heb = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    nav: {
        v2Warning:
            'מודלי איומים בגרסה 2.0 אינם תואמים לאחור עם מודלי Threat Dragon בגרסה 1.x. מודלים מיובאים מגרסה 1.x יעודכנו לסכמה של גרסה 2.0',
        loggedInAs: 'מחובר כ',
        logOut: 'התנתק',
        tos: 'תנאי שימוש',
        privacy: 'מדיניות פרטיות'
    },
    operator: {
        heading: 'מפעיל',
        operatedby: 'אתר זה ומופע של OWASP Threat Dragon מופעל על ידי:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'מפעיל האתר הזה'}`,
        contact: 'צור קשר: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(פרטי קשר לא סופקו)')
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'לוגו Threat Dragon',
        description:
            'OWASP Threat Dragon הוא יישום חינמי, קוד פתוח, חוצה פלטפורמות ליצירת מודלי איומים. השתמש בו לציור תרשימי מידול איומים ולזיהוי איומים למערכת שלך. עם דגש על גמישות ופשטות, הוא נגיש בקלות לכל סוגי המשתמשים.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'התחל'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'התחבר עם'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'התחבר עם'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'התחבר עם'
        },
        google: {
            displayName: 'Google',
            loginWith: 'התחבר עם'
        },
        local: {
            displayName: 'הפעלה מקומית',
            loginWith: 'התחבר ל'
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'פתח',
            description: 'בחר קובץ מודל איומים או תיקיית יעד מ-Google Drive',
            saveThreatModel: 'שמור מודל איומים ב-Google Drive',
            saveDescription: 'בחר תיקייה ב-Google Drive לשמירת מודל האיומים שלך',
            fileName: 'שם קובץ',
            fileNamePlaceholder: 'הזן שם לקובץ שלך',
            selectFolder: 'בחר תיקייה ב-Google Drive',
            selectFile: 'בחר קובץ מ-Google Drive',
            selectThreatModel: 'בחר מודל איומים מ-Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'ברוך הבא!',
            description:
                'אתה מוכן להתחיל להפוך את עיצובי האפליקציה שלך לבטוחים יותר. אתה יכול לפתוח מודל איומים קיים או ליצור חדש על ידי בחירת אחת מהאפשרויות למטה.'
        },
        actions: {
            openExisting: 'פתח מודל איומים קיים',
            createNew: 'צור מודל איומים חדש וריק',
            readDemo: 'חקור מודל איומים לדוגמה',
            importExisting: 'ייבא מודל איומים באמצעות JSON'
        }
    },
    demo: {
        select: 'בחר מודל איומים לדוגמה מהרשימה למטה'
    },
    desktop: {
        file: {
            heading: 'קובץ',
            clearRecentDocs: 'נקה תפריט',
            close: 'סגור מודל',
            closeWindow: 'סגור חלון',
            new: 'מודל חדש',
            open: 'פתח מודל',
            recentDocs: 'פתח אחרונים',
            save: 'שמור מודל',
            saveAs: 'שמור מודל בשם'
        },
        help: {
            heading: 'עזרה',
            docs: 'תיעוד',
            visit: 'בקר אותנו ב-OWASP',
            sheets: 'דפי עזר של OWASP',
            github: 'בקר אותנו ב-GitHub',
            submit: 'דווח על בעיה',
            check: 'בדוק עדכונים...'
        }
    },
    repository: {
        select: 'בחר',
        from: 'מאגר מהרשימה למטה',
        noneFound: 'לא נמצאו מאגרים. כדי להתחיל, צור מאגר חדש ב'
    },
    branch: {
        select: 'בחר ענף מ',
        from: 'מהרשימה למטה או',
        chooseRepo: 'בחר מאגר אחר',
        or: 'או',
        addNew: 'הוסף ענף חדש',
        protectedBranch: 'ענף מוגן',
        refBranch: 'ענף התייחסות',
        nameRequired: 'נדרש שם ענף',
        nameExists: 'שם הענף כבר קיים',
        add: 'הוסף ענף',
        cancel: 'בטל',
        name: 'שם ענף'
    },
    folder: {
        select: 'בחר',
        from: 'תיקייה מהרשימה למטה',
        noneFound: 'תיקייה זו ריקה. אתה יכול ליצור מודל איומים חדש כאן.'
    },
    threatmodelSelect: {
        select: 'בחר מודל איומים מ',
        from: 'מהרשימה למטה, או בחר',
        branch: 'ענף',
        or: 'או',
        repo: 'מאגר',
        newThreatModel: 'צור מודל איומים חדש'
    },
    threatmodel: {
        contributors: 'תורמים',
        contributorsPlaceholder: 'התחל להקליד כדי להוסיף תורם',
        description: 'תיאור מערכת ברמה גבוהה',
        dragAndDrop: 'גרור ושחרר או ',
        jsonPaste: 'שחרר קובץ JSON של מודל איומים או הדבק את תוכנו כאן:',
        owner: 'בעלים',
        reviewer: 'סוקר',
        title: 'כותרת',
        new: {
            title: 'צור מודל איומים חדש',
            description: 'הזן מידע על מודל האיומים החדש שלך'
        },
        edit: {
            title: 'ערוך מודל איומים',
            description: 'שנה מידע על מודל האיומים שלך'
        },
        placeholder: {
            title: 'כותרת מודל האיומים',
            owner: 'שם הבעלים או הצוות',
            description: 'הזן תיאור ברמה גבוהה של המערכת המדוגמת',
            reviewer: 'שם הסוקר'
        },
        diagram: {
            diagrams: 'תרשימים',
            addNewDiagram: 'הוסף תרשים חדש...',
            generic: {
                defaultTitle: 'תרשים כללי חדש',
                defaultDescription: 'תיאור תרשים כללי חדש',
                select: 'כללי'
            },
            stride: {
                defaultTitle: 'תרשים STRIDE חדש',
                defaultDescription: 'תיאור תרשים STRIDE חדש',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'תרשים LINDDUN חדש',
                defaultDescription: 'תיאור תרשים LINDDUN חדש',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'תרשים PLOT4ai חדש',
                defaultDescription: 'תיאור תרשים PLOT4ai חדש',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'תרשים DIE חדש',
                defaultDescription: 'תיאור תרשים DIE חדש',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'תרשים CIA חדש',
                defaultDescription: 'תיאור תרשים CIA חדש',
                select: 'CIA'
            }
        },
        threats: 'איומים',
        errors: {
            dropSingleFileOnly: 'גרירה ושחרור דורשים קובץ יחיד.',
            invalidJson: 'JSON לא חוקי. אנא בדוק את המודל שלך ונסה שוב.',
            onlyJsonAllowed: 'רק קבצים שמסתיימים ב-.json נתמכים.',
            open: 'שגיאה בפתיחת מודל האיומים הזה. בדוק את קונסולת המפתח למידע נוסף',
            save: 'שגיאה בשמירת מודל האיומים. בדוק את קונסולת המפתח למידע נוסף',
            googleDriveSave: 'שגיאה בשמירה ל-Google Drive. ודא שיש לך הרשאות מתאימות.'
        },
        localFilePicker: {
            title: 'בחר קובץ מודל איומים',
            noFiles: 'אין קבצים בספרייה זו',
            errors: {
                loadDirectory: 'שגיאה בטעינת הספרייה. אנא נסה שוב.'
            }
        },
        opened: 'מודל האיומים נפתח בהצלחה',
        saved: 'מודל האיומים נשמר בהצלחה',
        properties: {
            title: 'מאפיינים',
            emptyState: 'בחר אלמנט בגרף לעריכה',
            name: 'שם',
            text: 'טקסט',
            description: 'תיאור',
            outOfScope: 'מחוץ לתחום',
            bidirection: 'דו-כיווני',
            reasonOutOfScope: 'סיבה להיות מחוץ לתחום',
            handlesCardPayment: 'תשלום בכרטיס',
            handlesGoodsOrServices: 'מוצרים או שירותים',
            isALog: 'הוא יומן',
            isEncrypted: 'מוצפן',
            isSigned: 'חתום',
            isWebApplication: 'יישום אינטרנט',
            privilegeLevel: 'רמת הרשאה',
            providesAuthentication: 'מספק אימות',
            protocol: 'פרוטוקול',
            publicNetwork: 'רשת ציבורית',
            storesCredentials: 'מאחסן אישורים',
            storesInventory: 'מאחסן מלאי'
        },
        controlButtons: {
            delete: 'מחק נבחר',
            redo: 'בצע שוב עריכה',
            shortcuts: 'קיצורי מקלדת',
            toggleGrid: 'החלף רשת',
            undo: 'בטל עריכה',
            zoomIn: 'הגדל',
            zoomOut: 'הקטן',
            save: 'שמור'
        },
        shortcuts: {
            title: 'קיצורים',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'העתק'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'הדבק'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'בטל'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'בצע שוב'
            },
            delete: {
                shortcut: 'del',
                action: 'מחק'
            },
            pan: {
                shortcut: 'shift + לחיצה שמאלית (החזק/גרור)',
                action: 'הזזה'
            },
            multiSelect: {
                shortcut: 'לחיצה שמאלית על מקום ריק וגרירה',
                action: 'בחירה מרובה'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + גלגלת עכבר',
                action: 'זום'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'שמור'
            }
        },
        stencil: {
            title: 'צורות',
            boundaries: 'גבולות',
            components: 'רכיבים',
            entities: 'ישויות',
            metadata: 'מטא-נתונים',
            search: 'חפש צורות',
            notFound: 'אין לנו את זה עדיין, רוצה לפתוח נושא? :)'
        },
        shapes: {
            actor: 'שחקן',
            flow: 'זרימת נתונים',
            flowStencil: 'זרימת נתונים',
            process: 'תהליך',
            store: 'מאגר',
            text: 'טקסט תיאורי',
            trustBoundary: 'גבול אמון'
        }
    },
    forms: {
        apply: 'החל',
        cancel: 'בטל',
        close: 'סגור',
        closeModel: 'סגור מודל',
        create: 'צור',
        delete: 'מחק',
        discardTitle: 'לבטל שינויים?',
        discardMessage: 'האם אתה בטוח שברצונך לבטל את השינויים שלך?',
        edit: 'ערוך',
        export: 'ייצא',
        exportAs: 'ייצא מודל בתור',
        exportHtml: 'דוח HTML',
        exportPdf: 'דוח PDF',
        exportTd: 'מקורי (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        exportFormats: {
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG'
        },
        import: 'ייבא',
        ok: 'אישור',
        open: 'פתח',
        openModel: 'פתח מודל',
        print: 'הדפס',
        reload: 'טען מחדש',
        remove: 'הסר',
        report: 'דוח',
        save: 'שמור',
        saveAs: 'שמור בשם',
        saveModel: 'שמור מודל',
        saveModelAs: 'שמור מודל בשם',
        search: 'חפש',
        next: 'הבא',
        previous: 'הקודם',
        requiredField: 'שדה חובה'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'סודיות',
                integrity: 'שלמות',
                availability: 'זמינות'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'מבוזר',
                immutable: 'בלתי משתנה',
                ephemeral: 'זמני'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'קישוריות',
                identifiability: 'זיהוי',
                nonRepudiation: 'אי-הכחשה',
                detectability: 'יכולת גילוי',
                disclosureOfInformation: 'חשיפת מידע',
                unawareness: 'חוסר מודעות',
                nonCompliance: 'אי-ציות'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'טכניקה ותהליכים',
                accessibility: 'נגישות',
                identifiabilityLinkability: 'זיהוי וקישוריות',
                security: 'אבטחה',
                safety: 'בטיחות',
                unawareness: 'חוסר מודעות',
                ethicsHumanRights: 'אתיקה וזכויות אדם',
                nonCompliance: 'אי-ציות'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'התחזות',
                tampering: 'חבלה',
                repudiation: 'הכחשה',
                informationDisclosure: 'חשיפת מידע',
                denialOfService: 'מניעת שירות',
                elevationOfPrivilege: 'העלאת הרשאות'
            }
        },
        generic: {
            default: 'איום כללי חדש',
            cia: 'איום CIA חדש',
            die: 'איום DIE חדש',
            linddun: 'איום LINDDUN חדש',
            plot4ai: 'איום PLOT4ai חדש',
            stride: 'איום STRIDE חדש'
        },
        new: 'איום חדש',
        edit: 'ערוך איום',
        confirmDeleteTitle: 'אשר מחיקה',
        confirmDeleteMessage: 'האם אתה בטוח שאתה באמת רוצה למחוק את האיום הזה?',
        description: 'ספק תיאור לאיום זה',
        emptyThreat: 'בחר אלמנט בגרף כדי להוסיף איום',
        mitigation: 'ספק פתרון לאיום זה או סיבה אם הסטטוס הוא N/A',
        newThreat: 'איום חדש',
        newThreatByType: 'איום חדש לפי סוג',
        newThreatByContext: 'איום חדש לפי הקשר',
        properties: {
            description: 'תיאור',
            mitigation: 'פתרונות',
            modelType: 'סוג מודל',
            number: 'מספר',
            priority: 'עדיפות',
            score: 'ציון',
            status: 'סטטוס',
            title: 'כותרת',
            type: 'סוג'
        },
        status: {
            notApplicable: 'לא רלוונטי',
            open: 'פתוח',
            mitigated: 'מופחת'
        },
        priority: {
            tbd: 'לקבוע',
            low: 'נמוך',
            medium: 'בינוני',
            high: 'גבוה',
            critical: 'קריטי'
        }
    },
    report: {
        options: {
            showOutOfScope: 'הצג אלמנטים מחוץ לתחום',
            showMitigatedThreats: 'הצג איומים מופחתים',
            showModelDiagrams: 'הצג תרשימי מודל',
            showEmpty: 'הצג אלמנטים ריקים',
            showProperties: 'הצג מאפייני אלמנטים',
            showBranding: 'לוגו Threat Dragon'
        },
        title: 'דוח מודל איומים עבור',
        dateGenerated: 'תאריך יצירה',
        executiveSummary: 'תקציר מנהלים',
        notProvided: 'לא סופק',
        summary: 'סיכום',
        threatStats: {
            total: 'סך האיומים',
            mitigated: 'סך הכל מופחתים',
            notMitigated: 'לא מופחתים',
            openCritical: 'פתוח / עדיפות קריטית',
            openHigh: 'פתוח / עדיפות גבוהה',
            openMedium: 'פתוח / עדיפות בינונית',
            openLow: 'פתוח / עדיפות נמוכה',
            openTbd: 'פתוח / עדיפות לקבוע',
            openUnknown: 'פתוח / עדיפות לא ידועה'
        }
    },
    pagination: {
        previous: 'הקודם',
        next: 'הבא'
    }
};

export default heb;