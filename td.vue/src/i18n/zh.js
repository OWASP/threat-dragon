const zho = {
    auth: {
        sessionExpired: '会话登录已过期，请重新登录。'
    },
    nav: {
        v2Warning: '2.0 版威胁模型与 1.x 版Threat Dragon模型不兼容。导入的 1.x 版模型将升级到 2.0 版本',
        loggedInAs: '登录身份为',
        logOut: 'Log out'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'Threat Dragon 是来自 OWASP 的免费开源威胁建模工具。它可以用作 Windows、MacOS 和 Linux 的独立桌面应用程序，也可以用作 Web 应用程序。如果您想在不授予其 GitHub 存储库访问权限的情况下试用该应用程序，则桌面应用程序非常棒，但如果您选择在线（Web）版本，则可以在威胁模型上释放 GitHub 的强大功能！根据需求选择下方登录方式。'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: '开始'
        },
        github: {
            displayName: 'GitHub',
            loginWith: '登录'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: '登录'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: '登录'
        },
        google: {
            displayName: 'Google',
            loginWith: '登录'
        },
        local: {
            displayName: '本地',
            loginWith: '登录'
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
            readDemo: '打开示例威胁模型',
            importExisting: '通过 JSON 导入威胁模型'
        }
    },
    demo: {
        select: '从下面的列表中选择一个演示威胁模型'
    },
    desktop: {
        file: {
            heading: '文件',
            clearRecentDocs: '清除菜单',
            close: '关闭模型',
            closeWindow: '关闭窗口',
            new: 'New Model',
            open: '打开模型',
            recentDocs: '最近打开',
            save: '保存模型',
            saveAs: '模型另存为'
        },
        help: {
            heading: '帮助',
            docs: '文档',
            visit: 'OWASP网站上项目页面',
            sheets: 'OWASP备忘录',
            github: 'GitHub项目页面',
            submit: '提交Issue',
            check: '检查更新...'
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
        chooseRepo: '选择另一个源'
    },
    threatmodelSelect: {
        select: '从中选择一个威胁模型',
        from: '从下面列表中，或选择另一个',
        branch: '分支',
        or: '或者',
        repo: '源',
        newThreatModel: '创建新的威胁模型'
    },
    threatmodel: {
        contributors: '贡献者',
        contributorsPlaceholder: '添加新的贡献者',
        description: '详细系统描述',
        dragAndDrop: '拖放或',
        editing: '编辑',
        jsonPaste: '在此处粘贴威胁模型的JSON',
        owner: '所有者',
        reviewer: '审稿人',
        title: '标题',
        diagram: {
            diagrams: '图表',
            addNewDiagram: '添加新图表...',
            generic: {
                defaultTitle: '新通用图',
                defaultDescription: '新通用图描述',
                select: '通用'
            },
            stride: {
                defaultTitle: '新STRIDE图',
                defaultDescription: '新STRIDE图描述',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: '新LINDDUN图',
                defaultDescription: '新LINDDUN图描述',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: '新PLOT4ai图',
                defaultDescription: '新PLOT4ai图描述',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: '新DIE图',
                defaultDescription: '新DIE图描述',
                select: 'DIE'
            },
            cia: {
                defaultTitle: '新CIA图',
                defaultDescription: '新CIA图描述',
                select: 'CIA'
            }
        },
        threats: '威胁',
        errors: {
            dropSingleFileOnly: '只能拖放一个文件。',
            invalidJson: '无效的JSON。请检查您的格式，然后重试。',
            onlyJsonAllowed: '只支持以.json结尾的文件。',
            open: '打开此威胁模型出错。检查开发者控制台以了解更多信息',
            save: '保存此威胁模型出错。检查开发者控制台以了解更多信息'
        },
        opened: '成功打开威胁模型',
        saved: '成功保存威胁模型',
        properties: {
            title: '组件',
            emptyState: '在图表上选择要编辑的元素',
            name: '名称',
            text: '文本',
            description: '说明',
            outOfScope: '超出范围',
            bidirection: '双向',
            reasonOutOfScope: '超出范围的原因',
            handlesCardPayment: '支付卡',
            handlesGoodsOrServices: '货物或服务',
            isALog: '日志',
            isEncrypted: '加密',
            isSigned: '签名',
            isWebApplication: 'Web应用程序',
            privilegeLevel: '权限级别',
            providesAuthentication: '提供身份验证',
            protocol: '协议',
            publicNetwork: '公共网络',
            storesCredentials: '存储凭证',
            storesInventory: '存储库存'
        },
        buttons: {
            delete: '删除选中',
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
                shortcut: 'shift + 左键 (按住/拖动)',
                action: '移动整个图表图像'
            },
            multiSelect: {
                shortcut: '鼠标左键单击空白区域并拖动',
                action: '多选'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + 鼠标滚轮',
                action: '缩放'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: '边界',
            components: '组件',
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
        apply: '应用',
        cancel: '取消',
        close: '关闭',
        closeModel: '关闭模型',
        delete: '删除',
        discardTitle: '放弃更改？',
        discardMessage: '您确定要放弃您的更改吗？',
        edit: '编辑',
        exportAs: '导出模型为',
        exportHtml: '导出HTML',
        exportPdf: '导出PDF',
        exportTd: '原始 (Threat Dragon)',
        exportOtm: '开放威胁模型 (OTM)',
        import: '导入',
        ok: 'OK',
        open: '打开',
        openModel: '打开模型',
        print: '打印',
        reload: '重新加载',
        remove: '删除',
        report: '报告',
        save: '保存',
        saveAs: '保存为',
        saveModel: '保存模型',
        saveModelAs: '模型另存为',
        search: '搜索',
        next: '下一个',
        previous: '上一个'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: '机密性',
                integrity: '完整性',
                availability: '可用性'
            },
            die: {
                header: '--- DIE ---',
                distributed: '分布式',
                immutable: '不可变性',
                ephemeral: '短暂性'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: '可链接性',
                identifiability: '可识别性',
                nonRepudiation: '不可否认性',
                detectability: '可检测性',
                disclosureOfInformation: '信息泄露',
                unawareness: '不知情',
                nonCompliance: '不合规'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: '技术 & 过程',
                accessibility: '可访问性',
                identifiabilityLinkability: '可识别性 & 可链接性',
                security: '信息安全',
                safety: '系统安全',
                unawareness: '不知情',
                ethicsHumanRights: '伦理 & 人权',
                nonCompliance: '不合格'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: '欺骗',
                tampering: '篡改',
                repudiation: '否认',
                informationDisclosure: '信息泄露',
                denialOfService: '拒绝服务',
                elevationOfPrivilege: '权限提升'
            }
        },
        generic: {
            default: '新通用威胁',
            cia: '新CIA威胁',
            die: '新DIE威胁',
            linddun: '新LINDDUN威胁',
            plot4ai: '新PLOT4ai威胁',
            stride: '新STRIDE威胁'
        },
        edit: '编辑威胁',
        confirmDeleteTitle: '确认删除',
        confirmDeleteMessage: '您确定要删除此威胁吗？',
        description: '为这种威胁提供一个描述',
        emptyThreat: '在图表上选择一个元素来添加威胁',
        mitigation: '为这种威胁提供缓解或预防措施',
        newThreat: '新增威胁',
        newThreatByType: '按类型划分的新威胁',
        newThreatByContext: '按关系划分的新威胁',
        properties: {
            description: '描述',
            mitigation: '缓解措施',
            modelType: '模型类型',
            number: '编号',
            priority: '优先级',
            score: '评分',
            status: '状态',
            title: '标题',
            type: '类型'
        },
        status: {
            notApplicable: '不适用',
            open: '未解决',
            mitigated: '缓解'
        },
        priority: {
            low: '低',
            medium: '中',
            high: '高'
        }
    },
    report: {
        options: {
            showOutOfScope: '显示范围外的元素',
            showMitigatedThreats: '显示已缓解的威胁',
            showModelDiagrams: '显示模型图',
            showEmpty: '显示空元素',
            showBranding: '显示Threat Dragon形象'
        },
        title: '威胁模型报告来自',
        dateGenerated: '生成日期',
        executiveSummary: '内容提要',
        notProvided: '未提供',
        summary: '摘要',
        threatStats: {
            total: '威胁总数',
            mitigated: '已缓解总数',
            notMitigated: '未缓解',
            openHigh: '未解决/高优先级',
            openMedium: '未解决/中优先级',
            openLow: '未解决/低优先级',
            openUnknown: '未解决/未知优先级'
        }
    },
    upgrade: {
        modal: {
            header: '威胁模型更新',
            welcome: '欢迎来到OWASP Threat Dragon第2版!',
            p1: '第二版使用不同的绘图库，这将改变你的威胁模型的部分保存方式。虽然大多数图看起来与以前版本的Threat Dragon相同，但在有些情况下可能需要稍作调整。',
            p2: '关闭这个模式后，你会看到这个模型中的每个图是如何以第二版格式呈现的。请注意你可能需要调整的任何图表。这是一个一次性的升级，在保存这个模型后，你不应该再看到这个信息。'
        },
        instructions: '完美! 让我们来看看你的模型。',
        continue: '继续威胁模型'
    }
};

export default zho;
