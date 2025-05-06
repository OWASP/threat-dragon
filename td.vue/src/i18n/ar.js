const ara = {
    auth: {
        sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى للمتابعة.'
    },
    operator: {
        operatedby: 'يتم تشغيل هذا الموقع ونسخة OWASP Threat Dragon بواسطة:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'مشغل هذا الموقع'}`,
        contact: 'للاتصال: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(لم يتم تقديم معلومات الاتصال)'),
    },
    tos: {
        title: 'شروط الخدمة',
        lastUpdated: '4 أبريل 2025',
        introduction: 'مرحبًا بك في نسختنا من OWASP Threat Dragon. تحكم شروط الاستخدام هذه ("الشروط") وصولك إلى واستخدامك لهذا الموقع، وهو نسخة من تطبيق ويب مفتوح المصدر متاح بواسطة المشغل المذكور أعلاه ("المشغل").',
        sections: [
            {
                heading: '1. قبول الشروط',
                content: 'من خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على هذه الشروط، فيرجى عدم استخدام هذا الموقع.'
            },
            {
                heading: '2. استخدام الموقع',
                content: 'يمكنك استخدام الموقع للأغراض القانونية فقط. أنت توافق على عدم إساءة استخدام أو تعطيل أو محاولة الوصول غير المصرح به إلى الموقع أو أنظمته الأساسية.'
            },
            {
                heading: '3. لا ضمان',
                content: 'يتم توفير الموقع "كما هو" دون أي ضمانات من أي نوع، صريحة أو ضمنية، بما في ذلك على سبيل المثال لا الحصر الملاءمة لغرض معين أو التوفر أو الدقة. نحن لا نضمن التشغيل المستمر أو الخالي من الأخطاء.'
            },
            {
                heading: '4. تحديد المسؤولية',
                content: 'إلى أقصى حد يسمح به القانون، لن يكون المشغل مسؤولاً عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية ناشئة عن استخدامك أو عدم قدرتك على استخدام الموقع.'
            },
            {
                heading: '5. برامج مفتوحة المصدر',
                content: 'يعمل هذا الموقع ببرنامج OWASP Threat Dragon، ورمز المصدر الخاص به متاح على https://www.github.com/OWASP/threat-dragon. يخضع استخدامك للبرنامج لشروط ترخيصه مفتوح المصدر. نحن لسنا مسؤولين عن البرنامج نفسه، فقط عن تشغيل هذه النسخة. مشغل هذا الموقع غير منتسب إلى OWASP.'
            },
            {
                heading: '6. تغييرات في الشروط',
                content: 'قد يقوم المشغل بتحديث هذه الشروط في أي وقت. استمرار استخدام الموقع بعد التغييرات يشكل قبولًا للشروط المحدثة.'
            },
            {
                heading: '7. الإنهاء',
                content: 'يحتفظ المشغل بالحق في تعليق أو إنهاء الوصول إلى الموقع وفقًا لتقديره، دون إشعار، لأي سبب من الأسباب.'
            },
            {
                heading: '8. القانون الحاكم',
                content: 'تخضع هذه الشروط لقوانين الولاية القضائية التي يقع فيها المقر الرئيسي للمشغل (في حالة المنظمة) أو يقيم فيها (في حالة الفرد)، دون اعتبار لمبادئ تنازع القوانين.'
            }
        ],
        contact: 'إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بمشغل الموقع.'
    },
    privacy: {
        title: 'سياسة الخصوصية',
        lastUpdated: '4 أبريل 2025',
        introduction: 'يلتزم مشغل هذا الموقع بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية التعامل مع معلوماتك.',
        sections: [
            {
                heading: 'الحد الأدنى من استخدام البيانات للعمليات',
                content: 'لا يقوم المشغل بجمع أو تخزين أو معالجة البيانات الشخصية من المستخدمين للتتبع أو التنميط أو المشاركة مع أطراف ثالثة. يتم إنشاء سجلات مؤقتة، والتي قد تتضمن عناوين IP أو أسماء المستخدمين، فقط لأغراض التشغيل وتصحيح الأخطاء. يتم التخلص من هذه السجلات في غضون فترة زمنية قصيرة ولا يتم الاحتفاظ بها أو استخدامها بما يتجاوز هذه الأغراض المحدودة.'
            },
            {
                heading: 'الامتثال القانوني',
                content: 'سيكشف المشغل عن المعلومات فقط إذا كان مطلوبًا بموجب القانون، مثل الاستجابة لأمر حكومي صالح أو استدعاء. في مثل هذه الحالات، سيمتثل المشغل للالتزامات القانونية المعمول بها.'
            },
            {
                heading: 'التغييرات في هذه السياسة',
                content: 'قد يقوم المشغل بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ "آخر تحديث" محدث.'
            },
            {
                heading: 'اتصل بنا',
                content: 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بمشغل الموقع.'
            }
        ]
    },
    nav: {
        v2Warning:
            'نماذج التهديد الإصدار 2.0 غير متوافقة مع الإصدارات السابقة مع نماذج Threat Dragon للإصدار x.1 من ستتم ترقية نماذج الإصدار x.1 المستوردة إلى مخطط الإصدار 2.0،',
        loggedInAs: 'تم تسجيل الدخول كـ ',
        logOut: 'تسجيل الخروج',
        tos: 'شروط الخدمة',
        privacy: 'سياسة الخصوصية'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'شعار Threat Dragon',
        description:
            'OWASP Threat Dragon هو تطبيق مجاني ومفتوح المصدر ومتعدد المنصات لإنشاء نماذج التهديدات. استخدمه لرسم مخططات نمذجة التهديدات وتحديد التهديدات لنظامك. مع التركيز على المرونة والبساطة، فهو سهل الاستخدام لجميع أنواع المستخدمين.'
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
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'فتح',
            description: 'حدد ملف نموذج تهديد أو مجلد وجهة من Google Drive',
            saveThreatModel: 'حفظ نموذج التهديد في Google Drive',
            saveDescription: 'حدد مجلدًا في Google Drive لحفظ نموذج التهديد الخاص بك',
            fileName: 'اسم الملف',
            fileNamePlaceholder: 'أدخل اسمًا لملفك',
            selectFolder: 'حدد مجلدًا في Google Drive',
            selectFile: 'حدد ملفًا من Google Drive',
            selectThreatModel: 'حدد نموذج تهديد من Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'مرحبًا!',
            description:
                'أنت مستعد الآن للبدء في تعزيز أمان تصميمات تطبيقك. يمكنك فتح نموذج تهديد موجود أو إنشاء نموذج جديد عن طريق إحدى الخيارات أدناه.'
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
            check: 'التحقق من وجود تحديثات ...',
            about: {
                about: 'حول',
                version: 'الإصدار'
            }
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
        or: 'أو',
        chooseRepo: 'اختيار مستودع آخر',
        protectedBranch: 'فرع محمي',
        nameRequired: 'اسم الفرع مطلوب',
        nameExists: 'اسم الفرع موجود بالفعل',
        refBranch: 'الفرع المرجعي',
        addNew: 'إضافة فرع جديد',
        add: 'إضافة فرع',
        cancel: 'إلغاء',
        name: 'اسم الفرع'
    },
    folder: {
        select: 'حدد',
        from: 'مجلد من القائمة أدناه',
        noneFound: 'هذا المجلد فارغ. يمكنك إنشاء نموذج تهديد جديد هنا.'
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
        dragAndDrop: 'السحب والإفلات أو',        jsonPaste: 'اسحب ملف JSON لنموذج التهديد أو لصق محتواه هنا:',
        owner: 'المالك',
        reviewer: 'المراجع',
        title: 'العنوان',
        new: {
            title: 'إنشاء نموذج تهديد جديد',
            description: 'أدخل معلومات حول نموذج التهديد الجديد الخاص بك'
        },
        placeholder: {
            title: 'عنوان نموذج التهديد',
            owner: 'اسم المالك أو الفريق',
            description: 'أدخل وصفًا عالي المستوى للنظام الذي يتم نمذجته',
            reviewer: 'اسم المراجع'
        },
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
            googleDriveSave:
                'حدث خطأ أثناء الحفظ في Google Drive. تأكد من أن لديك الأذونات المناسبة.'
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
        controlButtons: {
            delete: 'حذف المحدد',
            redo: 'إعادة القيام بالتحرير',
            shortcuts: 'اختصارات لوحة المفاتيح',
            toggleGrid: 'تبديل الشبكة',
            undo: 'تراجع عن التحرير',
            zoomIn: 'تكبير',
            zoomOut: 'تصغير',
            save: 'حفظ'
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
                action: 'حفظ'
            }
        },
        stencil: {
            title: 'الأشكال',
            boundaries: 'الحدود',
            components: 'المكونات',
            entities: 'الكيانات',
            metadata: 'البيانات الوصفية',
            search: 'البحث عن الأشكال',
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
        export: 'تصدير',
        exportAs: 'تصدير النموذج كـ',
        exportHtml: 'تقرير HTML',
        exportPdf: 'تقرير PDF',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        exportFormats: {
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG'
        },
        import: 'استيراد',
        ok: 'موافق',
        open: 'فتح',
        openModel: 'فتح النموذج',
        print: 'طباعة',
        reload: 'إعادة تحميل',
        remove: 'إزالة',
        report: 'تقرير',
        save: 'حفظ',
        saveAs: 'حفظ كـ',
        saveModel: 'حفظ النموذج',
        saveModelAs: 'حفظ النموذج كـ',
        search: 'بحث',
        next: 'التالي',
        previous: 'السابق',
        requiredField: 'حقل مطلوب'
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
            tbd: 'سيتم الإعلان عنها',
            low: 'منخفض',
            medium: 'متوسط',
            high: 'عالي',
            critical: 'شديد الأهمية'
        }
    },
    report: {
        options: {
            showOutOfScope: 'إظهار العناصر خارج النطاق',
            showMitigatedThreats: 'إظهار التهديدات المُخففة',
            showModelDiagrams: 'إظهار الرسوم التوضيحية للنموذج',
            showEmpty: 'إظهار العناصر الفارغة',
            showProperties: 'إظهار خصائص العنصر',
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
            openCritical: 'مفتوح / الأولوية الحرجة',
            openHigh: 'مفتوح / أولوية عالية',
            openMedium: 'مفتوح / أولوية متوسطة',
            openLow: 'مفتوح / أولوية منخفضة',
            openTbd: 'مفتوح / الأولوية في TBD',
            openUnknown: 'مفتوح / أولوية غير معروفة'
        }
    },
    pagination: {
        previous: 'السابق',
        next: 'التالي'
    }
};

export default ara;
