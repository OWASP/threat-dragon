const translateKnownKey = (t, key) => {
    switch (key) {
    case 'branch.protectedBranch': return t('branch.protectedBranch');
    case 'dashboard.actions.openExisting': return t('dashboard.actions.openExisting');
    case 'dashboard.actions.createNew': return t('dashboard.actions.createNew');
    case 'dashboard.actions.readDemo': return t('dashboard.actions.readDemo');
    case 'dashboard.actions.importExisting': return t('dashboard.actions.importExisting');
    case 'dashboard.actions.createFromTemplate': return t('dashboard.actions.createFromTemplate');
    case 'threatmodel.shapes.actor': return t('threatmodel.shapes.actor');
    case 'threatmodel.shapes.flow': return t('threatmodel.shapes.flow');
    case 'threatmodel.shapes.flowStencil': return t('threatmodel.shapes.flowStencil');
    case 'threatmodel.shapes.process': return t('threatmodel.shapes.process');
    case 'threatmodel.shapes.store': return t('threatmodel.shapes.store');
    case 'threatmodel.shapes.text': return t('threatmodel.shapes.text');
    case 'threatmodel.shapes.trustBoundary': return t('threatmodel.shapes.trustBoundary');
    case 'tm.Actor':
    case 'td.Actor': return t('threatmodel.shapes.actor');
    case 'tm.Boundary':
    case 'tm.BoundaryBox':
    case 'tm.BoundaryStencil':
    case 'td.Boundary':
    case 'td.BoundaryBox':
    case 'td.BoundaryStencil': return t('threatmodel.shapes.trustBoundary');
    case 'tm.Flow':
    case 'tm.FlowStencil':
    case 'td.Flow':
    case 'td.FlowStencil': return t('threatmodel.shapes.flow');
    case 'tm.Process':
    case 'td.Process': return t('threatmodel.shapes.process');
    case 'tm.Store':
    case 'td.Store': return t('threatmodel.shapes.store');
    case 'tm.Text':
    case 'td.Text': return t('threatmodel.shapes.text');
    case 'threatmodel.errors.invalidJson': return t('threatmodel.errors.invalidJson');
    case 'threatmodel.errors.onlyJsonAllowed': return t('threatmodel.errors.onlyJsonAllowed');
    case 'threatmodel.errors.open': return t('threatmodel.errors.open');
    case 'threats.status.notApplicable': return t('threats.status.notApplicable');
    case 'threats.status.open': return t('threats.status.open');
    case 'threats.status.mitigated': return t('threats.status.mitigated');
    case 'threats.status.accepted': return t('threats.status.accepted');
    case 'threats.status.transferred': return t('threats.status.transferred');
    case 'threats.status.avoided': return t('threats.status.avoided');
    case 'threats.status.eliminated': return t('threats.status.eliminated');
    case 'threats.model.cia.header': return t('threats.model.cia.header');
    case 'threats.model.cia.availability': return t('threats.model.cia.availability');
    case 'threats.model.cia.confidentiality': return t('threats.model.cia.confidentiality');
    case 'threats.model.cia.integrity': return t('threats.model.cia.integrity');
    case 'threats.model.ciadie.availability': return t('threats.model.ciadie.availability');
    case 'threats.model.ciadie.confidentiality': return t('threats.model.ciadie.confidentiality');
    case 'threats.model.ciadie.distributed': return t('threats.model.ciadie.distributed');
    case 'threats.model.ciadie.ephemeral': return t('threats.model.ciadie.ephemeral');
    case 'threats.model.ciadie.immutable': return t('threats.model.ciadie.immutable');
    case 'threats.model.ciadie.integrity': return t('threats.model.ciadie.integrity');
    case 'threats.model.ciadie.header': return t('threats.model.ciadie.header');
    case 'threats.model.linddun.detectability': return t('threats.model.linddun.detectability');
    case 'threats.model.linddun.disclosureOfInformation': return t('threats.model.linddun.disclosureOfInformation');
    case 'threats.model.linddun.identifiability': return t('threats.model.linddun.identifiability');
    case 'threats.model.linddun.linkability': return t('threats.model.linddun.linkability');
    case 'threats.model.linddun.nonCompliance': return t('threats.model.linddun.nonCompliance');
    case 'threats.model.linddun.nonRepudiation': return t('threats.model.linddun.nonRepudiation');
    case 'threats.model.linddun.unawareness': return t('threats.model.linddun.unawareness');
    case 'threats.model.linddun.header': return t('threats.model.linddun.header');
    case 'threats.model.plot4ai.accessibility': return t('threats.model.plot4ai.accessibility');
    case 'threats.model.plot4ai.ethicsHumanRights': return t('threats.model.plot4ai.ethicsHumanRights');
    case 'threats.model.plot4ai.identifiabilityLinkability': return t('threats.model.plot4ai.identifiabilityLinkability');
    case 'threats.model.plot4ai.nonCompliance': return t('threats.model.plot4ai.nonCompliance');
    case 'threats.model.plot4ai.safety': return t('threats.model.plot4ai.safety');
    case 'threats.model.plot4ai.security': return t('threats.model.plot4ai.security');
    case 'threats.model.plot4ai.techniqueProcesses': return t('threats.model.plot4ai.techniqueProcesses');
    case 'threats.model.plot4ai.unawareness': return t('threats.model.plot4ai.unawareness');
    case 'threats.model.plot4ai.header': return t('threats.model.plot4ai.header');
    case 'threats.model.stride.denialOfService': return t('threats.model.stride.denialOfService');
    case 'threats.model.stride.elevationOfPrivilege': return t('threats.model.stride.elevationOfPrivilege');
    case 'threats.model.stride.informationDisclosure': return t('threats.model.stride.informationDisclosure');
    case 'threats.model.stride.repudiation': return t('threats.model.stride.repudiation');
    case 'threats.model.stride.spoofing': return t('threats.model.stride.spoofing');
    case 'threats.model.stride.tampering': return t('threats.model.stride.tampering');
    case 'threats.model.stride.header': return t('threats.model.stride.header');
    case 'threats.generic.cia': return t('threats.generic.cia');
    case 'threats.generic.ciadie': return t('threats.generic.ciadie');
    case 'threats.generic.default': return t('threats.generic.default');
    case 'threats.generic.eop': return t('threats.generic.eop');
    case 'threats.generic.linddun': return t('threats.generic.linddun');
    case 'threats.generic.plot4ai': return t('threats.generic.plot4ai');
    case 'threats.generic.stride': return t('threats.generic.stride');
    default: return key;
    }
};

export const translateProviderDisplayName = (t, provider) => {
    switch (provider) {
    case 'desktop': return t('providers.desktop.displayName');
    case 'github': return t('providers.github.displayName');
    case 'gitlab': return t('providers.gitlab.displayName');
    case 'bitbucket': return t('providers.bitbucket.displayName');
    case 'google': return t('providers.google.displayName');
    case 'local': return t('providers.local.displayName');
    default: return '';
    }
};

export const translateProviderLogin = (t, provider) => {
    switch (provider) {
    case 'desktop': return t('providers.desktop.loginWith');
    case 'github': return t('providers.github.loginWith');
    case 'gitlab': return t('providers.gitlab.loginWith');
    case 'bitbucket': return t('providers.bitbucket.loginWith');
    case 'google': return t('providers.google.loginWith');
    case 'local': return t('providers.local.loginWith');
    default: return '';
    }
};

export { translateKnownKey };
