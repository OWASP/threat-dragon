const ind = {
    auth: {
        sessionExpired: 'Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.'
    },
    nav: {
        loggedInAs: 'Masuk sebagai',
        logOut: 'Keluar'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Logo Threat Dragon',
        description: 'OWASP Threat Dragon adalah aplikasi gratis, sumber terbuka, lintas-platform untuk membuat model ancaman. Gunakan untuk menggambar diagram pemodelan ancaman dan mengidentifikasi ancaman untuk sistem Anda. Dengan penekanan pada fleksibilitas dan kesederhanaan, mudah diakses untuk semua jenis pengguna.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Mulai'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Masuk dengan'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Masuk dengan'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Masuk dengan'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Masuk dengan'
        },
        local: {
            displayName: 'Sesi Lokal',
            loginWith: 'Masuk ke'
        }
    },
    dashboard: {
        welcome: {
            title: 'Selamat datang!',
            description: 'Anda siap untuk memulai membuat desain aplikasi Anda lebih aman. Anda dapat membuka model ancaman yang ada atau membuat yang baru dengan memilih salah satu opsi di bawah.'
        },
        actions: {
            openExisting: 'Buka model ancaman yang ada',
            createNew: 'Buat model ancaman kosong baru',
            readDemo: 'Jelajahi model ancaman sampel',
            importExisting: 'Impor model ancaman melalui JSON'
        }
    },
    demo: {
        select: 'Pilih model ancaman demo dari daftar di bawah'
    },
    desktop: {
        file: {
            heading: 'Berkas',
            clearRecentDocs: 'Hapus Menu',
            close: 'Tutup Model',
            closeWindow: 'Tutup Jendela',
            new: 'Model Baru',
            open: 'Buka Model',
            recentDocs: 'Buka Baru-baru ini',
            save: 'Simpan Model',
            saveAs: 'Simpan Model Sebagai'
        },
        help: {
            heading: 'Bantuan',
            docs: 'Dokumentasi',
            visit: 'Kunjungi kami di OWASP',
            sheets: 'Lembaran Curang OWASP',
            github: 'Kunjungi kami di GitHub',
            submit: 'Kirim Isu',
            check: 'Periksa pembaruan ...',
            about: {
                about: 'About',
                version: 'Version'
            }
        }
    },
    repository: {
        select: 'Pilih',
        from: 'repositori dari daftar di bawah',
        noneFound: 'Tidak ada repositori yang ditemukan. Untuk memulai, buat repositori baru di'
    },
    branch: {
        select: 'Pilih cabang dari',
        from: 'dari daftar di bawah atau',
        chooseRepo: 'pilih repo lain',
        or: 'atau',
        addNew: 'tambahkan cabang baru',
        protectedBranch: 'Cabang dilindungi',
        nameRequired: 'Nama cabang diperlukan',
        nameExists: 'Nama cabang sudah ada',
        refBranch: 'Cabang Referensi',
        add: 'Tambah cabang',
        cancel: 'Batal',
        name: 'Nama Cabang',
    },
    folder: {
        select: 'Select a',
        from: 'folder from the list below',
        noneFound: 'This folder is empty, You can create a new threat model here.'
    },
    threatmodelSelect: {
        select: 'Pilih Model Ancaman dari',
        from: 'dari daftar di bawah, atau pilih lain',
        branch: 'cabang',
        or: 'atau',
        repo: 'repo',
        newThreatModel: 'Buat Model Ancaman Baru'
    },
    threatmodel: {
        contributors: 'Kontributor',
        contributorsPlaceholder: 'Mulai mengetik untuk menambahkan kontributor',
        description: 'Deskripsi sistem tingkat tinggi',
        dragAndDrop: 'Seret dan lepas atau ',
        editing: 'Mengedit',
        jsonPaste: 'Letakkan file JSON model ancaman di sini atau tempelkan isinya di sini:',
        owner: 'Pemilik',
        reviewer: 'Pemeriksa',
        title: 'Judul',
        diagram: {
            diagrams: 'Diagram',
            addNewDiagram: 'Tambahkan diagram baru...',
            generic: {
                defaultTitle: 'Diagram generik baru',
                defaultDescription: 'Deskripsi diagram generik baru',
                select: 'Generik'
            },
            stride: {
                defaultTitle: 'Diagram STRIDE baru',
                defaultDescription: 'Deskripsi diagram STRIDE baru',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'Diagram LINDDUN baru',
                defaultDescription: 'Deskripsi diagram LINDDUN baru',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'Diagram PLOT4ai baru',
                defaultDescription: 'Deskripsi diagram PLOT4ai baru',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'Diagram CIA-DIE baru',
                defaultDescription: 'Deskripsi diagram CIA-DIE baru',
                select: 'CIADIE'
            },
            cia: {
                defaultTitle: 'Diagram CIA baru',
                defaultDescription: 'Deskripsi diagram CIA baru',
                select: 'CIA'
            }
        },
        threats: 'Ancaman',
        errors: {
            create: 'Could not create the threat model file.  Check the developer console for more information',
            dropSingleFileOnly: 'Seret dan lepas memerlukan satu file saja.',
            invalidJson: 'JSON tidak valid. Harap periksa model Anda dan coba lagi',
            invalidModel: 'The threat model file does not validate correctly. Please check your model and try again',
            onlyJsonAllowed: 'Hanya file yang berakhir dengan .json yang didukung.',
            open: 'Kesalahan membuka Model Ancaman ini. Periksa konsol pengembang untuk informasi lebih lanjut',
            save: 'Kesalahan menyimpan Model Ancaman. Periksa konsol pengembang untuk informasi lebih lanjut'
        },
        warnings: {
            export: 'Could not export the Threat Model. Check the developer console for more information',
            jsonSchema: 'Model does not strictly match schema. Details from the developer console',
            noModelOpen: 'No model open',
            otmUnsupported: 'Import of Open Threat Model file format not yet supported',
            save: 'Could not save the Threat Model. Check the developer console for more information',
            tmUnsupported: 'Import of TM-BOM file format is experimental and subject to change that may break models',
            v1Translate: 'Model versi 1.x yang diimpor akan ditingkatkan ke skema versi 2.0'
        },
        prompts: {
            created: 'Threat model successfully created',
            exported: 'Threat model exported',
            opened: 'Model ancaman berhasil dibuka',
            downloading: 'Downloading threat model',
            saved: 'Model ancaman berhasil disimpan'
        },
        properties: {
            title: 'Properti',
            emptyState: 'Pilih elemen pada grafik untuk diedit',
            name: 'Nama',
            text: 'Teks',
            description: 'Deskripsi',
            outOfScope: 'Di luar cakupan',
            bidirection: 'Dwi arah',
            reasonOutOfScope: 'Alasan di luar cakupan',
            handlesCardPayment: 'Pembayaran Kartu',
            handlesGoodsOrServices: 'Barang atau Jasa',
            isALog: 'Adalah Log',
            isEncrypted: 'Terenkripsi',
            isSigned: 'Ditandatangani',
            isWebApplication: 'Aplikasi Web',
            privilegeLevel: 'Tingkat Hak Akses',
            providesAuthentication: 'Memberikan Otentikasi',
            protocol: 'Protokol',
            publicNetwork: 'Jaringan Publik',
            storesCredentials: 'Menyimpan Kredensial',
            storesInventory: 'Menyimpan Persediaan'
        },
        buttons: {
            delete: 'Hapus yang dipilih',
            redo: 'Lakukan lagi',
            shortcuts: 'Pintasan keyboard',
            toggleGrid: 'Aktifkan grid',
            undo: 'Batalkan lagi',
            zoomIn: 'Perbesar',
            zoomOut: 'Perkecil'
        },
        shortcuts: {
            title: 'Pintasan',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Salin'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Tempel'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Batalkan'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Lakukan lagi'
            },
            delete: {
                shortcut: 'hapus',
                action: 'Hapus'
            },
            pan: {
                shortcut: 'geser + klik kiri (tahan/tarik)',
                action: 'Geser'
            },
            multiSelect: {
                shortcut: 'klik kiri pada ruang kosong dan tarik',
                action: 'Pilih beberapa'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + roda mouse',
                action: 'Perbesar/Perkecil'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'Batas',
            components: 'Komponen',
            entities: 'Entitas',
            metadata: 'Metadata',
            search: 'Cari',
            notFound: 'Belum ada, ingin membuka isu? :)'
        },
        shapes: {
            actor: 'Aktor',
            flow: 'Aliran Data',
            flowStencil: 'Aliran Data',
            process: 'Proses',
            store: 'Penyimpanan',
            text: 'Teks Deskriptif',
            trustBoundary: 'Batas Kepercayaan'
        }
    },
    forms: {
        apply: 'Terapkan',
        cancel: 'Batal',
        close: 'Tutup',
        closeModel: 'Tutup Model',
        delete: 'Hapus',
        discardTitle: 'Buang Perubahan?',
        discardMessage: 'Apakah Anda yakin ingin membuang perubahan Anda?',
        duplicate: 'Dyblygu',
        edit: 'Edit',
        export: 'Allforio',
        exportAs: 'Ekspor Model Sebagai',
        exportHtml: 'Laporan HTML',
        exportPdf: 'Laporan PDF',
        exportTd: 'Asli (Threat Dragon)',
        exportOtm: 'Model Ancaman Terbuka (OTM)',
        import: 'Impor',
        ok: 'OK',
        open: 'Buka',
        openModel: 'Buka Model',
        print: 'Cetak',
        reload: 'Muat ulang',
        remove: 'Hapus',
        report: 'Laporan',
        save: 'Simpan',
        saveAs: 'Simpan Sebagai',
        saveModel: 'Simpan Model',
        saveModelAs: 'Simpan Model Sebagai',
        search: 'Cari',
        next: 'Berikutnya',
        previous: 'sebelumnya'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Kerahasiaan',
                integrity: 'Integritas',
                availability: 'Ketersediaan'
            },
            ciadie: {
                header: '--- CIA-DIE ---',
                confidentiality: 'Kerahasiaan',
                integrity: 'Integritas',
                availability: 'Ketersediaan',
                distributed: 'Didistribusikan',
                immutable: 'Tidak dapat diubah',
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
                nonCompliance: 'Pelanggaran'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Teknik & Proses',
                accessibility: 'Aksesibilitas',
                identifiabilityLinkability: 'Identifiability & Linkability',
                security: 'Keamanan',
                safety: 'Keselamatan',
                unawareness: 'Unawareness',
                ethicsHumanRights: 'Etika & Hak Asasi Manusia',
                nonCompliance: 'Pelanggaran'
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
            default: 'Ancaman generik baru',
            cia: 'Ancaman CIA baru',
            ciadie: 'Ancaman CIA-DIE baru',
            linddun: 'Ancaman LINDDUN baru',
            plot4ai: 'Ancaman PLOT4ai baru',
            stride: 'Ancaman STRIDE baru'
        },
        edit: 'Edit Ancaman',
        confirmDeleteTitle: 'Konfirmasi Hapus',
        confirmDeleteMessage: 'Apakah Anda benar-benar ingin menghapus ancaman ini?',
        description: 'Berikan deskripsi untuk ancaman ini',
        emptyThreat: 'Pilih elemen pada grafik untuk menambahkan ancaman',
        mitigation: 'Berikan remediasi untuk ancaman ini atau alasan jika status adalah N/A',
        newThreat: 'Ancaman Baru',
        newThreatByType: 'Ancaman Baru berdasarkan Tipe',
        newThreatByContext: 'Ancaman Baru berdasarkan Konteks',
        properties: {
            description: 'Deskripsi',
            mitigation: 'Remediasi',
            modelType: 'Jenis Model',
            number: 'Nomor',
            severity: 'Prioritas',
            score: 'Skor',
            status: 'Status',
            title: 'Judul',
            type: 'Tipe'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Terbuka',
            mitigated: 'Diredam'
        },
        severity: {
            tbd: 'TBD',
            low: 'Rendah',
            medium: 'Sedang',
            high: 'Tinggi',
            critical: 'Kritis'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Tampilkan elemen di luar cakupan',
            showMitigatedThreats: 'Tampilkan ancaman yang diredam',
            showModelDiagrams: 'Tampilkan diagram model',
            showEmpty: 'Tampilkan elemen kosong',
            showProperties: 'Show element properties',
            showBranding: 'Logo Threat Dragon'
        },
        title: 'Laporan model ancaman untuk',
        dateGenerated: 'Tanggal Dibuat',
        executiveSummary: 'Ringkasan Eksekutif',
        notProvided: 'Tidak tersedia',
        summary: 'Ringkasan',
        threatStats: {
            total: 'Total Ancaman',
            mitigated: 'Total Diredam',
            notApplicable: 'Total Not Applicable',
            notMitigated: 'Belum Diredam',
            openCritical: 'Terbuka / Prioritas Kritis',
            openHigh: 'Terbuka / Prioritas Tinggi',
            openMedium: 'Terbuka / Prioritas Sedang',
            openLow: 'Terbuka / Prioritas Rendah',
            openTbd: 'Terbuka / Prioritas TBD',
            openUnknown: 'Terbuka / Prioritas Tidak Diketahui'
        }
    },
    upgrade: {
        modal: {
            header: 'Pembaruan Model Ancaman',
            welcome: 'Selamat datang di versi 2 OWASP Threat Dragon!',
            p1: 'Versi 2 menggunakan perpustakaan gambar yang berbeda, yang akan mengubah cara bagian dari model ancaman Anda disimpan. Meskipun sebagian besar diagram akan terlihat sama seperti di versi Threat Dragon sebelumnya, ada kasus di mana mereka mungkin perlu disesuaikan sedikit.',
            p2: 'Setelah menutup modal ini, Anda akan melihat bagaimana setiap diagram dalam model ini dirender dalam format versi 2. Harap perhatikan setiap diagram yang mungkin perlu Anda sesuaikan. Ini adalah peningkatan satu kali, dan Anda tidak akan melihat pesan ini lagi setelah menyimpan model ini.'
        },
        instructions: 'Bagus! Mari kita bawa Anda ke model Anda.',
        continue: 'Lanjut ke Model Ancaman'
    }
};

export default ind;
