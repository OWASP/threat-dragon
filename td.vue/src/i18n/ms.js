const ms = {
    auth: {
        sessionExpired: 'Sesi anda telah tamat. Sila log masuk semula untuk meneruskan.'
    },
    nav: {
        v2Warning: 'Model ancaman versi 2.0 tidak sesuai dengan model Threat Dragon versi 1.x. Model versi 1.x yang diimport akan dinaik tarafkan ke skema versi 2.0',
        loggedInAs: 'Log masuk sebagai',
        logOut: 'Log keluar'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo Threat Dragon',
        description: 'OWASP Threat Dragon adalah aplikasi percuma, sumber terbuka, lintas platform untuk mencipta model ancaman. Gunakannya untuk melukis gambarajah pemodelan ancaman dan mengenal pasti ancaman bagi sistem anda. Dengan penekanan pada kelenturan dan kesederhanaan, ia mudah diakses untuk semua jenis pengguna.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Mula'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Log masuk dengan'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Log masuk dengan'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Log masuk dengan'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Log masuk dengan'
        },
        local: {
            displayName: 'Sesi Tempatan',
            loginWith: 'Log masuk ke'
        }
    },
    dashboard: {
        welcome: {
            title: 'Selamat Datang!',
            description: 'Anda bersedia untuk memulakan membuat rekabentuk aplikasi anda lebih selamat. Anda boleh membuka model ancaman sedia ada atau membuat yang baru dengan memilih salah satu pilihan di bawah. '
        },
        actions: {
            openExisting: 'Buka model ancaman sedia ada',
            createNew: 'Cipta model ancaman baru yang kosong',
            readDemo: 'Teroka model ancaman contoh',
            importExisting: 'Import model ancaman melalui JSON'
        }
    },
    demo: {
        select: 'Pilih model ancaman demo dari senarai di bawah'
    },
    desktop: {
        file: {
            heading: 'Fail',
            clearRecentDocs: 'Padam Menu',
            close: 'Tutup Model',
            closeWindow: 'Tutup Tetingkap',
            new: 'Model Baharu',
            open: 'Buka Model',
            recentDocs: 'Buka Terkini',
            save: 'Simpan Model',
            saveAs: 'Simpan Model Sebagai'
        },
        help: {
            heading: 'Bantuan',
            docs: 'Dokumentasi',
            visit: 'Lawati kami di OWASP',
            sheets: 'Lembaran Panduan OWASP',
            github: 'Lawati kami di GitHub',
            submit: 'Hantar Isu',
            check: 'Semak kemas kini ...'
        }
    },
    repository: {
        select: 'Pilih',
        from: 'repositori dari senarai di bawah',
        noneFound: 'Tiada repositori dijumpai. Untuk memulakan, cipta repositori baru di'
    },
    branch: {
        select: 'Pilih cawangan dari',
        from: 'dari senarai di bawah atau',
        chooseRepo: 'pilih repo lain'
    },
    threatmodelSelect: {
        select: 'Pilih Model Ancaman dari',
        from: 'dari senarai di bawah, atau pilih yang lain',
        branch: 'cawangan',
        or: 'atau',
        repo: 'repo',
        newThreatModel: 'Cipta Model Ancaman Baharu'
    },
    threatmodel: {
        contributors: 'Penyumbang',
        contributorsPlaceholder: 'Mulakan menaip untuk menambah penyumbang',
        description: 'Penerangan sistem peringkat tinggi',
        dragAndDrop: 'Seret dan lepaskan atau ',
        editing: 'Penyuntingan',
        jsonPaste: 'Letakkan fail JSON model ancaman di sini atau tampal kandungannya:',
        owner: 'Pemilik',
        reviewer: 'Pemeriksa',
        title: 'Tajuk',
        diagram: {
            diagrams: 'Gambarajah',
            addNewDiagram: 'Tambah gambarajah baru...',
            generic: {
                defaultTitle: 'Gambarajah generik baru',
                defaultDescription: 'Penerangan gambarajah generik baru',
                select: 'Generik'
            },
            stride: {
                defaultTitle: 'Gambarajah STRIDE baru',
                defaultDescription: 'Penerangan gambarajah STRIDE baru',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Gambarajah LINDDUN baru',
                defaultDescription: 'Penerangan gambarajah LINDDUN baru',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Gambarajah PLOT4ai baru',
                defaultDescription: 'Penerangan gambarajah PLOT4ai baru',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Gambarajah DIE baru',
                defaultDescription: 'Penerangan gambarajah DIE baru',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'Gambarajah CIA baru',
                defaultDescription: 'Penerangan gambarajah CIA baru',
                select: 'CIA'
            }
        },
        threats: 'Ancaman',
        errors: {
            dropSingleFileOnly: 'Seret dan lepaskan memerlukan satu fail sahaja.',
            invalidJson: 'JSON tidak sah. Sila periksa model anda dan cuba lagi.',
            onlyJsonAllowed: 'Hanya fail yang berakhir dengan .json yang disokong.',
            open: 'Ralat membuka Model Ancaman ini. Semak konsol pembangun untuk maklumat lanjut',
            save: 'Ralat menyimpan Model Ancaman ini. Semak konsol pembangun untuk maklumat lanjut'
        },
        opened: 'Model ancaman berjaya dibuka',
        saved: 'Model ancaman berjaya disimpan',
        properties: {
            title: 'Ciri-ciri',
            emptyState: 'Pilih elemen pada graf untuk disunting',
            name: 'Nama',
            text: 'Teks',
            description: 'Penerangan',
            outOfScope: 'Di luar Skop',
            bidirection: 'Dwi-Arah',
            reasonOutOfScope: 'Sebab di luar skop',
            handlesCardPayment: 'Bayaran Kad',
            handlesGoodsOrServices: 'Barang atau Perkhidmatan',
            isALog: 'Adalah Log',
            isEncrypted: 'Dienkripsi',
            isSigned: 'Ditandatangani',
            isWebApplication: 'Aplikasi Web',
            privilegeLevel: 'Tahap Keistimewaan',
            providesAuthentication: 'Menyediakan Pengesahan',
            protocol: 'Protokol',
            publicNetwork: 'Rangkaian Awam',
            storesCredentials: 'Simpan Kredensial',
            storesInventory: 'Simpan Inventori'
        },
        buttons: {
            delete: 'Padam yang dipilih',
            redo: 'Buat semula suntingan',
            shortcuts: 'Pintasan papan kekunci',
            toggleGrid: 'Togel grid',
            undo: 'Buat asal semula suntingan',
            zoomIn: 'Zum masuk',
            zoomOut: 'Zum keluar'
        },
        shortcuts: {
            title: 'Pintasan',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Salin'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Tampal'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Buat asal semula'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Buat semula'
            },
            delete: {
                shortcut: 'padam',
                action: 'Padam'
            },
            pan: {
                shortcut: 'shift + klik kiri (tahan/tarik)',
                action: 'Pan'
            },
            multiSelect: {
                shortcut: 'klik kiri pada ruang kosong dan tarik',
                action: 'Pilih pelbagai'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + roda tetikus',
                action: 'Zum'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'Sempadan',
            components: 'Komponen',
            entities: 'Entiti',
            metadata: 'Metadata',
            search: 'Carian',
            notFound: 'Kami belum memilikinya, ingin membuka isu? :)'
        },
        shapes: {
            actor: 'Pelakon',
            flow: 'Aliran Data',
            flowStencil: 'Aliran Data',
            process: 'Proses',
            store: 'Simpan',
            text: 'Teks Penerangan',
            trustBoundary: 'Sempadan Kepercayaan'
        }
    },
    forms: {
        apply: 'Menerapkan',
        cancel: 'Batal',
        close: 'Tutup',
        closeModel: 'Tutup Model',
        delete: 'Padam',
        discardTitle: 'Buang Perubahan?',
        discardMessage: 'Adakah anda pasti mahu membuang perubahan anda?',
        edit: 'Edit',
        exportAs: 'Eksport Model Sebagai',
        exportHtml: 'Laporan HTML',
        exportPdf: 'Laporan PDF',
        exportTd: 'Asal (Threat Dragon)',
        exportOtm: 'Ancaman Terbuka Model (OTM)',
        import: 'Import',
        ok: 'OK',
        open: 'Buka',
        openModel: 'Buka Model',
        print: 'Cetak',
        reload: 'Muat Semula',
        remove: 'Alih Keluar',
        report: 'Laporan',
        save: 'Simpan',
        saveAs: 'Simpan Sebagai',
        saveModel: 'Simpan Model',
        saveModelAs: 'Simpan Model Sebagai',
        search: 'Carian',
        next: 'seterusnya',
        previous: 'sebelumnya'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Kerahsiaan',
                integrity: 'Integriti',
                availability: 'Ketersediaan'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Teragih',
                immutable: 'Tidak Berubah',
                ephemeral: 'Efemeral'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'Pautan',
                identifiability: 'Pengenalpastian',
                nonRepudiation: 'Tidak boleh menafikan',
                detectability: 'Ketahuan',
                disclosureOfInformation: 'Pendedahan maklumat',
                unawareness: 'Tanpa sedar',
                nonCompliance: 'Tidak Mematuhi'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Teknik & Proses',
                accessibility: 'Aksesibiliti',
                identifiabilityLinkability: 'Pengenalpastian & Pautan',
                security: 'Keselamatan',
                safety: 'Keselamatan',
                unawareness: 'Tanpa sedar',
                ethicsHumanRights: 'Etika & Hak Asasi Manusia',
                nonCompliance: 'Tidak Mematuhi'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'Penipuan',
                tampering: 'Penyelewengan',
                repudiation: 'Penafian',
                informationDisclosure: 'Pendedahan maklumat',
                denialOfService: 'Penafian Perkhidmatan',
                elevationOfPrivilege: 'Kenaikan Hak'
            }
        },
        generic: {
            default: 'Ancaman generik baru',
            cia: 'Ancaman CIA baru',
            die: 'Ancaman DIE baru',
            linddun: 'Ancaman LINDDUN baru',
            plot4ai: 'Ancaman PLOT4ai baru',
            stride: 'Ancaman STRIDE baru'
        },
        edit: 'Sunting Ancaman',
        confirmDeleteTitle: 'Sahkan Padam',
        confirmDeleteMessage: 'Adakah anda benar-benar ingin memadam ancaman ini?',
        description: 'Berikan penerangan bagi ancaman ini',
        emptyThreat: 'Pilih elemen pada graf untuk menambah ancaman',
        mitigation: 'Berikan pemulihan untuk ancaman ini atau sebab jika status adalah T/A',
        newThreat: 'Ancaman Baru',
        newThreatByType: 'Ancaman Baru mengikut Jenis',
        newThreatByContext: 'Ancaman Baru mengikut Konteks',
        properties: {
            description: 'Penerangan',
            mitigation: 'Pemulihan',
            modelType: 'Jenis Model',
            number: 'Nombor',
            priority: 'Keutamaan',

            score: 'Skor',
            status: 'Status',
            title: 'Tajuk',
            type: 'Jenis'
        },
        status: {
            notApplicable: 'T/A',
            open: 'Buka',
            mitigated: 'Ditangani'
        },
        priority: {
            low: 'Rendah',
            medium: 'Sederhana',
            high: 'Tinggi'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Tunjukkan elemen di luar skop',
            showMitigatedThreats: 'Tunjukkan ancaman yang ditangani',
            showModelDiagrams: 'Tunjukkan gambarajah model',
            showEmpty: 'Tunjukkan elemen kosong',
            showBranding: 'Logo Threat Dragon'
        },
        title: 'Laporan model ancaman untuk',
        dateGenerated: 'Tarikh Dijana',
        executiveSummary: 'Ringkasan Eksekutif',
        notProvided: 'Tidak disediakan',
        summary: 'Ringkasan',
        threatStats: {
            total: 'Jumlah Ancaman',
            mitigated: 'Jumlah Ditangani',
            notMitigated: 'Belum Ditangani',
            openHigh: 'Buka / Keutamaan Tinggi',
            openMedium: 'Buka / Keutamaan Sederhana',
            openLow: 'Buka / Keutamaan Rendah',
            openUnknown: 'Buka / Keutamaan Tidak Diketahui'
        }
    },
    upgrade: {
        modal: {
            header: 'Kemas kini Model Ancaman',
            welcome: 'Selamat datang ke versi 2 OWASP Threat Dragon!',
            p1: 'Versi 2 menggunakan pustaka lukisan yang berbeza, yang akan mengubah cara sebahagian daripada model ancaman anda disimpan. Walaupun kebanyakan gambarajah akan kelihatan sama seperti versi sebelumnya Threat Dragon, terdapat kes di mana mereka mungkin perlu diselaraskan sedikit.',
            p2: 'Selepas menutup modal ini, anda akan melihat bagaimana setiap gambarajah dalam model ini dipaparkan dalam format versi 2. Sila buat nota gambarajah mana yang perlu anda selaraskan. Ini adalah peningkatan satu kali, dan anda tidak seharusnya melihat mesej ini lagi selepas menyimpan model ini.'
        },
        instructions: 'Hebat! Mari bawa anda ke model anda.',
        continue: 'Teruskan ke Model Ancaman'
    }
};

export default ms;
