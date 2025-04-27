const hin = {
    auth: {
        sessionExpired: 'आपका सत्र समाप्त हो गया है। कृपया जारी रखने के लिए फिर से लॉग इन करें।'
    },
    nav: {
        v2Warning:
            'संस्करण 2.0 खतरा मॉडल संस्करण 1.x थ्रेट ड्रैगन मॉडल के साथ पीछे की ओर संगत नहीं हैं। आयातित संस्करण 1.x मॉडल को संस्करण 2.0 स्कीमा में अपग्रेड किया जाएगा',
        loggedInAs: 'लॉग-इन किया गया है भूमिका में',
        logOut: 'लॉगआउट'
    },
    home: {
        title: 'OWASP थ्रेट ड्रैगन',
        imgAlt: 'थ्रेट ड्रैगन प्रतीक चिन्ह',
        description:
            'OWASP थ्रेट ड्रैगन खतरा मॉडल बनाने के लिए एक मुफ्त, ओपन-सोर्स, क्रॉस-प्लेटफॉर्म एप्लिकेशन है। अपने सिस्टम के लिए खतरा मॉडलिंग आरेख बनाने और खतरों की पहचान करने के लिए इसका उपयोग करें। लचीलेपन और सरलता पर जोर देने के साथ यह सभी प्रकार के उपयोगकर्ताओं के लिए आसानी से सुलभ है।'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Start'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'से लोगिन करें'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'से लोगिन करें'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'से लोगिन करें'
        },
        google: {
            displayName: 'Google',
            loginWith: 'से लोगिन करें'
        },
        local: {
            displayName: 'स्थानीय सत्र',
            loginWith: 'से लोगिन करें'
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'खोलें',
            description: 'Google Drive से थ्रेट मॉडल फ़ाइल या गंतव्य फ़ोल्डर का चयन करें',
            saveThreatModel: 'थ्रेट मॉडल को Google Drive पर सहेजें',
            saveDescription: 'अपने थ्रेट मॉडल को सहेजने के लिए Google Drive में एक फ़ोल्डर चुनें',
            fileName: 'फ़ाइल का नाम',
            fileNamePlaceholder: 'अपनी फ़ाइल के लिए एक नाम दर्ज करें',
            selectFolder: 'Google Drive में एक फ़ोल्डर चुनें',
            selectFile: 'Google Drive से एक फ़ाइल चुनें',
            selectThreatModel: 'Google Drive से एक थ्रेट मॉडल चुनें'
        }
    },
    dashboard: {
        welcome: {
            title: 'स्वागत!',
            description:
                'आप अपने एप्लिकेशन डिज़ाइन को और अधिक सुरक्षित बनाने के लिए तैयार हैं। आप नीचे दिए गए विकल्पों में से किसी एक को चुनकर मौजूदा थ्रेट मॉडल खोल सकते हैं या नया बना सकते हैं।'
        },
        actions: {
            openExisting: 'एक मौजूदा थ्रेट मॉडल खोलें',
            createNew: 'एक नया, खाली थ्रेट मॉडल बनाएँ',
            readDemo: 'एक नमूना थ्रेट मॉडल का अन्वेषण करें',
            importExisting: 'JSON के माध्यम से एक थ्रेट मॉडल आयात करें'
        }
    },
    demo: {
        select: 'नीचे दी गई सूची से एक डेमो थ्रेट मॉडल चुनें'
    },
    desktop: {
        file: {
            heading: 'फ़ाइल',
            clearRecentDocs: 'मेनू हटाएं',
            close: 'क्लोज मॉडल',
            closeWindow: 'विंडो बंद करें',
            new: 'नया मॉडल',
            open: 'ओपन मॉडल',
            recentDocs: 'नवीनतम खोलें',
            save: 'मॉडल सहेजें',
            saveAs: 'मॉडल को इस रूप में सहेजें'
        },
        help: {
            heading: 'सहायता',
            docs: 'दस्तावेज़ीकरण',
            visit: 'हमसे OWASP पर मिलें',
            sheets: 'OWASP चीट शीट्स',
            github: 'GitHub पर हमसे मिलें',
            submit: 'कोई समस्या सबमिट करें',
            check: 'अपडेट के लिए जांचें ...'
        }
    },
    repository: {
        select: 'एक चुनें',
        from: 'नीचे दी गई सूची से रिपॉजिटरी',
        noneFound: 'कोई भंडार नहीं मिला। आरंभ करने के लिए, पर एक नया भंडार बनाएँ'
    },
    branch: {
        select: 'से एक शाखा का चयन करें',
        from: 'नीचे दी गई सूची से या',
        chooseRepo: 'एक और रेपो चुनें',
        or: 'या',
        addNew: 'नई शाखा जोड़ें',
        protectedBranch: 'संरक्षित शाखा',
        nameRequired: 'एक नाम आवश्यक है',
        nameExists: 'एक शाखा इस नाम से पहले ही मौजूद है',
        refBranch: 'आधार शाखा',
        add: 'शाखा जोडे',
        cancel: 'रद्द करें',
        name: 'शाखा का नाम'
    },
    folder: {
        select: 'एक चुनें',
        from: 'नीचे दी गई सूची से फ़ोल्डर',
        noneFound: 'यह फ़ोल्डर खाली है। आप यहां एक नया थ्रेट मॉडल बना सकते हैं।'
    },
    threatmodelSelect: {
        select: 'से एक थ्रेट मॉडल का चयन करें',
        from: 'नीचे दी गई सूची से, या कोई अन्य चुनें',
        branch: 'शाखा',
        or: 'या',
        repo: 'रेपो',
        newThreatModel: 'एक नया थ्रेट मॉडल बनाएं'
    },
    threatmodel: {
        contributors: 'योगदानकर्ता',
        contributorsPlaceholder: 'योगदानकर्ता जोड़ने के लिए टाइप करना प्रारंभ करें',
        description: 'उच्च स्तरीय सिस्टम विवरण',
        dragAndDrop: 'खींचें और छोड़ें या',        jsonPaste: 'थ्रेट का मॉडल JSON फाइल छोड़ें या इसकी सामग्री यहां पेस्ट करें:',
        owner: 'मालिक',
        reviewer: 'समीक्षक',
        title: 'शीर्षक',
        diagram: {
            diagrams: 'चित्',
            addNewDiagram: 'एक नया चित्र जोड़ें...',
            generic: {
                defaultTitle: 'न्यू जेनेरिक डायग्राम',
                defaultDescription: 'न्यू जेनरिक डायग्राम डिस्क्रिप्शन',
                select: 'जेनेरिक'
            },
            stride: {
                defaultTitle: 'न्यू स्ट्राइड डायग्राम',
                defaultDescription: 'न्यू स्ट्राइड डायग्राम डिस्क्रिप्शन',
                select: 'स्ट्राइड'
            },
            linddun: {
                defaultTitle: 'न्यू लिंडन डायग्राम',
                defaultDescription: 'न्यू लिंडडन डायग्राम डिस्क्रिप्शन',
                select: 'लिंडडन'
            },
            plot4ai: {
                defaultTitle: 'नया PLOT4ai आरेख',
                defaultDescription: 'नया PLOT4ai आरेख विवरण',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'नया DIE आरेख',
                defaultDescription: 'नया DIE आरेख विवरण',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'न्यू सीआईए डायग्राम',
                defaultDescription: 'नई सीआईए डायग्राम डिस्क्रिप्शन',
                select: 'सीआईए'
            }
        },
        threats: 'थ्रेटस',
        errors: {
            dropSingleFileOnly: 'ड्रैग एंड ड्रॉप के लिए एक फ़ाइल की आवश्यकता होती है।',
            invalidJson: 'अवैध JSON. कृपया अपने मॉडल की जाँच करें और पुनः प्रयास करें।',
            onlyJsonAllowed: 'केवल .json के साथ समाप्त होने वाली फ़ाइलें समर्थित हैं।',
            open: 'इस थ्रेट मॉडल को खोलने में त्रुटि। अधिक जानकारी के लिए डेवलपर कंसोल की जाँच करें',
            save: 'खतरे के मॉडल को सहेजने में त्रुटि। अधिक जानकारी के लिए डेवलपर कंसोल की जाँच करें'
        },
        opened: 'थ्रेट मॉडल सफलतापूर्वक खोला गया',
        saved: 'थ्रेट मॉडल सफलतापूर्वक सहेजा गया',
        properties: {
            title: 'गुण',
            emptyState: 'संपादित करने के लिए ग्राफ़ पर एक तत्व का चयन करें',
            name: 'नाम',
            text: 'टेक्स्ट',
            description: 'विवरण',
            outOfScope: 'आउट ऑफ स्कोप',
            bidirection: 'द्विदिशीय',
            reasonOutOfScope: 'दायरे से बाहर होने का कारण',
            handlesCardPayment: 'कार्ड भुगतान',
            handlesGoodsOrServices: 'सामान या सेवाएँ',
            isALog: 'एक लॉग है',
            isEncrypted: 'एन्क्रिप्टेड',
            isSigned: 'हस्ताक्षरित',
            isWebApplication: 'Web Application',
            privilegeLevel: 'विशेषाधिकार स्तर',
            providesAuthentication: 'प्रमाणीकरण प्रदान करता है',
            protocol: 'प्रोटोकॉल',
            publicNetwork: 'सार्वजनिक नेटवर्क',
            storesCredentials: 'स्टोर क्रेडेंशियल',
            storesInventory: 'Stores Inventory'
        },
        controlButtons: {
            delete: 'चयनित हटाएं',
            redo: 'फिर से संपादित करें',
            shortcuts: 'कीबोर्ड शॉर्टकट',
            toggleGrid: 'टॉगल ग्रिड',
            undo: 'संपादन पूर्ववत करें',
            zoomIn: 'ज़ूम इन',
            zoomOut: 'ज़ूम आउट',
            save: 'सहेजें'
        },
        shortcuts: {
            title: 'शॉर्टकट',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'कॉपी'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'चिपकाएँ'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'पूर्ववत करें'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'फिर से करें'
            },
            delete: {
                shortcut: 'del',
                action: 'हटाएं'
            },
            pan: {
                shortcut: 'shift + left-click (hold/drag)',
                action: 'पैन'
            },
            multiSelect: {
                shortcut: 'खाली जगह पर बायाँ-क्लिक करें और खींचें',
                action: 'बहु-चयन'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + mousewheel',
                action: 'ज़ूम'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'सहेजें'
            }
        },
        stencil: {
            boundaries: 'सीमाएं',
            components: 'घटक',
            entities: 'संस्थाएँ',
            metadata: 'मेटाडेटा',
            search: 'खोज',
            notFound: 'हमारे पास अभी तक वह नहीं है, कोई मुद्दा खोलना चाहते हैं? :)'
        },
        shapes: {
            actor: 'अभिनेता',
            flow: 'डेटा प्रवाह',
            flowStencil: 'डेटा प्रवाह',
            process: 'प्रक्रिया',
            store: 'स्टोर',
            text: 'वर्णनात्मक पाठ',
            trustBoundary: 'ट्रस्ट बाउंड्री'
        }
    },
    forms: {
        apply: 'लागू करें',
        cancel: 'रद्द करें',
        close: 'बंद करें',
        closeModel: 'क्लोजमॉडल',
        delete: 'हटाएं',
        discardTitle: 'परिवर्तनों को त्यागें?',
        discardMessage: 'क्या आप सुनिश्चित हैं कि आप अपने परिवर्तनों को खारिज करना चाहते हैं?',
        edit: 'संपादित करें',
        exportAs: 'मॉडल को निर्यात करें जैसे',
        exportHtml: 'HTML रिपोर्टें',
        exportPdf: 'पीडीएफ रिपोर्टें',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'आयात',
        ok: 'ठीक है',
        open: 'खुला',
        openModel: 'ओपन मॉडल',
        print: 'प्रिंट',
        reload: 'पुनः लोड करें',
        remove: 'निकालें',
        report: 'रिपोर्ट',
        save: 'सहेजें',
        saveAs: 'इस रूप में सहेजें',
        saveModel: 'मॉडल सेव करें',
        saveModelAs: 'मॉडल को इस रूप में सहेजें',
        search: 'खोज',
        next: 'अगला',
        previous: 'पहले का',
        requiredField: 'आवश्यक फ़ील्ड'
    },
    threats: {
        model: {
            cia: {
                header: '--- सीआईए ---',
                confidentiality: 'गोपनीयता',
                integrity: 'ईमानदारी',
                availability: 'उपलब्धता'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'वितरित',
                immutable: 'अपरिवर्तनीय',
                ephemeral: 'क्षणिक'
            },
            linddun: {
                header: '--- लिंडडन ---',
                linkability: 'लिंक करने की क्षमता',
                identifiability: 'पहचान',
                nonRepudiation: 'अप्रतिबंध',
                detectability: 'डिटेक्टेबिलिटी',
                disclosureOfInformation: 'सूचना का प्रकटीकरण',
                unawareness: 'अनभिज्ञता',
                nonCompliance: 'गैर-अनुपालन'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'तकनीक और प्रक्रियाएँ',
                accessibility: 'सुलभता',
                identifiabilityLinkability: 'पहचान योग्यता और संबंधनीयता',
                security: 'सुरक्षा',
                safety: 'सुरक्षा',
                unawareness: 'अनजानी',
                ethicsHumanRights: 'नैतिकता और मानवाधिकार',
                nonCompliance: 'अनुपालन न करना'
            },
            stride: {
                header: '--- स्ट्राइड ---',
                spoofing: 'स्पूफिंग',
                tampering: 'छेड़छाड़',
                repudiation: 'अस्वीकृति',
                informationDisclosure: 'सूचना प्रकटीकरण',
                denialOfService: 'सेवा से इनकार',
                elevationOfPrivilege: 'विशेषाधिकार का उन्नयन'
            }
        },
        generic: {
            default: 'नया सामान्य थ्रेट',
            cia: 'नया सीआईए थ्रेट',
            die: 'नया DIE थ्रेट',
            linddun: 'न्यू लिंडडन थ्रेट',
            plot4ai: 'नया DPLOT4ai थ्रेट',
            stride: 'नया स्ट्राइड थ्रेट'
        },
        edit: 'थ्रेट संपादित करें',
        confirmDeleteTitle: 'हटाने की पुष्टि करें',
        confirmDeleteMessage: 'क्या आप सुनिश्चित हैं कि आप वास्तव में इस खतरे को हटाना चाहते हैं?',
        description: 'इस खतरे के लिए एक विवरण प्रदान करें',
        emptyThreat: 'थ्रेट जोड़ने के लिए ग्राफ पर एक तत्व का चयन करें',
        mitigation: 'इस खतरे के लिए शमन या रोकथाम प्रदान करें',
        newThreat: 'नया थ्रेट',
        newThreatByType: 'टाइप द्वारा नया थ्रेट',
        newThreatByContext: 'संदर्भ के अनुसार थ्रेट',
        properties: {
            description: 'विवरण',
            mitigation: 'शमन',
            modelType: 'मॉडल प्रकार',
            number: 'नंबर',
            priority: 'प्राथमिकता',
            score: 'स्कोर',
            status: 'स्थिति',
            title: 'शीर्षक',
            type: 'प्रकार'
        },
        status: {
            notApplicable: 'लागू नहीं',
            open: 'खुला',
            mitigated: 'शमन'
        },
        priority: {
            tbd: 'टीबीए',
            low: 'कम',
            medium: 'मध्यम',
            high: 'ऊँचा',
            critical: 'गंभीर'
        }
    },
    report: {
        options: {
            showOutOfScope: 'दायरे से बाहर के तत्व दिखाएं',
            showMitigatedThreats: 'कम किए गए खतरे दिखाएं',
            showModelDiagrams: 'मॉडल आरेख दिखाएं',
            showEmpty: 'खाली तत्व दिखाएं',
            showProperties: 'तत्व गुण दिखाएं',
            showBranding: 'शो थ्रेट ड्रैगन ब्रांडिंग'
        },
        title: 'के लिए थ्रेट मॉडल रिपोर्ट',
        dateGenerated: 'तारीख उत्पन्न',
        executiveSummary: 'कार्यकारी सारांश',
        notProvided: 'प्रदान नहीं किया गया',
        summary: 'सारांश',
        threatStats: {
            total: 'कुल खतरे',
            mitigated: 'कुल शमन',
            notMitigated: 'कम नहीं किया गया',
            openCritical: 'ओपन / महत्वपूर्ण प्राथमिकता',
            openHigh: 'ओपन / हाई प्रायोरिटी',
            openMedium: 'ओपन / मीडियम प्रायोरिटी',
            openLow: 'ओपन / लो प्रायोरिटी',
            openTbd: 'ओपन / टीबीए प्राथमिकता',
            openUnknown: 'खुला / अज्ञात प्राथमिकता'
        }
    }
};

export default hin;
