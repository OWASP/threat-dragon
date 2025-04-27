const zho = {
    auth: {
        sessionExpired: '会话登录已过期，请重新登录。'
    },
    operator: {
        heading: '运营者',
        operatedby: '本网站和OWASP Threat Dragon实例由以下机构运营：',
        name: `${process.env.VUE_APP_OPERATOR_NAME || '本网站的运营者'}`,
        contact: '联系方式: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(未提供联系信息)'),
    },
    tos: {
        title: '服务条款',
        lastUpdated: '2025年4月4日',
        introduction: '欢迎使用我们的OWASP Threat Dragon实例。这些使用条款（"条款"）规定了您对本网站的访问和使用，该网站是由上述运营商（"运营商"）提供的开源Web应用程序的实例。',
        sections: [
            {
                heading: '1. 接受条款',
                content: '通过访问和使用本网站，您接受并同意受本协议条款和规定的约束。如果您不同意这些条款，请不要使用本网站。'
            },
            {
                heading: '2. 网站使用',
                content: '您只能将网站用于合法目的。您同意不滥用、破坏或尝试未经授权访问网站或其底层系统。'
            },
            {
                heading: '3. 无保证',
                content: '本网站按"原样"提供，不提供任何明示或暗示的保证，包括但不限于适用于特定目的、可用性或准确性的保证。我们不保证不间断或无错误的操作。'
            },
            {
                heading: '4. 责任限制',
                content: '在法律允许的最大范围内，运营商对于因您使用或无法使用本网站而产生的任何直接、间接、偶然或后果性损害不承担责任。'
            },
            {
                heading: '5. 开源软件',
                content: '本网站运行OWASP Threat Dragon软件，其源代码可在https://www.github.com/OWASP/threat-dragon获取。您对软件的使用受其开源许可条款的约束。我们仅负责运营此实例，而非软件本身。本网站的运营商与OWASP没有关联。'
            },
            {
                heading: '6. 条款变更',
                content: '运营商可能随时更新这些条款。在条款更改后继续使用本网站即表示接受更新后的条款。'
            },
            {
                heading: '7. 终止',
                content: '运营商保留自行决定、不经通知、以任何理由暂停或终止对网站的访问的权利。'
            },
            {
                heading: '8. 适用法律',
                content: '这些条款受运营商总部所在地（如果是组织）或居住地（如果是个人）的司法管辖区法律管辖，不考虑法律冲突原则。'
            }
        ],
        contact: '如果您对这些条款有任何疑问，请联系网站运营者。'
    },
    privacy: {
        title: '隐私政策',
        lastUpdated: '2025年4月4日',
        introduction: '本网站的运营商致力于保护您的隐私。本隐私政策解释了如何处理您的信息。',
        sections: [
            {
                heading: '最小数据使用原则',
                content: '运营商不会收集、存储或处理用户的个人数据用于跟踪、分析或与第三方共享。临时日志（可能包括IP地址或用户名）仅用于运营和调试目的。这些日志会在短时间内被丢弃，不会被保留或用于这些有限目的之外。'
            },
            {
                heading: '法律合规',
                content: '运营商只会在法律要求的情况下披露信息，例如响应有效的政府命令或传票。在这种情况下，运营商将遵守适用的法律义务。'
            },
            {
                heading: '政策变更',
                content: '运营商可能会不时更新本隐私政策。任何变更都将在本页面上发布，并更新"最后更新"日期。'
            },
            {
                heading: '联系我们',
                content: '如果您对本隐私政策有任何疑问，请联系网站运营者。'
            }
        ]
    },
    nav: {
        v2Warning:
            '2.0 版威胁模型与 1.x 版Threat Dragon模型不兼容。导入的 1.x 版模型将升级到 2.0 版本',
        loggedInAs: '登录身份为',
        logOut: 'Log out',
        tos: '服务条款',
        privacy: '隐私政策'
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description:
            'OWASP Threat Dragon 是一款免费、开源、跨平台的威胁建模应用程序。使用它来绘制威胁建模图并识别系统的威胁。凭借其灵活性和简单性，各类用户都能轻松使用。'
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
        },
        googleDrive: {
            displayName: 'Google云端硬盘',
            loginWith: '打开',
            description: '从Google云端硬盘选择威胁模型文件或目标文件夹',
            saveThreatModel: '保存威胁模型到Google云端硬盘',
            saveDescription: '选择Google云端硬盘中的文件夹来保存您的威胁模型',
            fileName: '文件名',
            fileNamePlaceholder: '输入文件名',
            selectFolder: '选择Google云端硬盘中的文件夹',
            selectFile: '从Google云端硬盘中选择文件',
            selectThreatModel: '从Google云端硬盘中选择威胁模型'
        }
    },
    dashboard: {
        welcome: {
            title: '欢迎!',
            description:
                '您已准备好开始使您的应用程序设计更加安全。您可以通过选择以下选项之一来打开现有威胁模型或创建新的威胁模型。'
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
        chooseRepo: '选择另一个源',
        or: '或者',
        addNew: '添加新分支',
        protectedBranch: '受保护的分支',
        nameRequired: '分支名称是必需的',
        nameExists: '分支名称已存在',
        refBranch: '参考分支',
        add: '添加分支',
        cancel: '取消',
        name: '分支名称'
    },
    folder: {
        select: '选择一个',
        from: '文件夹从下面列表中',
        noneFound: '此文件夹为空，您可以在此处创建新的威胁模型。'
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
        dragAndDrop: '拖放或',        jsonPaste: '在此处粘贴威胁模型的JSON',
        owner: '所有者',
        reviewer: '审稿人',
        title: '标题',
        new: {
            title: '创建新威胁模型',
            description: '输入有关新威胁模型的信息'
        },
        edit: {
            title: '编辑威胁模型',
            description: '修改有关威胁模型的信息'
        },
        placeholder: {
            title: '威胁模型标题',
            owner: '所有者名称或团队',
            description: '输入所建模系统的高级描述',
            reviewer: '审稿人名称'
        },        diagram: {
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
            save: '保存此威胁模型出错。检查开发者控制台以了解更多信息',
            googleDriveSave: '保存到Google云端硬盘时出错。请确保您拥有适当的权限。'
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
        controlButtons: {
            delete: '删除选中',
            redo: '重做',
            shortcuts: '键盘快捷键',
            toggleGrid: '切换网格',
            undo: '撤消',
            zoomIn: '放大',
            zoomOut: '缩小',
            save: '保存'
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
                action: '保存'
            }
        },
        stencil: {
            title: '形状',
            boundaries: '边界',
            components: '组件',
            entities: '实体',
            metadata: '数据',
            search: '搜索形状',
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
        export: '导出',
        exportAs: '导出模型为',
        exportHtml: 'HTML报告',
        exportPdf: 'PDF报告',
        exportTd: '原始 (Threat Dragon)',
        exportOtm: '开放威胁模型 (OTM)',
        exportFormats: {
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG'
        },
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
        previous: '上一个',
        requiredField: '必填字段'
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
            tbd: '待定',
            low: '低',
            medium: '中',
            high: '高',
            critical: '批判的'
        }
    },
    report: {
        options: {
            showOutOfScope: '显示范围外的元素',
            showMitigatedThreats: '显示已缓解的威胁',
            showModelDiagrams: '显示模型图',
            showEmpty: '显示空元素',
            showProperties: '显示元素属性',
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
            openCritical: '未解决/关键优先级',
            openHigh: '未解决/高优先级',
            openMedium: '未解决/中优先级',
            openLow: '未解决/低优先级',
            openTbd: '未解决/待定优先级',
            openUnknown: '未解决/未知优先级'
        }
    },
    pagination: {
        previous: '上一页',
        next: '下一页'
    }
};

export default zho;
