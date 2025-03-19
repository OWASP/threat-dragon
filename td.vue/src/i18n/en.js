const eng = {
    auth: {
        sessionExpired: 'Your session has expired. Please log in again to continue.'
    },
    nav: {
        v2Warning: 'Version 2.0 threat models are not backwardly compatible with version 1.x Threat Dragon models. Imported version 1.x models will be upgraded to the version 2.0 schema',
        loggedInAs: 'Logged in as',
        logOut: 'Log out',
        tos: 'Terms of Service',
        privacy: 'Privacy Policy'
    },
    tos: {
        title: 'Terms of Service',
        content: `<h2>Terms of Service</h2>
<p>Welcome to OWASP Threat Dragon. By using our application, you agree to these Terms of Service.</p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing and using OWASP Threat Dragon, you accept and agree to be bound by the terms and provisions of this agreement.</p>

<h2>2. Description of Service</h2>
<p>OWASP Threat Dragon is a free, open-source threat modeling tool that helps you create threat model diagrams and identify threats to your system.</p>

<h2>3. License and Restrictions</h2>
<p>OWASP Threat Dragon is released under the Apache 2.0 License. You are free to:</p>
<ul>
  <li>Use the application for personal or commercial purposes</li>
  <li>Modify the application</li>
  <li>Distribute the application</li>
</ul>
<p>Subject to the terms and conditions of the Apache 2.0 License.</p>

<h2>4. User Responsibilities</h2>
<p>You are responsible for:</p>
<ul>
  <li>All activity that occurs under your account</li>
  <li>Maintaining the confidentiality of your account information</li>
  <li>The content of your threat models</li>
</ul>

<h2>5. No Warranty</h2>
<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.</p>

<h2>6. Limitation of Liability</h2>
<p>IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>

<h2>7. Modifications to Terms</h2>
<p>We reserve the right to modify these Terms at any time. Your continued use of the application after such modifications constitutes your acceptance of the modified terms.</p>

<h2>8. Governing Law</h2>
<p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which OWASP operates, without regard to its conflict of law provisions.</p>

<h2>9. Contact</h2>
<p>If you have any questions about these Terms, please contact us through the OWASP Threat Dragon GitHub repository.</p>

<p>Last updated: March 19, 2025</p>`
    },
    privacy: {
        title: 'Privacy Policy',
        content: `<h2>Overview</h2>
<p>OWASP Threat Dragon is committed to protecting your privacy. This application is designed to respect your data and keep you in control.</p>

<h2>Data Collection</h2>
<p>Threat Dragon does not:</p>
<ul>
  <li>Track or collect personal information</li>
  <li>Store user behavior data</li>
  <li>Utilize cookies or tracking technologies</li>
  <li>Sell or share any user information</li>
</ul>

<h2>Authentication</h2>
<p>When using Google authentication, we only receive basic profile information necessary for authentication purposes. This information is not stored on our servers or shared with any third parties.</p>

<h2>Your Threat Models</h2>
<ul>
  <li>All threat model data created within the application remains under your control</li>
  <li>Your data is only stored locally or in repositories that you explicitly authorize</li>
  <li>We have no access to your threat model content</li>
</ul>

<h2>Data Security</h2>
<p>We implement appropriate security measures to ensure the safety of any data that passes through our systems, although we do not retain this data.</p>

<h2>Changes to This Policy</h2>
<p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>

<h2>Contact</h2>
<p>If you have questions about this Privacy Policy, please contact us through the OWASP Threat Dragon GitHub repository.</p>

<p>Last updated: March 19, 2025</p>`
    },
    home: {
        title: 'OWASP Threat Dragon',
        imgAlt: 'Threat Dragon Logo',
        description: 'OWASP Threat Dragon is a free, open-source, cross-platform application for creating threat models. Use it to draw threat modeling diagrams and to identify threats for your system. With an emphasis on flexibility and simplicity it is easily accessible for all types of users.'
    },
    providers: {
        desktop: {
            displayName: 'Threat Dragon',
            loginWith: 'Start'
        },
        github: {
            displayName: 'GitHub',
            loginWith: 'Login with'
        },
        gitlab: {
            displayName: 'GitLab',
            loginWith: 'Login with'
        },
        bitbucket: {
            displayName: 'Bitbucket',
            loginWith: 'Login with'
        },
        google: {
            displayName: 'Google',
            loginWith: 'Login with'
        },
        local: {
            displayName: 'Local Session',
            loginWith: 'Login to'
        }
    },
    dashboard: {
        welcome: {
            title: 'Welcome!',
            description: 'You\'re ready to start making your application designs more secure. You can open an existing threat model or create a new one by choosing one of the options below. '
        },
        actions: {
            openExisting: 'Open an existing threat model',
            createNew: 'Create a new, empty threat model',
            readDemo: 'Explore a sample threat model',
            importExisting: 'Import a threat model via JSON'
        }
    },
    demo: {
        select: 'Select a demo threat model from the list below'
    },
    desktop: {
        file: {
            heading: 'File',
            clearRecentDocs: 'Clear Menu',
            close: 'Close Model',
            closeWindow: 'Close Window',
            new: 'New Model',
            open: 'Open Model',
            recentDocs: 'Open Recent',
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
        select: 'Select a',
        from: 'repository from the list below',
        noneFound: 'No repositories found. To get started, create a new repository on'
    },
    branch: {
        select: 'Select a branch from',
        from: 'from the list below or',
        chooseRepo: 'choose another repo',
        or: 'or',
        addNew: 'add a new branch',
        protectedBranch: 'Protected branch',
        refBranch: 'Reference branch',
        nameRequired: 'Branch name is required',
        nameExists: 'Branch name already exists',
        add: 'add branch',
        cancel: 'Cancel',
        name: 'branch name',
    },
    folder: {
        select: 'Select a',
        from: 'folder from the list below',
        noneFound: 'This folder is empty, You can create a new threat model here.'
    },
    threatmodelSelect: {
        select: 'Select a Threat Model from',
        from: 'from the list below, or choose another',
        branch: 'branch',
        or: 'or',
        repo: 'repo',
        newThreatModel: 'Create a New Threat Model'
    },
    threatmodel: {
        contributors: 'Contributors',
        contributorsPlaceholder: 'Start typing to add a contributor',
        description: 'High level system description',
        dragAndDrop: 'Drag and drop or ',
        editing: 'Editing',
        jsonPaste: 'Drop a threat model JSON file or paste its content here:',
        owner: 'Owner',
        reviewer: 'Reviewer',
        title: 'Title',
        diagram: {
            diagrams: 'Diagrams',
            addNewDiagram: 'Add a new diagram...',
            generic: {
                defaultTitle: 'New generic diagram',
                defaultDescription: 'New generic diagram description',
                select: 'Generic'
            },
            stride: {
                defaultTitle: 'New STRIDE diagram',
                defaultDescription: 'New STRIDE diagram description',
                select: 'STRIDE'
            },
            linddun: {
                defaultTitle: 'New LINDDUN diagram',
                defaultDescription: 'New LINDDUN diagram description',
                select: 'LINDDUN'
            },
            plot4ai: {
                defaultTitle: 'New PLOT4ai diagram',
                defaultDescription: 'New PLOT4ai diagram description',
                select: 'PLOT4ai'
            },
            die: {
                defaultTitle: 'New DIE diagram',
                defaultDescription: 'New DIE diagram description',
                select: 'DIE'
            },
            cia: {
                defaultTitle: 'New CIA diagram',
                defaultDescription: 'New CIA diagram description',
                select: 'CIA'
            }
        },
        threats: 'Threats',
        errors: {
            dropSingleFileOnly: 'Drag and drop requires a single file.',
            invalidJson: 'Invalid JSON. Please check your model and try again.',
            onlyJsonAllowed: 'Only files that end with .json are supported.',
            open: 'Error opening this Threat Model. Check the developer console for more information',
            save: 'Error saving the Threat Model. Check the developer console for more information'
        },
        opened: 'Threat model successfully opened',
        saved: 'Threat model successfully saved',
        properties: {
            title: 'Properties',
            emptyState: 'Select an element on the graph to edit',
            name: 'Name',
            text: 'Text',
            description: 'Description',
            outOfScope: 'Out of Scope',
            bidirection: 'Bidirectional',
            reasonOutOfScope: 'Reason for out of scope',
            handlesCardPayment: 'Card payment',
            handlesGoodsOrServices: 'Goods or Services',
            isALog: 'Is a Log',
            isEncrypted: 'Encrypted',
            isSigned: 'Signed',
            isWebApplication: 'Web Application',
            privilegeLevel: 'Privilege Level',
            providesAuthentication: 'Provides Authentication',
            protocol: 'Protocol',
            publicNetwork: 'Public Network',
            storesCredentials: 'Stores Credentials',
            storesInventory: 'Stores Inventory'
        },
        buttons: {
            delete: 'Delete selected',
            redo: 'Redo edit',
            shortcuts: 'Keyboard shortcuts',
            toggleGrid: 'Toggle grid',
            undo: 'Undo edit',
            zoomIn: 'Zoom in',
            zoomOut: 'Zoom out'
        },
        shortcuts: {
            title: 'Shortcuts',
            copy: {
                shortcut: '(ctrl/cmd) + c',
                action: 'Copy'
            },
            paste: {
                shortcut: '(ctrl/cmd) + v',
                action: 'Paste'
            },
            undo: {
                shortcut: '(ctrl/cmd) + z',
                action: 'Undo'
            },
            redo: {
                shortcut: '(ctrl/cmd) + y',
                action: 'Redo'
            },
            delete: {
                shortcut: 'del',
                action: 'Delete'
            },
            pan: {
                shortcut: 'shift + left-click (hold/drag)',
                action: 'Pan'
            },
            multiSelect: {
                shortcut: 'left-click on empty space and drag',
                action: 'Multi-select'
            },
            zoom: {
                shortcut: '(ctrl/cmd) + mousewheel',
                action: 'Zoom'
            },
            save: {
                shortcut: '(ctrl/cmd) + s',
                action: 'Save'
            }
        },
        stencil: {
            boundaries: 'Boundaries',
            components: 'Components',
            entities: 'Entities',
            metadata: 'Metadata',
            search: 'Search',
            notFound: 'We don\'t have that yet, want to open an issue? :)'
        },
        shapes: {
            actor: 'Actor',
            flow: 'Data Flow',
            flowStencil: 'Data Flow',
            process: 'Process',
            store: 'Store',
            text: 'Descriptive text',
            trustBoundary: 'Trust Boundary'
        }
    },
    forms: {
        apply: 'Apply',
        cancel: 'Cancel',
        close: 'Close',
        closeModel: 'Close Model',
        delete: 'Delete',
        discardTitle: 'Discard Changes?',
        discardMessage: 'Are you sure you want to discard your changes?',
        edit: 'Edit',
        export: 'Export',
        exportAs: 'Export Model As',
        exportHtml: 'HTML Report',
        exportPdf: 'PDF Report',
        exportTd: 'Original (Threat Dragon)',
        exportOtm: 'Open Threat Model (OTM)',
        import: 'Import',
        ok: 'OK',
        open: 'Open',
        openModel: 'Open Model',
        print: 'Print',
        reload: 'Reload',
        remove: 'Remove',
        report: 'Report',
        save: 'Save',
        saveAs: 'Save As',
        saveModel: 'Save Model',
        saveModelAs: 'Save Model As',
        search: 'Search',
        next:'Next',
        previous:'Previous'
    },
    threats: {
        model: {
            cia: {
                header: '--- CIA ---',
                confidentiality: 'Confidentiality',
                integrity: 'Integrity',
                availability: 'Availability'
            },
            die: {
                header: '--- DIE ---',
                distributed: 'Distributed',
                immutable: 'Immutable',
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
                nonCompliance: 'Non-compliance'
            },
            plot4ai: {
                header: '--- PLOT4ai ---',
                techniqueProcesses: 'Technique & Processes',
                accessibility: 'Accessibility',
                identifiabilityLinkability: 'Identifiability & Linkability',
                security: 'Security',
                safety: 'Safety',
                unawareness: 'Unawareness',
                ethicsHumanRights: 'Ethics & Human Rights',
                nonCompliance: 'Non-compliance'
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
            default: 'New generic threat',
            cia: 'New CIA threat',
            die: 'New DIE threat',
            linddun: 'New LINDDUN threat',
            plot4ai: 'New PLOT4ai threat',
            stride: 'New STRIDE threat'
        },
        edit: 'Edit Threat',
        confirmDeleteTitle: 'Confirm Delete',
        confirmDeleteMessage: 'Are you sure you really want to delete this threat?',
        description: 'Provide a description for this threat',
        emptyThreat: 'Select an element on the graph to add a threat',
        mitigation: 'Provide remediation for this threat or a reason if status is N/A',
        newThreat: 'New Threat',
        newThreatByType: 'New Threat by Type',
        newThreatByContext: 'New Threat by Context',
        properties: {
            description: 'Description',
            mitigation: 'Mitigations',
            modelType: 'Model Type',
            number: 'Number',
            priority: 'Priority',
            score: 'Score',
            status: 'Status',
            title: 'Title',
            type: 'Type'
        },
        status: {
            notApplicable: 'N/A',
            open: 'Open',
            mitigated: 'Mitigated'
        },
        priority: {
            tbd: 'TBD',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            critical: 'Critical'
        }
    },
    report: {
        options: {
            showOutOfScope: 'Show out of scope elements',
            showMitigatedThreats: 'Show mitigated threats',
            showModelDiagrams: 'Show model diagrams',
            showEmpty: 'Show empty elements',
            showProperties: 'Show element properties',
            showBranding: 'Threat Dragon logo'
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
            openCritical: 'Open / Critical Priority',
            openHigh: 'Open / High Priority',
            openMedium: 'Open / Medium Priority',
            openLow: 'Open / Low Priority',
            openTbd: 'Open / TBD Priority',
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

export default eng;
