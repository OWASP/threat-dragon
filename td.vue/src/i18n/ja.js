const jpn = {
    auth: {
        sessionExpired: 'セッションの有効期限が切れました。再ログインしてください。'
    },
    nav: {
        v2Warning: 'バージョン2.0の脅威モデルは、Threat Dragonバージョン1.xとの互換性を保っていません。バージョン1.xのモデルは、インポート時にバージョン2.0のフォーマットに変換されます。',
        loggedInAs: 'ユーザー名',
        logOut: 'ログアウト'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragonロゴ',
        description: 'OWASP Threat Dragonは無償で、脅威モデリングのソフトです。オープンソースで複数のプラットホームに対応しています。Threat Dragonで脅威モデルを作成することによって、システムに対する脅威が明確になります。重視が多様性と使い勝手に置かれているので、簡単に利用できます。'
    },
    providers: {
        desktop: {
            displayName: '開始',
            loginWith: 'Threat Dragon'
        },
        github: {
            displayName: 'GitHubで',
            loginWith: 'ログイン'
        },
        bitbucket: {
            displayName: 'Bitbucketで',
            loginWith: 'ログイン'
        },
        google: {
            displayName: 'Google',
            loginWith: 'ログイン'
        },
        local: {
            displayName: 'ローカルセッション',
            loginWith: 'ログイン'
        }
    },
    dashboard: {
        welcome: {
            title: 'ようこそ！',
            description: 'システムの設計をもっとセキュアにしましょう。既存の脅威モデルを開くか、次の選択肢から一つを選んで新しい脅威モデルを作成できます。'
        },
        actions: {
            openExisting: '既存の脅威モデルを開く',
            createNew: '新しい脅威モデルを作る',
            readDemo: '脅威モデルの一例を見る',
            importExisting: '脅威モデルをJSONからインポートする'
        }
    },
    demo: {
        select: '次のものから脅威モデルの一例を選んでください'
    },
    desktop: {
        file: {
            heading: 'ファイル',
            clearRecentDocs: 'メニューを空にする',
            close: 'モデルを閉じる',
            closeWindow: 'ウインドウを閉じる',
            new: '新しいモデルを作る',
            open: 'モデルを開く',
            recentDocs: '最近開いたモデル',
            save: 'モデルを保存',
            saveAs: '名前を付けてモデルを保存'
        },
        help: {
            heading: 'ヘルプ',
            docs: 'ドキュメンテーション',
            visit: 'OWASPでのページ',
            sheets: 'OWASP Cheat Sheets',
            github: 'GitHubリポジトリ',
            submit: '問題を報告',
            check: '更新を確認...'
        }
    },
    repository: {
        select: '次のものから',
        from: 'リポジトリを選択してください',
        noneFound: 'リポジトリが見付かりません。新しいリポジトリを作成してください。'
    },
    branch: {
        select: '次のものから',
        from: 'ブランチ名を選択してください',
        chooseRepo: 'リポジトリの切り替え'
    },
    threatmodelSelect: {
        select: '次のものから',
        from: '脅威モデルを選ぶか',
        branch: '別のブランチ',
        or: 'または',
        repo: 'リポジトリに切り替える',
        newThreatModel: '新しい脅威モデルを作成する'
    },
    threatmodel: {
        contributors: '貢献者',
        contributorsPlaceholder: '貢献した方の名前',
        description: 'システム概要',
        dragAndDrop: 'ドラッグ・アンド・ドロップで脅威モデルを指定するか、',
        editing: '編集',
        jsonPaste: 'JSONファイルの内容をここに貼り付けてください',
        owner: 'オーナー',
        reviewer: '検証者',
        title: 'タイトル',
        diagram: {
            diagrams: '図面',
            addNewDiagram: '新しい図面を追加...',
            generic: {
                defaultTitle: '一般の図面',
                defaultDescription: '図面の概要',
                select: '一般'
            },
            stride: {
                defaultTitle: 'STRIDE図',
                defaultDescription: '新しいSTRIDE図の概要',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'LINDDUN図',
                defaultDescription: '新しいLINDDUN図の概要',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'PLOT4ai図',
                defaultDescription: '新しいPLOT4ai図の概要',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'DIE図',
                defaultDescription: '新しいDIE図の概要',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'CIA図',
                defaultDescription: '新しいCIA図の概要',
                select: 'CIA'
            }
        },
        threats: '脅威',
        errors: {
            dropSingleFileOnly: '単一のファイルをドロップしてください。',
            invalidJson: 'ファイルのJSONフォーマットに対応していません。モデルを確認したうえ、もう一度試してみてください。',
            onlyJsonAllowed: '拡張子.jsonのファイルのみに対応しています。',
            open: '脅威モデルを開く時にエラーが発生しました。開発者コンソールを確認してください。',
            save: '脅威モデルを保存時にエラーが発生しました。開発者コンソールを確認してください。'
        },
        opened: '脅威モデルを読み込みました。',
        saved: '脅威モデルを書き込みました。',
        properties: {
            title: 'プロパティー',
            emptyState: '図面から要素を選択してください',
            name: '名前',
            text: 'テキスト',
            description: '概要',
            outOfScope: '対象外',
            bidirection: '双方向',
            reasonOutOfScope: '対象外となる理由',
            handlesCardPayment: '決済情報を扱っている',
            handlesGoodsOrServices: '商品やサービスを扱っている',
            isALog: 'ログ',
            isEncrypted: '暗号化されている',
            isSigned: '署名されている',
            isWebApplication: 'ウェブアプリ',
            privilegeLevel: '権限レベル',
            providesAuthentication: '認証を行っている',
            protocol: 'プロトコル',
            publicNetwork: '公衆ネットワーク',
            storesCredentials: '認証情報を保管している',
            storesInventory: '登録簿を保管している'
        },
        buttons: {
            delete: '選択を削除',
            redo: '繰り返す',
            shortcuts: 'キーボードショートカット',
            toggleGrid: 'グリッドの表示',
            undo: '戻す',
            zoomIn: '拡大',
            zoomOut: '縮小'
        },
        shortcuts: {
            title: 'キーボードショートカット',
            copy: {
                shortcut: '(コントロール/コマンド) + c',
                action: 'コピー'
            },
            paste: {
                shortcut: '(コントロール/コマンド) + v',
                action: '貼り付ける'
            },
            undo: {
                shortcut: '(コントロール/コマンド) + z',
                action: '戻す'
            },
            redo: {
                shortcut: '(コントロール/コマンド) + y',
                action: '繰り返す'
            },
            delete: {
                shortcut: '削除',
                action: '削除'
            },
            pan: {
                shortcut: 'シフト + 左クリック (ドラッグとドロップ)',
                action: '移動する'
            },
            multiSelect: {
                shortcut: '空白に左クリックとドラッグ',
                action: '複数の要素を選択'
            },
            zoom: {
                shortcut: '(コントロール/コマンド) + ホイール',
                action: '拡大・縮小'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: '境界',
            components: 'コンポーネント',
            entities: 'エンティティ',
            metadata: 'メタデータ',
            search: '検索',
            notFound: '見付かりませんでした。チケットを切りますか？ :)'
        },
        shapes: {
            actor: 'アクター',
            flow: 'データフロー',
            flowStencil: 'データフロー',
            process: 'プロセス',
            store: 'データストア',
            text: '説明',
            trustBoundary: '信頼境界線'
        }
    },
    forms: {
        apply: '適用',
        cancel: '取り消し',
        close: '閉じる',
        closeModel: 'モデルを閉じる',
        delete: '削除',
        discardTitle: '変更を破棄',
        discardMessage: '変更を本当に破棄しますか？',
        edit: '編集',
        exportAs: '次としてエキスポート',
        exportHtml: 'HTMLとして保存',
        exportPdf: 'PDFとして保存',
        exportTd: 'オリジナル(Threat Dragon)',
        exportOtm: '脅威モデル(OTM)を開く',
        import: 'インポート',
        ok: 'OK',
        open: '開く',
        openModel: 'モデルを開く',
        print: '印刷',
        reload: '再読み込み',
        remove: '削除',
        report: 'レポート',
        save: '保存',
        saveAs: '名前を付けて保存',
        saveModel: 'モデルを保存',
        saveModelAs: '名前を付けてモデルを保存',
        search: '検索',
        next: '次',
        previous: '前の'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: '機密性',
                integrity: '完全性',
                availability: '可用性'
            },
            die: { // Source: https://www.fastly.com/jp/blog/the-dept-of-know-live-sounil-yu-on-why-embracing-the-die-security-model-means-faster-innovation
                header: '--- DIE ---',
                distributed: '分散化',
                immutable: '不変',
                ephemeral: '一時的'
            },
            linddun: { // No Japanese sources for LINDDUN; using English terms
                header: '--- LINDDUN ---',
                linkability: 'Linkability',
                identifiability: 'Identifiability',
                nonRepudiation: 'Non-repudiation',
                detectability: 'Detectability',
                disclosureOfInformation: 'Disclosure Of Information',
                unawareness: 'Unawareness',
                nonCompliance: 'Non-compliance'
            },
            plot4ai: { // No Japanese sources for PLOT4ai; using English terms
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Technique & Processes',
                accessibility: 'Accessibility',
                identifiabilityLinkability: 'Identifiability & Linkability',
                security: 'Security',
                safety: 'Safety',
                unawareness: 'Unawareness',
                ethicsHumanRights: 'Ethics & Human Rights',
                nonCompliance: 'Non-Compliance'
            },
            stride: { // Source: https://learn.microsoft.com/ja-jp/azure/security/develop/threat-modeling-tool-threats
                header: '--- STRIDE ---',
                spoofing: 'なりすまし',
                tampering: '改竄',
                repudiation: '否認',
                informationDisclosure: '情報漏洩',
                denialOfService: 'サービス拒否',
                elevationOfPrivilege: '特権の昇格'
            }
        },
        generic: {
            default: '脅威を追加',
            cia: 'CIA脅威を追加',
            die: 'DIE脅威を追加',
            linddun: 'LINDDUN脅威を追加',
            plot4ai: 'PLOT4ai脅威を追加',
            stride: 'STRIDE脅威を追加'
        },
        edit: '脅威を編集',
        confirmDeleteTitle: '削除の確認',
        confirmDeleteMessage: '本当に脅威を削除しますか',
        description: '脅威の詳細を追記してください',
        emptyThreat: '図面から要素を選んで脅威を追加してください',
        mitigation: '脅威の解決策を指定するか、ステータスがN/Aの場合に理由を指定してください',
        newThreat: '脅威を追加',
        newThreatByType: '種別から脅威を追加',
        newThreatByContext: 'コンテキストから脅威を追加',
        properties: {
            description: '概要',
            mitigation: '解決策',
            modelType: 'モデル型',
            number: '番号',
            priority: '優先度',
            score: '結果',
            status: 'ステータス',
            title: 'タイトル',
            type: '種別'
        },
        status: {
            notApplicable: 'N/A',
            open: '未対応',
            mitigated: '解決済み'
        },
        priority: {
            low: '低',
            medium: '中',
            high: '高'
        }
    },
    report: {
        options: {
            showOutOfScope: '対象外の要素を表示',
            showMitigatedThreats: '解決済みの脅威を表示',
            showModelDiagrams: 'モデルの図面を表示',
            showEmpty: '空要素を表示',
            showBranding: 'Threat Dragonロゴ'
        },
        title: '脅威レポート',
        dateGenerated: '作成日付',
        executiveSummary: 'あらすじ',
        notProvided: '未指定',
        summary: '集計表',
        threatStats: {
            total: '脅威総数',
            mitigated: '対策済みの脅威',
            notMitigated: '未対策の脅威',
            openHigh: '未対応 / 高優先度',
            openMedium: '未対応 / 中優先度',
            openLow: '未対応 / 低優先度',
            openUnknown: '未対応 / 優先度不明'
        }
    },
    upgrade: {
        modal: {
            header: '脅威モデルを更新',
            welcome: 'OWASP Threat Dragonバージョン2へようこそ！',
            p1: 'バージョン2が使用している表示ライブラリが変わったため、脅威モデルのデータフォーマットに変更がありました。表示には以前と変わりがないが、場合によって図面を修正する必要があります。',
            p2: 'モデルを閉じると、バージョン2のフォーマットでの表示が映ります。図面を修正する必要があるか確認してください。一旦保存したら再び修正する必要がないので、このメッセージは今後表示されません。'
        },
        instructions: '素晴らしい！モデルに進みましょう。',
        continue: '脅威モデルへ進む'
    }
};

export default jpn;
