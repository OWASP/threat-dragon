const ara = {
    auth: {
        sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى للمتابعة.'
    },
    nav: {
        v2Warning: 'نماذج التهديد الإصدار 2.0 غير متوافقة مع الإصدارات السابقة مع نماذج Threat Dragon للإصدار x.1 من ستتم ترقية نماذج الإصدار x.1 المستوردة إلى مخطط الإصدار 2.0،',
        loggedInAs: 'تم تسجيل الدخول كـ ',
        logOut: 'Log out'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'شعار Threat Dragon',
        description: 'OWASP Threat Dragon هو تطبيق مجاني ومفتوح المصدر وقابل للتشغيل على مختلف الأنظمة لإنشاء نماذج تهديد. استخدمه لرسم مخططات تهديد وتحديد التهديدات لنظامك. مع التركيز على المرونة والبساطة ، يُعد سهل الوصول لجميع أنواع المستخدمين.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'ابدأ'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'تسجيل الدخول باستخدام'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'تسجيل الدخول باستخدام'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'تسجيل الدخول باستخدام'
        },
        google: {
            displayName: 'Google',
            loginWith: 'تسجيل الدخول باستخدام'
        },
        local: {
            displayName: 'جلسة محلية',
            loginWith: 'تسجيل الدخول إلى'
        }
    },
    dashboard: {
        welcome: {
            title: 'مرحبًا!',
            description: 'أنت مستعد الآن للبدء في تعزيز أمان تصميمات تطبيقك. يمكنك فتح نموذج تهديد موجود أو إنشاء نموذج جديد عن طريق إحدى الخيارات أدناه.'
        },
        actions: {
            openExisting: 'فتح نموذج تهديد موجود',
            createNew: 'إنشاء نموذج تهديد جديد فارغ',
            readDemo: 'استكشاف نموذج تهديد تجريبي',
            importExisting: 'استيراد نموذج التهديد بصيغة  JSON'
        }
    },
    demo: {
        select: 'حدد نموذج تهديد تجريبي من القائمة أدناه'
    },
    desktop: {
        file: {
            heading: 'ملف',
            clearRecentDocs: 'مسح القائمة',
            close: 'إغلاق النموذج',
            closeWindow: 'إغلاق النافذة',
            new: 'نموذج جديد',
            open: 'فتح نموذج',
            recentDocs: 'المستندات الأخيرة المفتوحة',
            save: 'حفظ النموذج',
            saveAs: 'حفظ النموذج كـ '
        },
        help: {
            heading: 'مساعدة',
            docs: 'التوثيق',
            visit: 'زيارتنا على OWASP',
            sheets: 'أوراق الغش OWASP',
            github: 'زيارتنا على GitHub',
            submit: 'تقديم مشكلة',
            check: 'التحقق من وجود تحديثات ...'
        }
    },
    repository: {
        select: 'حدد',
        from: 'مستودع من القائمة أدناه',
        noneFound: 'لم يتم العثور على مستودعات. للبدء ، أنشئ مستودعًا جديدًا على'
    },
    branch: {
        select: 'حدد فرعًا من',
        from: 'من القائمة أدناه أو',
        chooseRepo: 'اختيار مستودع آخر'
    },
    threatmodelSelect: {
        select: 'حدد نموذج تهديد من',
        from: 'من القائمة أدناه ، أو اختر آخر',
        branch: 'فرع',
        or: 'أو',
        repo: 'مستودع',
        newThreatModel: 'إنشاء نموذج تهديد جديد'
    },
    threatmodel: {
        contributors: 'المساهمون',
        contributorsPlaceholder: 'ابدأ الكتابة لإضافة مساهم',
        description: 'وصف مجرد وعام للنظام (وصف عالي المستوى)',
        dragAndDrop: 'السحب والإفلات أو',
        editing: 'تحرير',
        jsonPaste: 'اسحب ملف JSON لنموذج التهديد أو لصق محتواه هنا:',
        owner: 'المالك',
        reviewer: 'المراجع',
        title: 'العنوان',
        diagram: {
            diagrams: 'المخططات',
            addNewDiagram: 'إضافة مخطط جديد...',
            generic: {
                defaultTitle: 'مخطط جديد عام',
                defaultDescription: 'وصف مخطط جديد عام',
                select: 'عام'
            },
            stride: {
                defaultTitle: 'مخطط STRIDE جديد',
                defaultDescription: 'وصف مخطط STRIDE جديد',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'مخطط LINDDUN جديد',
                defaultDescription: 'وصف مخطط LINDDUN جديد',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'مخطط PLOT4ai جديد',
                defaultDescription: 'وصف مخطط PLOT4ai جديد',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'مخطط DIE جديد',
                defaultDescription: 'وصف مخطط DIE جديد',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'مخطط CIA جديد',
                defaultDescription: 'وصف مخطط CIA جديد',
                select: 'CIA'
            }
        },
        threats: 'التهديدات',
        errors: {
            dropSingleFileOnly: 'يتطلب السحب والإفلات ملفاً واحداً فقط.',
            invalidJson: 'ملف JSON غير صالح. يرجى التحقق من النموذج الخاص بك والمحاولة مرة أخرى.',
            onlyJsonAllowed: 'الملفات التي يمكن التعامل معها هي التي تنتهي بامتداد .json فقط.',
            open: 'حدث خطأ في فتح نموذج التهديد. تحقق من الـ console الخاص بالمطور (developer console) للحصول على مزيد من المعلومات',
            save: 'حدث خطأ في حفظ نموذج التهديد. تحقق من الـ console الخاص بالمطور (developer console) للحصول على مزيد من المعلومات',
        },
        opened: 'تم فتح نموذج التهديد بنجاح',
        saved: 'تم حفظ نموذج التهديد بنجاح',
        properties: {
            title: 'الخصائص',
            emptyState: 'حدد عنصرًا على الرسم البياني للتحرير',
            name: 'الاسم',
            text: 'النص',
            description: 'الوصف',
            outOfScope: 'خارج نطاق العمل',
            bidirection: 'ثنائي الاتجاه',
            reasonOutOfScope: 'سبب خارج نطاق العمل',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'هل هو سجل',
            isEncrypted: 'هل هو مشفر',
            isSigned: 'هل هو موقع signed',
            isWebApplication: 'Web Application',
            privilegeLevel: 'مستوى الامتياز',
            providesAuthentication: 'يوفر المصادقة',
            protocol: 'بروتوكول',
            publicNetwork: 'شبكة عامة',
            storesCredentials: 'تخزين بيانات الاعتماد credentials',
            storesInventory: 'Stores Inventory'
        },
        buttons: {
            delete: 'حذف المحدد',
            redo: 'إعادة القيام بالتحرير',
            shortcuts: 'اختصارات لوحة المفاتيح',
            toggleGrid: 'تبديل الشبكة',
            undo: 'تراجع عن التحرير',
            zoomIn: 'تكبير',
            zoomOut: 'تصغير'
        },
        shortcuts: {
            title: 'اختصارات لوحة المفاتيح',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'نسخ'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'لصق'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'تراجع'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'إعادة'
            },
            delete: {
                shortcut: 'del',
                action: 'حذف'
            },
            pan: {
                shortcut: 'shift + نقرة يسار (تثبيت / سحب)',
                action: 'تمرير'
            },
            multiSelect: {
                shortcut: 'نقر يسار فوق مساحة فارغة وسحب',
                action: 'تحديد متعدد'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + عجلة الماوس',
                action: 'تكبير/تصغير'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'الحدود',
            components: 'المكونات',
            entities: 'الكيانات',
            metadata: 'البيانات الوصفية',
            search: 'البحث',
            notFound: 'ليس لدينا ذلك حتى الآن، هل تريد فتح مشكلة؟ :)'
        },
        shapes: {
            actor: 'الممثل',
            flow: 'تدفق البيانات',
            flowStencil: 'تدفق البيانات',
            process: 'العملية',
            store: 'التخزين',
            text: 'نص وصفي',
            trustBoundary: 'حد الثقة'
        }
    },
    forms: {
        apply: 'تطبيق',
        cancel: 'إلغاء',
        close: 'إغلاق',
        closeModel: 'إغلاق النموذج',
        delete: 'حذف',
        discardTitle: 'هل تريد تجاهل التغييرات؟',
        discardMessage: 'هل أنت متأكد من رغبتك في تجاهل التغييرات الخاصة بك؟',
        edit: 'تحرير',
        exportAs: 'Export Model As',
        exportHtml: 'تقرير HTML',
        exportPdf: 'تقرير PDF',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'استيراد',
        ok: 'موافق',
        open: 'فتح',
        openModel: 'فتح النموذج',
        print: 'طباعة',
        reload: 'إعادة تحميل',
        remove: 'إزالة',
        report: 'تقرير',
        save: 'حفظ',
        savetd: 'تنسيق Threat Dragon',
        saveotm: 'تنسيق OTM',
        saveAs: 'حفظ كـ',
        saveModel: 'حفظ النموذج',
        saveModelAs: 'حفظ النموذج كـ',
        search: 'بحث',
        next: 'التالي',
        previous: 'السابق'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentiality السرية',
                integrity: 'Integrity النزاهة',
                availability: 'Availability التوفر'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distributed موزع',
                immutable: 'Immutable لا يمكن تغييره',
                ephemeral: 'Ephemeral زائل'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Linkability القابلية للربط',
                identifiability: 'Identifiability التعرف',
                nonRepudiation: 'Non-repudiation عدم الإنكار',
                detectability: 'Detectability الكشف',
                disclosureOfInformation: 'Disclosure of information كشف المعلومات',
                unawareness: 'Unawareness عدم الوعي',
                nonCompliance: 'Non-compliance عدم الامتثال'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Technique & Processes تقنية وعمليات',
                accessibility: 'Accessibility التوفر',
                identifiabilityLinkability: 'Identifiability & Linkability التعرف والربط',
                security: 'Security الأمان',
                safety: 'Safety السلامة',
                unawareness: 'Unawareness عدم الوعي',
                ethicsHumanRights: 'Ethics & Human Rights الأخلاق وحقوق الإنسان',
                nonCompliance: 'Non-compliance عدم الامتثال'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'Spoofing التزييف',
                tampering: 'Tampering التلاعب',
                repudiation: 'Repudiation رفض',
                informationDisclosure: 'Information disclosure كشف المعلومات',
                denialOfService: 'Denial of service إنكار الخدمة',
                elevationOfPrivilege: 'Elevation of privilege تسلق الامتياز'
            }
        },
        generic: {
            default: 'تهديد عام جديد',
            cia: 'تهديد CIA جديد',
            die: 'تهديد DIE جديد',
            linddun: 'تهديد LINDDUN جديد',
            plot4ai: 'تهديد PLOT4ai جديد',
            stride: 'تهديد STRIDE جديد'
        },
        edit: 'تحرير التهديد',
        confirmDeleteTitle: 'تأكيد الحذف',
        confirmDeleteMessage: 'هل أنت متأكد من حذف هذا التهديد؟',
        description: 'اكتب وصفًا لهذا التهديد',
        emptyThreat: 'حدد عنصرًا على الرسم البياني لإضافة تهديد',
        mitigation: 'اكتب طرق مواجهة وتخفيف هذا التهديد أو السبب إذا كانت الحالة N/A',
        newThreat: 'تهديد جديد',
        newThreatByType: 'تهديد جديد حسب النوع',
        newThreatByContext: 'تهديد جديد حسب السياق',
        properties: {
            description: 'الوصف',
            mitigation: 'التخفيف',
            modelType: 'نوع النموذج',
            number: 'الرقم',
            priority: 'الأولوية',
            score: 'النقاط',
            status: 'الحالة',
            title: 'العنوان',
            type: 'النوع'
        },
        status: {
            notApplicable: 'غير قابل للتطبيق',
            open: 'مفتوح',
            mitigated: 'تم التخفيف'
        },
        priority: {
            low: 'منخفض',
            medium: 'متوسط',
            high: 'عالي'
        }
    },
    report: {
        options: {
            showOutOfScope: 'إظهار العناصر خارج النطاق',
            showMitigatedThreats: 'إظهار التهديدات المُخففة',
            showModelDiagrams: 'إظهار الرسوم التوضيحية للنموذج',
            showEmpty: 'إظهار العناصر الفارغة',
            showBranding: 'شعار تهديد التنين'
        },
        title: 'تقرير نموذج التهديد لـ',
        dateGenerated: 'تاريخ الإنشاء',
        executiveSummary: 'ملخص تنفيذي',
        notProvided: 'غير متاح',
        summary: 'ملخص',
        threatStats: {
            total: 'إجمالي التهديدات',
            mitigated: 'الإجمالي المُخفف',
            notMitigated: 'الإجمالي غير المُخفف',
            openHigh: 'مفتوح / أولوية عالية',
            openMedium: 'مفتوح / أولوية متوسطة',
            openLow: 'مفتوح / أولوية منخفضة',
            openUnknown: 'مفتوح / أولوية غير معروفة'
        }
    },
    upgrade: {
        modal: {
            header: 'تحديث نموذج التهديد',
            welcome: 'مرحبًا بك في الإصدار 2 من OWASP Threat Dragon!',
            p1: 'الإصدار 2 يستخدم مكتبة رسم مختلفة، مما سيغير طريقة حفظ بعض أجزاء نماذج التهديد الخاصة بك. على الرغم من أن معظم الرسوم التوضيحية ستبدو كما كانت في الإصدارات السابقة من Threat Dragon، هناك حالات قد تحتاج فيها إلى ضبطها قليلاً.',
            p2: 'بعد إغلاق هذا النموذج، سترى كيف يتم عرض كل رسم تخطيطي في هذا النموذج بتنسيق الإصدار 2. يرجى الانتباه إلى أي مخططات قد تحتاج إلى تعديلها، هذه ترقية تتم لمرة واحدة، ومن المفترض ألا ترى هذه الرسالة مرة أخرى بعد حفظ هذا النموذج.'
        },
        instructions: 'عظيم! دعنا نوصلك إلى النموذج الخاص بك.',
        continue: 'المتابعة إلى نموذج التهديد'
    }
};

export default ara;
