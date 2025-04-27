const ukr = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    operator: {
        heading: 'Оператор',
        operatedby: 'Цей веб-сайт та екземпляр OWASP Threat Dragon керується:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'оператором цього веб-сайту'}`,
        contact: 'Контакт: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(контактна інформація не надана)'),
    },
    tos: {
        title: 'Умови використання',
        lastUpdated: '4 квітня 2025',
        introduction: 'Ласкаво просимо до нашого екземпляру OWASP Threat Dragon. Ці Умови використання ("Умови") регулюють ваш доступ та використання цього веб-сайту, який є екземпляром веб-додатку з відкритим кодом, що надається оператором, зазначеним вище ("Оператор").',
        sections: [
            {
                heading: '1. Прийняття умов',
                content: 'Отримуючи доступ та використовуючи цей веб-сайт, ви приймаєте та погоджуєтеся дотримуватися положень цієї угоди. Якщо ви не згодні з цими умовами, будь ласка, не використовуйте цей веб-сайт.'
            },
            {
                heading: '2. Використання веб-сайту',
                content: 'Ви можете використовувати веб-сайт лише в законних цілях. Ви погоджуєтеся не зловживати, не порушувати або не намагатися отримати несанкціонований доступ до веб-сайту або його базових систем.'
            },
            {
                heading: '3. Відсутність гарантій',
                content: 'Веб-сайт надається "як є" без будь-яких гарантій, явних або неявних, включаючи, але не обмежуючись, придатність для певної мети, доступність або точність. Ми не гарантуємо безперебійну або безпомилкову роботу.'
            },
            {
                heading: '4. Обмеження відповідальності',
                content: 'У максимальній мірі, дозволеній законом, Оператор не несе відповідальності за будь-які прямі, непрямі, випадкові або непрямі збитки, що виникають в результаті використання або неможливості використання веб-сайту.'
            },
            {
                heading: '5. Програмне забезпечення з відкритим кодом',
                content: 'Цей веб-сайт працює на програмному забезпеченні OWASP Threat Dragon, вихідний код якого доступний за адресою https://www.github.com/OWASP/threat-dragon. Ваше використання програмного забезпечення регулюється умовами його ліцензії з відкритим кодом. Ми не несемо відповідальності за саме програмне забезпечення, лише за роботу цього екземпляра. Оператор цього веб-сайту не пов\'язаний з OWASP.'
            },
            {
                heading: '6. Зміни умов',
                content: 'Оператор може оновлювати ці Умови в будь-який час. Продовження використання веб-сайту після змін означає прийняття оновлених Умов.'
            },
            {
                heading: '7. Припинення',
                content: 'Оператор залишає за собою право призупинити або припинити доступ до веб-сайту на свій розсуд, без повідомлення, з будь-якої причини.'
            },
            {
                heading: '8. Застосовне право',
                content: 'Ці Умови регулюються законами юрисдикції, в якій знаходиться штаб-квартира Оператора (у випадку організації) або проживає (у випадку фізичної особи), без урахування принципів колізійного права.'
            }
        ],
        contact: 'Якщо у вас є питання щодо цих Умов, будь ласка, зв\'яжіться з оператором.'
    },
    privacy: {
        title: 'Політика конфіденційності',
        lastUpdated: '4 квітня 2025',
        introduction: 'Оператор цього веб-сайту прагне захистити вашу конфіденційність. Ця Політика конфіденційності пояснює, як обробляється ваша інформація.',
        sections: [
            {
                heading: 'Мінімальне використання даних для операцій',
                content: 'Оператор не збирає, не зберігає та не обробляє персональні дані користувачів для відстеження, профілювання або передачі третім особам. Тимчасові журнали, які можуть включати IP-адреси або імена користувачів, створюються виключно для операційних та налагоджувальних цілей. Ці журнали видаляються протягом короткого періоду часу і не зберігаються та не використовуються за межами цих обмежених цілей.'
            },
            {
                heading: 'Дотримання законодавства',
                content: 'Оператор розкриватиме інформацію лише у випадках, передбачених законом, наприклад, у відповідь на дійсний урядовий наказ або повістку. У таких випадках Оператор дотримуватиметься застосовних юридичних зобов\'язань.'
            },
            {
                heading: 'Зміни в цій політиці',
                content: 'Оператор може час від часу оновлювати цю Політику конфіденційності. Будь-які зміни будуть опубліковані на цій сторінці з оновленою датою "Останнє оновлення".'
            },
            {
                heading: 'Зв\'яжіться з нами',
                content: 'Якщо у вас є питання щодо цієї Політики конфіденційності, будь ласка, зв\'яжіться з оператором.'
            }
        ]
    },
    nav: {
        v2Warning:
            'Моделі загроз версії 2.0 не сумісні з моделями Threat Dragon версії 1.x. Імпортовані моделі версії 1.x будуть оновлені до схеми версії 2.0',
        loggedInAs: 'Ви увійшли як',
        logOut: 'Вийти',
        tos: 'Умови використання',
        privacy: 'Політика конфіденційності'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Логотип Threat Dragon',
        description:
            'OWASP Threat Dragon - це безкоштовний, з відкритим кодом, кросплатформний додаток для створення моделей загроз. Використовуйте його для малювання діаграм моделювання загроз та для виявлення загроз для вашої системи. З акцентом на гнучкість та простоту, він легко доступний для всіх типів користувачів.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Почати'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Увійти за допомогою'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Увійти за допомогою'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Увійти за допомогою'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Увійти за допомогою'
        },
        local: {
            displayName: 'Локальна сесія',
            loginWith: 'Увійти в'
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'Відкрити',
            description: 'Виберіть файл моделі загроз або цільову папку з Google Drive',
            saveThreatModel: 'Зберегти модель загроз у Google Drive',
            saveDescription: 'Виберіть папку в Google Drive для збереження вашої моделі загроз',
            fileName: 'Ім\'я файлу',
            fileNamePlaceholder: 'Введіть ім\'я для вашого файлу',
            selectFolder: 'Виберіть папку в Google Drive',
            selectFile: 'Виберіть файл з Google Drive',
            selectThreatModel: 'Виберіть модель загроз з Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'Ласкаво просимо!',
            description:
                'Ви готові почати робити дизайн вашого додатку більш безпечним. Ви можете відкрити існуючу модель загроз або створити нову, вибравши один із варіантів нижче.'
        },
        actions: {
            openExisting: 'Відкрити існуючу модель загроз',
            createNew: 'Створити нову, порожню модель загроз',
            readDemo: 'Вивчити приклад моделі загроз',
            importExisting: 'Імпортувати модель загроз через JSON'
        }
    },
    demo: {
        select: 'Виберіть демонстраційну модель загроз зі списку нижче'
    },
    desktop: {
        file: {
            heading: 'Файл',
            clearRecentDocs: 'Очистити меню',
            close: 'Закрити модель',
            closeWindow: 'Закрити вікно',
            new: 'Нова модель',
            open: 'Відкрити модель',
            recentDocs: 'Відкрити нещодавні',
            save: 'Зберегти модель',
            saveAs: 'Зберегти модель як'
        },
        help: {
            heading: 'Допомога',
            docs: 'Документація',
            visit: 'Відвідайте нас на OWASP',
            sheets: 'Шпаргалки OWASP',
            github: 'Відвідайте нас на GitHub',
            submit: 'Надіслати проблему',
            check: 'Перевірити оновлення...'
        }
    },
    repository: {
        select: 'Виберіть',
        from: 'репозиторій зі списку нижче',
        noneFound: 'Репозиторії не знайдено. Щоб почати, створіть новий репозиторій на'
    },
    branch: {
        select: 'Виберіть гілку з',
        from: 'зі списку нижче або',
        chooseRepo: 'виберіть інший репозиторій',
        or: 'або',
        addNew: 'додайте нову гілку',
        protectedBranch: 'Захищена гілка',
        nameRequired: 'Ім\'я гілки обов\'язкове',
        nameExists: 'Ім\'я гілки вже існує',
        refBranch: 'Посилальна гілка',
        add: 'додати гілку',
        cancel: 'Скасувати',
        name: 'ім\'я гілки'
    },
    folder: {
        select: 'Виберіть',
        from: 'папку зі списку нижче',
        noneFound: 'Ця папка порожня. Ви можете створити нову модель загроз тут.'
    },
    threatmodelSelect: {
        select: 'Виберіть модель загроз з',
        from: 'зі списку нижче, або виберіть іншу',
        branch: 'гілку',
        or: 'або',
        repo: 'репозиторій',
        newThreatModel: 'Створити нову модель загроз'
    },
    threatmodel: {
        contributors: 'Учасники',
        contributorsPlaceholder: 'Почніть вводити, щоб додати учасника',
        description: 'Опис системи високого рівня',
        dragAndDrop: 'Перетягніть або ',
        jsonPaste: 'Перетягніть файл JSON моделі загроз або вставте його вміст тут:',
        owner: 'Власник',
        reviewer: 'Рецензент',
        title: 'Заголовок',
        diagram: {
            diagrams: 'Діаграми',
            addNewDiagram: 'Додати нову діаграму...',
            generic: {
                defaultTitle: 'Нова загальна діаграма',
                defaultDescription: 'Опис нової загальної діаграми',
                select: 'Загальна'
            },
            stride: {
                defaultTitle: 'Нова діаграма STRIDE',
                defaultDescription: 'Опис нової діаграми STRIDE',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Нова діаграма LINDDUN',
                defaultDescription: 'Опис нової діаграми LINDDUN',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Нова діаграма PLOT4ai',
                defaultDescription: 'Опис нової діаграми PLOT4ai',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Нова діаграма DIE',
                defaultDescription: 'Опис нової діаграми DIE',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Нова діаграма CIA',
                defaultDescription: 'Опис нової діаграми CIA',
                select: 'CIA'
            }
        },
        threats: 'Загрози',
        errors: {
            dropSingleFileOnly: 'Для перетягування потрібен один файл.',
            invalidJson: 'Недійсний JSON. Будь ласка, перевірте вашу модель і спробуйте знову.',
            onlyJsonAllowed: 'Підтримуються лише файли з розширенням .json.',
            open: 'Помилка відкриття цієї моделі загроз. Перевірте консоль розробника для отримання додаткової інформації',
            save: 'Помилка збереження моделі загроз. Перевірте консоль розробника для отримання додаткової інформації',
            googleDriveSave: 'Помилка збереження в Google Drive. Переконайтеся, що у вас є відповідні дозволи.'
        },
        opened: 'Модель загроз успішно відкрита',
        saved: 'Модель загроз успішно збережена',
        properties: {
            title: 'Властивості',
            emptyState: 'Виберіть елемент на графіку для редагування',
            name: 'Ім\'я',
            text: 'Текст',
            description: 'Опис',
            outOfScope: 'Поза областю',
            bidirection: 'Двонаправлений',
            reasonOutOfScope: 'Причина знаходження поза областю',
            handlesCardPayment: 'Картковий платіж',
            handlesGoodsOrServices: 'Товари або послуги',
            isALog: 'Є журналом',
            isEncrypted: 'Зашифровано',
            isSigned: 'Підписано',
            isWebApplication: 'Веб-додаток',
            privilegeLevel: 'Рівень привілеїв',
            providesAuthentication: 'Надає автентифікацію',
            protocol: 'Протокол',
            publicNetwork: 'Публічна мережа',
            storesCredentials: 'Зберігає облікові дані',
            storesInventory: 'Зберігає інвентар'
        },
        controlButtons: {
            delete: 'Видалити вибране',
            redo: 'Повторити редагування',
            shortcuts: 'Комбінації клавіш',
            toggleGrid: 'Переключити сітку',
            undo: 'Скасувати редагування',
            zoomIn: 'Збільшити',
            zoomOut: 'Зменшити',
            save: 'Зберегти'
        },
        shortcuts: {
            title: 'Комбінації клавіш',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Копіювати'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Вставити'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Скасувати'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Повторити'
            },
            delete: {
                shortcut: 'del',
                action: 'Видалити'
            },
            pan: {
                shortcut: 'shift + лівий клік (утримувати/перетягувати)',
                action: 'Панорамування'
            },
            multiSelect: {
                shortcut: 'лівий клік на порожньому місці і перетягування',
                action: 'Множинний вибір'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + колесо миші',
                action: 'Масштабування'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Зберегти'
            }
        },
        stencil: {
            title: 'Форми',
            boundaries: 'Межі',
            components: 'Компоненти',
            entities: 'Сутності',
            metadata: 'Метадані',
            search: 'Пошук форм',
            notFound: 'У нас цього ще немає, хочете відкрити проблему? :)'
        },
        shapes: {
            actor: 'Актор',
            flow: 'Потік даних',
            flowStencil: 'Потік даних',
            process: 'Процес',
            store: 'Сховище',
            text: 'Описовий текст',
            trustBoundary: 'Межа довіри'
        }
    },
    forms: {
        apply: 'Застосувати',
        cancel: 'Скасувати',
        close: 'Закрити',
        closeModel: 'Закрити модель',
        create: 'Створити',
        delete: 'Видалити',
        discardTitle: 'Скасувати зміни?',
        discardMessage: 'Ви впевнені, що хочете скасувати свої зміни?',
        edit: 'Редагувати',
        export: 'Експорт',
        exportAs: 'Експортувати модель як',
        exportHtml: 'HTML звіт',
        exportPdf: 'PDF звіт',
        exportTd: 'Оригінал (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        exportFormats: {
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG'
        },
        import: 'Імпорт',
        ok: 'OK',
        open: 'Відкрити',
        openModel: 'Відкрити модель',
        print: 'Друк',
        reload: 'Перезавантажити',
        remove: 'Видалити',
        report: 'Звіт',
        save: 'Зберегти',
        saveAs: 'Зберегти як',
        saveModel: 'Зберегти модель',
        saveModelAs: 'Зберегти модель як',
        search: 'Пошук',
        next: 'Наступний',
        previous: 'Попередній',
        requiredField: 'Обов\'язкове поле'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Конфіденційність',
                integrity: 'Цілісність',
                availability: 'Доступність'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Розподіленість',
                immutable: 'Незмінність',
                ephemeral: 'Ефемерність'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Зв\'язуваність',
                identifiability: 'Ідентифікованість',
                nonRepudiation: 'Незаперечність',
                detectability: 'Виявленість',
                disclosureOfInformation: 'Розкриття інформації',
                unawareness: 'Необізнаність',
                nonCompliance: 'Невідповідність'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Техніка і процеси',
                accessibility: 'Доступність',
                identifiabilityLinkability: 'Ідентифікованість і зв\'язуваність',
                security: 'Безпека',
                safety: 'Надійність',
                unawareness: 'Необізнаність',
                ethicsHumanRights: 'Етика і права людини',
                nonCompliance: 'Невідповідність'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'Підміна',
                tampering: 'Підробка',
                repudiation: 'Відмова від авторства',
                informationDisclosure: 'Розкриття інформації',
                denialOfService: 'Відмова в обслуговуванні',
                elevationOfPrivilege: 'Підвищення привілеїв'
            }
        },
        generic: {
            default: 'Нова загальна загроза',
            cia: 'Нова загроза CIA',
            die: 'Нова загроза DIE',
            linddun: 'Нова загроза LINDDUN',
            plot4ai: 'Нова загроза PLOT4ai',
            stride: 'Нова загроза STRIDE'
        },
        new: 'Нова загроза',
        edit: 'Редагувати загрозу',
        confirmDeleteTitle: 'Підтвердити видалення',
        confirmDeleteMessage: 'Ви впевнені, що дійсно хочете видалити цю загрозу?',
        description: 'Надайте опис для цієї загрози',
        emptyThreat: 'Виберіть елемент на графіку, щоб додати загрозу',
        mitigation: 'Надайте заходи щодо усунення цієї загрози або причину, якщо статус N/A',
        newThreat: 'Нова загроза',
        newThreatByType: 'Нова загроза за типом',
        newThreatByContext: 'Нова загроза за контекстом',
        properties: {
            description: 'Опис',
            mitigation: 'Заходи щодо усунення',
            modelType: 'Тип моделі',
            number: 'Номер',
            priority: 'Пріоритет',
            score: 'Оцінка',
            status: 'Статус',
            title: 'Заголовок',
            type: 'Тип'
        },
        status: {
            notApplicable: 'Н/Д',
            open: 'Відкрито',
            mitigated: 'Усунено'
        },
        priority: {
            tbd: 'Не визначено',
            low: 'Низький',
            medium: 'Середній',
            high: 'Високий',
            critical: 'Критичний'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Показати елементи поза областю',
            showMitigatedThreats: 'Показати усунені загрози',
            showModelDiagrams: 'Показати діаграми моделі',
            showEmpty: 'Показати порожні елементи',
            showProperties: 'Показати властивості елементів',
            showBranding: 'Логотип Threat Dragon'
        },
        title: 'Звіт моделі загроз для',
        dateGenerated: 'Дата створення',
        executiveSummary: 'Короткий зміст',
        notProvided: 'Не надано',
        summary: 'Підсумок',
        threatStats: {
            total: 'Всього загроз',
            mitigated: 'Всього усунено',
            notMitigated: 'Не усунено',
            openCritical: 'Відкрито / Критичний пріоритет',
            openHigh: 'Відкрито / Високий пріоритет',
            openMedium: 'Відкрито / Середній пріоритет',
            openLow: 'Відкрито / Низький пріоритет',
            openTbd: 'Відкрито / Невизначений пріоритет',
            openUnknown: 'Відкрито / Невідомий пріоритет'
        }
    },
    pagination: {
        previous: 'Попередній',
        next: 'Наступний'
    }
};

export default ukr;
