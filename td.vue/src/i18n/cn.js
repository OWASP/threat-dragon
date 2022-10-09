const cn = {
    auth: {
        sessionExpired: '会话登录已过期，请重新登录。'
    },
    nav: {
        v2Warning: '这是 OWASP Threat Dragon 的 2.0 版本，仍在开发中。不要使用它来编辑现有模型，因为这个版本可能会破坏它们！',
        loggedInAs: '登录身份为'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'Threat Dragon 是来自 OWASP 的免费开源威胁建模工具。它可以用作 Windows、MacOS 和 Linux 的独立桌面应用程序，也可以用作 Web 应用程序。如果您想在不授予其 GitHub 存储库访问权限的情况下试用该应用程序，则桌面应用程序非常棒，但如果您选择在线（Web）版本，则可以在威胁模型上释放 GitHub 的强大功能！根据需求选择下方登录方式。',
        loginWith: '登录'
    },
    providers: {
        github: {
            displayName: 'GitHub'
        },
        local: {
            displayName: '本地'
        }
    },
    dashboard: {
        welcome: {
            title: '欢迎!',
            description: '您已准备好开始使您的应用程序设计更加安全。您可以通过选择以下选项之一来打开现有威胁模型或创建新的威胁模型。'
        },
        actions: {
            openExisting: '打开现有的威胁模型',
            createNew: '创建一个新的、空的威胁模型',
            demo: '打开示例威胁模型',
            import: '通过 JSON 导入威胁模型'
        }
    },
    demo: {
        select: '从下面的列表中选择一个演示威胁模型'
    },
    desktop: {
        file: {
            heading: 'File',
            close: 'Close Model',
            open: 'Open Model',
            save: 'Save Model',
            saveAs: 'Save Model As'
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
        select: '选择一个',
        from: '下面列表的存储库',
        noneFound: '未找到存储库。请先创建一个新的存储库'
    },
    branch: {
        select: '选择一个分支',
        from: '从下面列表或',
        chooseRepo: '选择另一个回购'
    },
    threatmodelSelect: {
        select: '从中选择一个威胁模型',
        from: '从下面列表中，或选择另一个',
        branch: '分支',
        or: '或者',
        repo: '回购',
        newThreatModel: '创建新的威胁模型'
    },
    threatmodel: {
        contributors: '贡献者',
        contributorsPlaceholder: '添加新的贡献者',
        description: '高级系统描述',
        dragAndDrop: 'Drag and drop or ',
        dropSingleFileOnly: 'Drag and drop requires a single file.',
        editing: '编辑',
        invalidJson: '无效的 JSON。请检查您的格式，然后重试。',
        jsonPaste: '在此处粘贴威胁模型的 JSON',
        onlyJsonAllowed: 'Only files that end with .json are supported.',
        owner: '所有者',
        reviewer: '审稿人',
        title: '标题',
        diagram: {
            diagrams: '图表',
            addNewDiagram: '添加新图表...',
            generic: {
                diagramTitle: 'New generic diagram',
                select: 'Generic'
            },
            stride: {
                diagramTitle: 'New STRIDE diagram',
                select: 'STRIDE'
            },
            linddun: {
                diagramTitle: 'New LINDDUN diagram',
                select: 'LINDDUN'
            },
            cia: {
                diagramTitle: 'New CIA diagram',
                select: 'CIA'
            }
        },
        threats: '威胁',
        errors: {
            open: 'Error opening this Threat Model. Check the developer console for more information',
            save: 'Error saving the Threat Model. Check the developer console for more information'
        },
        opened: 'Threat model successfully opened',
        saved: 'Threat model successfully saved',
        properties: {
            title: '特性',
            emptyState: '在图表上选择要编辑的元素',
            name: '名称',
            text: '文本',
            description: '说明',
            outOfScope: '超出范围',
            reasonOutOfScope: '超出范围的原因',
            privilegeLevel: '权限级别',
            isALog: '是日志',
            storesCredentials: '存储凭证',
            isEncrypted: '加密',
            isSigned: '签名',
            providesAuthentication: '提供身份验证',
            protocol: '协议',
            publicNetwork: '公共网络'
        },
        buttons: {
            delete: 'Delete selected',
            redo: '重做',
            shortcuts: '键盘快捷键',
            toggleGrid: '切换网格',
            undo: '撤消',
            zoomIn: '放大',
            zoomOut: '缩小'
        },
        shortcuts: {
            title: '快捷方式',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: '复制'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: '粘贴'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: '撤消'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: '恢复'
            },
            delete: {
                shortcut: 'del',
                action: '删除'
            },
            pan: {
                shortcut: 'shift + left-click (hold/drag)',
                action: '移动整个图表图像'
            },
            multiSelect: {
                shortcut: '鼠标左键单击空白区域并拖动',
                action: '多选'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + mousewheel',
                action: '缩放'
            }
        },
        stencil: {
            boundaries: '边界',
            components: 'Components',
            entities: '实体',
            metadata: '数据',
            search: '搜索',
            notFound: '当前没有，要打开一个问题吗？ :)'
        },
        shapes: {
            actor: '外部实体',
            flow: '数据流',
            flowStencil: '数据流',
            process: '进程',
            store: '数据存储',
            text: '任意文本',
            trustBoundary: '信任边界'
        }
    },
    forms: {
        apply: 'Apply',
        cancel: '取消',
        close: '关闭',
        closeModel: 'Close Model',
        delete: '删除',
        discardTitle: '放弃更改？',
        discardMessage: '您确定要放弃您的更改吗？',
        edit: '编辑',
        import: '导入',
        ok: 'OK',
        open: 'Open',
        openModel: 'Open Model',
        print: 'Print',
        reload: '重新输入',
        remove: '删除',
        report: '报告',
        save: '保存',
        saveAs: 'Save As',
        saveModel: 'Save Model',
        saveModelAs: 'Save Model As',
        savePdf: 'Save PDF',
        search: '搜索'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: '保密',
                integrity: 'Integrity',
                availability: '可用性'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: '链接能力',
                identifiability: '可识别性',
                nonRepudiation: '不可否认性',
                detectability: '可检测性',
                disclosureOfInformation: '信息披露',
                unawareness: '无意识',
                nonCompliance: '不合规'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: '身份盗窃',
                tampering: '伪造',
                repudiation: '否认',
                informationDisclosure: '信息披露',
                denialOfService: '拒绝服务',
                elevationOfPrivilege: '权限提升'
            }
        },
        generic: {
            default: 'New generic threat',
            cia: 'New CIA threat',
            linddun: 'New LINDDUN threat',
            stride: 'New STRIDE threat'
        },
        edit: '编辑威胁',
        confirmDeleteTitle: '确认删除',
        confirmDeleteMessage: '您确定要删除此威胁吗？',
        description: 'Provide a description for this threat',
        emptyThreat: '在图表上选择一个元素来添加威胁',
        mitigation: 'Provide mitigation or prevention for this threat',
        newThreat: '新增威胁',
        newThreatByType: 'New Threat by Type',
        newThreatByContext: 'New Threat by Context',
        properties: {
            description: '描述',
            mitigation: '缓解措施',
            modelType: '模型类型',
            number: 'Number',
            priority: '优先级',
            score: 'Score',
            status: '状态',
            title: '标题',
            type: '类型'
        },
        status: {
            notApplicable: '不适用',
            open: '打开',
            mitigated: '减轻'
        },
        priority: {
            low: '低',
            medium: '中',
            high: '高'
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
            openUnknown: 'Open / Unknown Priority'
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

export default cn;
