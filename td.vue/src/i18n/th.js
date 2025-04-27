const tha = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    nav: {
        v2Warning: 'โมเดลภัยคุกคามเวอร์ชัน 2.0 ไม่สามารถใช้งานร่วมกับโมเดล Threat Dragon เวอร์ชัน 1.x ได้ โมเดลเวอร์ชัน 1.x ที่นำเข้าจะถูกอัปเกรดเป็นสคีมาเวอร์ชัน 2.0',
        loggedInAs: 'เข้าสู่ระบบในชื่อ',
        logOut: 'ออกจากระบบ',
        tos: 'เงื่อนไขการให้บริการ',
        privacy: 'นโยบายความเป็นส่วนตัว'
    },
    operator: {
        heading: 'ผู้ดำเนินการ',
        operatedby: 'เว็บไซต์นี้และอินสแตนซ์ของ OWASP Threat Dragon ดำเนินการโดย:',
        name: `${process.env.VUE_APP_OPERATOR_NAME || 'ผู้ดำเนินการของเว็บไซต์นี้'}`,
        contact: 'ติดต่อ: ' + (process.env.VUE_APP_OPERATOR_CONTACT ? process.env.VUE_APP_OPERATOR_CONTACT.replace('@', ' [at] ') : '(ไม่ได้ให้ข้อมูลการติดต่อ)')
    },
    tos: {
        title: 'เงื่อนไขการให้บริการ',
        lastUpdated: '4 เมษายน 2025',
        introduction: 'ยินดีต้อนรับสู่อินสแตนซ์ OWASP Threat Dragon ของเรา เงื่อนไขการใช้งานเหล่านี้ ("เงื่อนไข") ควบคุมการเข้าถึงและการใช้งานเว็บไซต์นี้ ซึ่งเป็นอินสแตนซ์ของแอปพลิเคชันเว็บโอเพนซอร์สที่จัดทำโดยผู้ดำเนินการที่ระบุไว้ข้างต้น ("ผู้ดำเนินการ")',
        sections: [
            {
                heading: '1. การยอมรับเงื่อนไข',
                content: 'โดยการเข้าถึงและใช้งานเว็บไซต์นี้ คุณยอมรับและตกลงที่จะผูกพันตามข้อกำหนดและบทบัญญัติของข้อตกลงนี้ หากคุณไม่เห็นด้วยกับเงื่อนไขเหล่านี้ โปรดอย่าใช้เว็บไซต์นี้'
            },
            {
                heading: '2. การใช้งานเว็บไซต์',
                content: 'คุณอาจใช้เว็บไซต์เพื่อวัตถุประสงค์ที่ถูกกฎหมายเท่านั้น คุณตกลงที่จะไม่ใช้งานผิดวัตถุประสงค์ ขัดขวาง หรือพยายามเข้าถึงเว็บไซต์หรือระบบพื้นฐานโดยไม่ได้รับอนุญาต'
            },
            {
                heading: '3. ไม่มีการรับประกัน',
                content: 'เว็บไซต์นี้จัดเตรียมให้ "ตามสภาพที่เป็นอยู่" โดยไม่มีการรับประกันใดๆ ทั้งโดยชัดแจ้งหรือโดยนัย รวมถึงแต่ไม่จำกัดเพียงความเหมาะสมสำหรับวัตถุประสงค์เฉพาะ ความพร้อมใช้งาน หรือความถูกต้อง เราไม่รับประกันการทำงานที่ต่อเนื่องหรือปราศจากข้อผิดพลาด'
            },
            {
                heading: '4. ข้อจำกัดความรับผิด',
                content: 'ในขอบเขตสูงสุดที่กฎหมายอนุญาต ผู้ดำเนินการจะไม่รับผิดต่อความเสียหายทางตรง ทางอ้อม อุบัติเหตุ หรือที่เป็นผลสืบเนื่องใดๆ ที่เกิดจากการใช้งานหรือไม่สามารถใช้งานเว็บไซต์ของคุณ'
            },
            {
                heading: '5. ซอฟต์แวร์โอเพนซอร์ส',
                content: 'เว็บไซต์นี้ใช้งานซอฟต์แวร์ OWASP Threat Dragon และซอร์สโค้ดของซอฟต์แวร์นี้มีอยู่ที่ https://www.github.com/OWASP/threat-dragon การใช้งานซอฟต์แวร์ของคุณอยู่ภายใต้เงื่อนไขการอนุญาตโอเพนซอร์ส เราไม่รับผิดชอบต่อตัวซอฟต์แวร์เอง เพียงแต่การดำเนินการอินสแตนซ์นี้เท่านั้น ผู้ดำเนินการของเว็บไซต์นี้ไม่ได้เกี่ยวข้องกับ OWASP'
            },
            {
                heading: '6. การเปลี่ยนแปลงเงื่อนไข',
                content: 'ผู้ดำเนินการอาจปรับปรุงเงื่อนไขเหล่านี้ได้ตลอดเวลา การใช้งานเว็บไซต์ต่อไปหลังจากการเปลี่ยนแปลงถือเป็นการยอมรับเงื่อนไขที่ปรับปรุงแล้ว'
            },
            {
                heading: '7. การยกเลิก',
                content: 'ผู้ดำเนินการขอสงวนสิทธิ์ในการระงับหรือยกเลิกการเข้าถึงเว็บไซต์ตามดุลยพินิจของผู้ดำเนินการ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า ไม่ว่าด้วยเหตุผลใดก็ตาม'
            },
            {
                heading: '8. กฎหมายที่ใช้บังคับ',
                content: 'เงื่อนไขเหล่านี้อยู่ภายใต้กฎหมายของเขตอำนาจศาลที่ผู้ดำเนินการมีสำนักงานใหญ่ (ในกรณีขององค์กร) หรืออาศัยอยู่ (ในกรณีของบุคคล) โดยไม่คำนึงถึงหลักการขัดแย้งทางกฎหมาย'
            }
        ],
        contact: 'หากคุณมีคำถามเกี่ยวกับเงื่อนไขเหล่านี้ โปรดติดต่อผู้ดำเนินการ'
    },
    privacy: {
        title: 'นโยบายความเป็นส่วนตัว',
        lastUpdated: '4 เมษายน 2025',
        introduction: 'ผู้ดำเนินการของเว็บไซต์นี้มุ่งมั่นที่จะปกป้องความเป็นส่วนตัวของคุณ นโยบายความเป็นส่วนตัวนี้อธิบายวิธีการจัดการข้อมูลของคุณ',
        sections: [
            {
                heading: 'การใช้ข้อมูลขั้นต่ำสำหรับการดำเนินงาน',
                content: 'ผู้ดำเนินการไม่เก็บรวบรวม จัดเก็บ หรือประมวลผลข้อมูลส่วนบุคคลจากผู้ใช้เพื่อการติดตาม การสร้างโปรไฟล์ หรือการแบ่งปันกับบุคคลที่สาม บันทึกชั่วคราวซึ่งอาจรวมถึงที่อยู่ IP หรือชื่อผู้ใช้ จะถูกสร้างขึ้นเพื่อวัตถุประสงค์ในการดำเนินงานและการแก้ไขข้อบกพร่องเท่านั้น บันทึกเหล่านี้จะถูกทิ้งภายในระยะเวลาอันสั้นและไม่ถูกเก็บรักษาหรือใช้นอกเหนือจากวัตถุประสงค์ที่จำกัดเหล่านี้'
            },
            {
                heading: 'การปฏิบัติตามกฎหมาย',
                content: 'ผู้ดำเนินการจะเปิดเผยข้อมูลเฉพาะเมื่อจำเป็นต้องทำตามกฎหมายเท่านั้น เช่น ในการตอบสนองต่อคำสั่งหรือหมายเรียกของรัฐบาลที่ถูกต้อง ในกรณีดังกล่าว ผู้ดำเนินการจะปฏิบัติตามข้อผูกพันทางกฎหมายที่เกี่ยวข้อง'
            },
            {
                heading: 'การเปลี่ยนแปลงนโยบายนี้',
                content: 'ผู้ดำเนินการอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงใดๆ จะถูกโพสต์บนหน้านี้พร้อมกับวันที่ "อัปเดตล่าสุด" ที่ปรับปรุงแล้ว'
            },
            {
                heading: 'ติดต่อเรา',
                content: 'หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ โปรดติดต่อผู้ดำเนินการ'
            }
        ]
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'โลโก้ Threat Dragon',
        description: 'OWASP Threat Dragon เป็นแอปพลิเคชันฟรี โอเพนซอร์ส ข้ามแพลตฟอร์มสำหรับสร้างโมเดลภัยคุกคาม ใช้เพื่อวาดแผนภาพการจำลองภัยคุกคามและระบุภัยคุกคามสำหรับระบบของคุณ ด้วยการเน้นความยืดหยุ่นและความเรียบง่าย จึงเข้าถึงได้ง่ายสำหรับผู้ใช้ทุกประเภท'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'เริ่มต้น'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'เข้าสู่ระบบด้วย'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'เข้าสู่ระบบด้วย'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'เข้าสู่ระบบด้วย'
        },
        google: {
            displayName: 'Google',
            loginWith: 'เข้าสู่ระบบด้วย'
        },
        local: {
            displayName: 'เซสชันในเครื่อง',
            loginWith: 'เข้าสู่ระบบไปยัง'
        },
        googleDrive: {
            displayName: 'Google Drive',
            loginWith: 'เปิด',
            description: 'เลือกไฟล์โมเดลภัยคุกคามหรือโฟลเดอร์ปลายทางจาก Google Drive',
            saveThreatModel: 'บันทึกโมเดลภัยคุกคามไปยัง Google Drive',
            saveDescription: 'เลือกโฟลเดอร์ใน Google Drive เพื่อบันทึกโมเดลภัยคุกคามของคุณ',
            fileName: 'ชื่อไฟล์',
            fileNamePlaceholder: 'ป้อนชื่อสำหรับไฟล์ของคุณ',
            selectFolder: 'เลือกโฟลเดอร์ใน Google Drive',
            selectFile: 'เลือกไฟล์จาก Google Drive',
            selectThreatModel: 'เลือกโมเดลภัยคุกคามจาก Google Drive'
        }
    },
    dashboard: {
        welcome: {
            title: 'ยินดีต้อนรับ!',
            description: 'คุณพร้อมที่จะเริ่มทำให้การออกแบบแอปพลิเคชันของคุณปลอดภัยมากขึ้น คุณสามารถเปิดโมเดลภัยคุกคามที่มีอยู่หรือสร้างใหม่โดยเลือกหนึ่งในตัวเลือกด้านล่าง'
        },
        actions: {
            openExisting: 'เปิดโมเดลภัยคุกคามที่มีอยู่',
            createNew: 'สร้างโมเดลภัยคุกคามใหม่ที่ว่างเปล่า',
            readDemo: 'สำรวจโมเดลภัยคุกคามตัวอย่าง',
            importExisting: 'นำเข้าโมเดลภัยคุกคามผ่าน JSON'
        }
    },
    demo: {
        select: 'เลือกโมเดลภัยคุกคามตัวอย่างจากรายการด้านล่าง'
    },
    desktop: {
        file: {
            heading: 'ไฟล์',
            clearRecentDocs: 'ล้างเมนู',
            close: 'ปิดโมเดล',
            closeWindow: 'ปิดหน้าต่าง',
            new: 'โมเดลใหม่',
            open: 'เปิดโมเดล',
            recentDocs: 'เปิดล่าสุด',
            save: 'บันทึกโมเดล',
            saveAs: 'บันทึกโมเดลเป็น'
        },
        help: {
            heading: 'ช่วยเหลือ',
            docs: 'เอกสาร',
            visit: 'เยี่ยมชมเราที่ OWASP',
            sheets: 'แผ่นสรุป OWASP',
            github: 'เยี่ยมชมเราบน GitHub',
            submit: 'ส่งปัญหา',
            check: 'ตรวจสอบการอัปเดต...'
        }
    },
    repository: {
        select: 'เลือก',
        from: 'พื้นที่เก็บข้อมูลจากรายการด้านล่าง',
        noneFound: 'ไม่พบพื้นที่เก็บข้อมูล เพื่อเริ่มต้น สร้างพื้นที่เก็บข้อมูลใหม่บน'
    },
    branch: {
        select: 'เลือกสาขาจาก',
        from: 'จากรายการด้านล่างหรือ',
        chooseRepo: 'เลือกพื้นที่เก็บข้อมูลอื่น',
        or: 'หรือ',
        addNew: 'เพิ่มสาขาใหม่',
        protectedBranch: 'สาขาที่ได้รับการป้องกัน',
        refBranch: 'สาขาอ้างอิง',
        nameRequired: 'ต้องระบุชื่อสาขา',
        nameExists: 'ชื่อสาขามีอยู่แล้ว',
        add: 'เพิ่มสาขา',
        cancel: 'ยกเลิก',
        name: 'ชื่อสาขา'
    },
    folder: {
        select: 'เลือก',
        from: 'โฟลเดอร์จากรายการด้านล่าง',
        noneFound: 'โฟลเดอร์นี้ว่างเปล่า คุณสามารถสร้างโมเดลภัยคุกคามใหม่ที่นี่'
    },
    threatmodelSelect: {
        select: 'เลือกโมเดลภัยคุกคามจาก',
        from: 'จากรายการด้านล่าง หรือเลือกอื่น',
        branch: 'สาขา',
        or: 'หรือ',
        repo: 'พื้นที่เก็บข้อมูล',
        newThreatModel: 'สร้างโมเดลภัยคุกคามใหม่'
    },
    threatmodel: {
        contributors: 'ผู้มีส่วนร่วม',
        contributorsPlaceholder: 'เริ่มพิมพ์เพื่อเพิ่มผู้มีส่วนร่วม',
        description: 'คำอธิบายระบบระดับสูง',
        dragAndDrop: 'ลากและวาง หรือ ',
        jsonPaste: 'วางไฟล์ JSON โมเดลภัยคุกคามหรือวางเนื้อหาที่นี่:',
        owner: 'เจ้าของ',
        reviewer: 'ผู้ตรวจสอบ',
        title: 'ชื่อเรื่อง',
        new: {
            title: 'สร้างโมเดลภัยคุกคามใหม่',
            description: 'ป้อนข้อมูลเกี่ยวกับโมเดลภัยคุกคามใหม่ของคุณ'
        },
        edit: {
            title: 'แก้ไขโมเดลภัยคุกคาม',
            description: 'แก้ไขข้อมูลเกี่ยวกับโมเดลภัยคุกคามของคุณ'
        },
        placeholder: {
            title: 'ชื่อโมเดลภัยคุกคาม',
            owner: 'ชื่อเจ้าของหรือทีม',
            description: 'ป้อนคำอธิบายระดับสูงของระบบที่กำลังจำลอง',
            reviewer: 'ชื่อผู้ตรวจสอบ'
        },
        diagram: {
            diagrams: 'แผนภาพ',
            addNewDiagram: 'เพิ่มแผนภาพใหม่...',
            generic: {
                defaultTitle: 'แผนภาพทั่วไปใหม่',
                defaultDescription: 'คำอธิบายแผนภาพทั่วไปใหม่',
                select: 'ทั่วไป'
            },
            stride: {
                defaultTitle: 'แผนภาพ STRIDE ใหม่',
                defaultDescription: 'คำอธิบายแผนภาพ STRIDE ใหม่',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'แผนภาพ LINDDUN ใหม่',
                defaultDescription: 'คำอธิบายแผนภาพ LINDDUN ใหม่',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'แผนภาพ PLOT4ai ใหม่',
                defaultDescription: 'คำอธิบายแผนภาพ PLOT4ai ใหม่',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'แผนภาพ DIE ใหม่',
                defaultDescription: 'คำอธิบายแผนภาพ DIE ใหม่',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'แผนภาพ CIA ใหม่',
                defaultDescription: 'คำอธิบายแผนภาพ CIA ใหม่',
                select: 'CIA'
            }
        },
        threats: 'ภัยคุกคาม',
        errors: {
            dropSingleFileOnly: 'การลากและวางต้องใช้ไฟล์เดียว',
            invalidJson: 'JSON ไม่ถูกต้อง โปรดตรวจสอบโมเดลของคุณและลองอีกครั้ง',
            onlyJsonAllowed: 'รองรับเฉพาะไฟล์ที่ลงท้ายด้วย .json เท่านั้น',
            open: 'เกิดข้อผิดพลาดในการเปิดโมเดลภัยคุกคามนี้ ตรวจสอบคอนโซลนักพัฒนาสำหรับข้อมูลเพิ่มเติม',
            save: 'เกิดข้อผิดพลาดในการบันทึกโมเดลภัยคุกคาม ตรวจสอบคอนโซลนักพัฒนาสำหรับข้อมูลเพิ่มเติม',
            googleDriveSave: 'เกิดข้อผิดพลาดในการบันทึกไปยัง Google Drive ตรวจสอบให้แน่ใจว่าคุณมีสิทธิ์ที่เหมาะสม'
        },
        localFilePicker: {
            title: 'เลือกไฟล์โมเดลภัยคุกคาม',
            noFiles: 'ไม่มีไฟล์ในไดเรกทอรีนี้',
            errors: {
                loadDirectory: 'เกิดข้อผิดพลาดในการโหลดไดเรกทอรี โปรดลองอีกครั้ง'
            }
        },
        opened: 'เปิดโมเดลภัยคุกคามสำเร็จแล้ว',
        saved: 'บันทึกโมเดลภัยคุกคามสำเร็จแล้ว',
        properties: {
            title: 'คุณสมบัติ',
            emptyState: 'เลือกองค์ประกอบบนกราฟเพื่อแก้ไข',
            name: 'ชื่อ',
            text: 'ข้อความ',
            description: 'คำอธิบาย',
            outOfScope: 'นอกขอบเขต',
            bidirection: 'สองทิศทาง',
            reasonOutOfScope: 'เหตุผลที่อยู่นอกขอบเขต',
            handlesCardPayment: 'การชำระเงินด้วยบัตร',
            handlesGoodsOrServices: 'สินค้าหรือบริการ',
            isALog: 'เป็นบันทึก',
            isEncrypted: 'เข้ารหัส',
            isSigned: 'ลงนาม',
            isWebApplication: 'เว็บแอปพลิเคชัน',
            privilegeLevel: 'ระดับสิทธิ์',
            providesAuthentication: 'ให้การตรวจสอบสิทธิ์',
            protocol: 'โปรโตคอล',
            publicNetwork: 'เครือข่ายสาธารณะ',
            storesCredentials: 'เก็บข้อมูลประจำตัว',
            storesInventory: 'เก็บสินค้าคงคลัง'
        },
        controlButtons: {
            delete: 'ลบที่เลือก',
            redo: 'ทำซ้ำการแก้ไข',
            shortcuts: 'ปุ่มลัดแป้นพิมพ์',
            toggleGrid: 'สลับตาราง',
            undo: 'เลิกทำการแก้ไข',
            zoomIn: 'ขยาย',
            zoomOut: 'ย่อ',
            save: 'บันทึก'
        },
        shortcuts: {
            title: 'ปุ่มลัด',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'คัดลอก'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'วาง'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'เลิกทำ'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'ทำซ้ำ'
            },
            delete: {
                shortcut: 'del',
                action: 'ลบ'
            },
            pan: {
                shortcut: 'shift + คลิกซ้าย (กดค้าง/ลาก)',
                action: 'เลื่อน'
            },
            multiSelect: {
                shortcut: 'คลิกซ้ายบนพื้นที่ว่างและลาก',
                action: 'เลือกหลายรายการ'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + ล้อเลื่อนเมาส์',
                action: 'ซูม'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'บันทึก'
            }
        },
        stencil: {
            title: 'รูปร่าง',
            boundaries: 'ขอบเขต',
            components: 'ส่วนประกอบ',
            entities: 'เอนทิตี',
            metadata: 'เมตาดาต้า',
            search: 'ค้นหารูปร่าง',
            notFound: 'เรายังไม่มีสิ่งนี้ ต้องการเปิดปัญหาหรือไม่? :)'
        },
        shapes: {
            actor: 'ผู้กระทำ',
            flow: 'การไหลของข้อมูล',
            flowStencil: 'การไหลของข้อมูล',
            process: 'กระบวนการ',
            store: 'ที่เก็บข้อมูล',
            text: 'ข้อความอธิบาย',
            trustBoundary: 'ขอบเขตความไว้วางใจ'
        }
    },
    forms: {
        apply: 'นำไปใช้',
        cancel: 'ยกเลิก',
        close: 'ปิด',
        closeModel: 'ปิดโมเดล',
        create: 'สร้าง',
        delete: 'ลบ',
        discardTitle: 'ทิ้งการเปลี่ยนแปลง?',
        discardMessage: 'คุณแน่ใจหรือไม่ว่าต้องการทิ้งการเปลี่ยนแปลงของคุณ?',
        edit: 'แก้ไข',
        export: 'ส่งออก',
        exportAs: 'ส่งออกโมเดลเป็น',
        exportHtml: 'รายงาน HTML',
        exportPdf: 'รายงาน PDF',
        exportTd: 'ต้นฉบับ (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        exportFormats: {
            png: 'PNG',
            jpeg: 'JPEG',
            svg: 'SVG'
        },
        import: 'นำเข้า',
        ok: 'ตกลง',
        open: 'เปิด',
        openModel: 'เปิดโมเดล',
        print: 'พิมพ์',
        reload: 'โหลดใหม่',
        remove: 'ลบออก',
        report: 'รายงาน',
        save: 'บันทึก',
        saveAs: 'บันทึกเป็น',
        saveModel: 'บันทึกโมเดล',
        saveModelAs: 'บันทึกโมเดลเป็น',
        search: 'ค้นหา',
        next: 'ถัดไป',
        previous: 'ก่อนหน้า',
        requiredField: 'ฟิลด์ที่จำเป็น'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'การรักษาความลับ',
                integrity: 'ความถูกต้องสมบูรณ์',
                availability: 'ความพร้อมใช้งาน'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'กระจาย',
                immutable: 'ไม่เปลี่ยนแปลง',
                ephemeral: 'ชั่วคราว'
            },
            linddun: {
                header: '--- LINDDUN ---',
                linkability: 'ความสามารถในการเชื่อมโยง',
                identifiability: 'ความสามารถในการระบุตัวตน',
                nonRepudiation: 'การไม่สามารถปฏิเสธได้',
                detectability: 'ความสามารถในการตรวจจับ',
                disclosureOfInformation: 'การเปิดเผยข้อมูล',
                unawareness: 'การไม่ตระหนักรู้',
                nonCompliance: 'การไม่ปฏิบัติตาม'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'เทคนิคและกระบวนการ',
                accessibility: 'การเข้าถึง',
                identifiabilityLinkability: 'ความสามารถในการระบุตัวตนและการเชื่อมโยง',
                security: 'ความปลอดภัย',
                safety: 'ความปลอดภัย',
                unawareness: 'การไม่ตระหนักรู้',
                ethicsHumanRights: 'จริยธรรมและสิทธิมนุษยชน',
                nonCompliance: 'การไม่ปฏิบัติตาม'
            },
            stride: {
                header: '--- STRIDE ---',
                spoofing: 'การปลอมแปลง',
                tampering: 'การแก้ไขข้อมูล',
                repudiation: 'การปฏิเสธ',
                informationDisclosure: 'การเปิดเผยข้อมูล',
                denialOfService: 'การปฏิเสธการให้บริการ',
                elevationOfPrivilege: 'การยกระดับสิทธิ์'
            }
        },
        generic: {
            default: 'ภัยคุกคามทั่วไปใหม่',
            cia: 'ภัยคุกคาม CIA ใหม่',
            die: 'ภัยคุกคาม DIE ใหม่',
            linddun: 'ภัยคุกคาม LINDDUN ใหม่',
            plot4ai: 'ภัยคุกคาม PLOT4ai ใหม่',
            stride: 'ภัยคุกคาม STRIDE ใหม่'
        },
        new: 'ภัยคุกคามใหม่',
        edit: 'แก้ไขภัยคุกคาม',
        confirmDeleteTitle: 'ยืนยันการลบ',
        confirmDeleteMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบภัยคุกคามนี้?',
        description: 'ให้คำอธิบายสำหรับภัยคุกคามนี้',
        emptyThreat: 'เลือกองค์ประกอบบนกราฟเพื่อเพิ่มภัยคุกคาม',
        mitigation: 'ให้การบรรเทาสำหรับภัยคุกคามนี้หรือเหตุผลหากสถานะเป็น N/A',
        newThreat: 'ภัยคุกคามใหม่',
        newThreatByType: 'ภัยคุกคามใหม่ตามประเภท',
        newThreatByContext: 'ภัยคุกคามใหม่ตามบริบท',
        properties: {
            description: 'คำอธิบาย',
            mitigation: 'การบรรเทา',
            modelType: 'ประเภทโมเดล',
            number: 'หมายเลข',
            priority: 'ความสำคัญ',
            score: 'คะแนน',
            status: 'สถานะ',
            title: 'ชื่อเรื่อง',
            type: 'ประเภท'
        },
        status: {
            notApplicable: 'ไม่เกี่ยวข้อง',
            open: 'เปิด',
            mitigated: 'บรรเทาแล้ว'
        },
        priority: {
            tbd: 'รอกำหนด',
            low: 'ต่ำ',
            medium: 'ปานกลาง',
            high: 'สูง',
            critical: 'วิกฤต'
        }
    },
    report: {
        options: {
            showOutOfScope: 'แสดงองค์ประกอบนอกขอบเขต',
            showMitigatedThreats: 'แสดงภัยคุกคามที่บรรเทาแล้ว',
            showModelDiagrams: 'แสดงแผนภาพโมเดล',
            showEmpty: 'แสดงองค์ประกอบที่ว่างเปล่า',
            showProperties: 'แสดงคุณสมบัติขององค์ประกอบ',
            showBranding: 'โลโก้ Threat Dragon'
        },
        title: 'รายงานโมเดลภัยคุกคามสำหรับ',
        dateGenerated: 'วันที่สร้าง',
        executiveSummary: 'บทสรุปผู้บริหาร',
        notProvided: 'ไม่ได้ให้ไว้',
        summary: 'สรุป',
        threatStats: {
            total: 'ภัยคุกคามทั้งหมด',
            mitigated: 'บรรเทาทั้งหมด',
            notMitigated: 'ไม่ได้บรรเทา',
            openCritical: 'เปิด / ความสำคัญวิกฤต',
            openHigh: 'เปิด / ความสำคัญสูง',
            openMedium: 'เปิด / ความสำคัญปานกลาง',
            openLow: 'เปิด / ความสำคัญต่ำ',
            openTbd: 'เปิด / ความสำคัญรอกำหนด',
            openUnknown: 'เปิด / ความสำคัญไม่ทราบ'
        }
    },
    pagination: {
        previous: 'ก่อนหน้า',
        next: 'ถัดไป'
    }
};

export default tha;