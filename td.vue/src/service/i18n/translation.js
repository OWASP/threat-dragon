const translateKnownKey = (translate, key) => {
    switch (key) {
    case 'branch.protectedBranch': return translate('branch.protectedBranch');
    case 'dashboard.actions.openExisting': return translate('dashboard.actions.openExisting');
    case 'dashboard.actions.createNew': return translate('dashboard.actions.createNew');
    case 'dashboard.actions.readDemo': return translate('dashboard.actions.readDemo');
    case 'dashboard.actions.importExisting': return translate('dashboard.actions.importExisting');
    case 'dashboard.actions.createFromTemplate': return translate('dashboard.actions.createFromTemplate');
    case 'threatmodel.shapes.actor': return translate('threatmodel.shapes.actor');
    case 'threatmodel.shapes.flow': return translate('threatmodel.shapes.flow');
    case 'threatmodel.shapes.flowStencil': return translate('threatmodel.shapes.flowStencil');
    case 'threatmodel.shapes.process': return translate('threatmodel.shapes.process');
    case 'threatmodel.shapes.store': return translate('threatmodel.shapes.store');
    case 'threatmodel.shapes.text': return translate('threatmodel.shapes.text');
    case 'threatmodel.shapes.trustBoundary': return translate('threatmodel.shapes.trustBoundary');
    case 'threatmodel.errors.invalidJson': return translate('threatmodel.errors.invalidJson');
    case 'threatmodel.errors.onlyJsonAllowed': return translate('threatmodel.errors.onlyJsonAllowed');
    case 'threatmodel.errors.open': return translate('threatmodel.errors.open');
    case 'threats.model.cia.availability':
    case 'threats.model.cia.confidentiality':
    case 'threats.model.cia.integrity':
    case 'threats.model.ciadie.availability':
    case 'threats.model.ciadie.confidentiality':
    case 'threats.model.ciadie.distributed':
    case 'threats.model.ciadie.ephemeral':
    case 'threats.model.ciadie.immutable':
    case 'threats.model.ciadie.integrity':
    case 'threats.model.linddun.detectability':
    case 'threats.model.linddun.disclosureOfInformation':
    case 'threats.model.linddun.identifiability':
    case 'threats.model.linddun.linkability':
    case 'threats.model.linddun.nonCompliance':
    case 'threats.model.linddun.nonRepudiation':
    case 'threats.model.linddun.unawareness':
    case 'threats.model.plot4ai.accessibility':
    case 'threats.model.plot4ai.ethicsHumanRights':
    case 'threats.model.plot4ai.identifiabilityLinkability':
    case 'threats.model.plot4ai.nonCompliance':
    case 'threats.model.plot4ai.safety':
    case 'threats.model.plot4ai.security':
    case 'threats.model.plot4ai.techniqueProcesses':
    case 'threats.model.plot4ai.unawareness':
    case 'threats.model.stride.denialOfService':
    case 'threats.model.stride.elevationOfPrivilege':
    case 'threats.model.stride.informationDisclosure':
    case 'threats.model.stride.repudiation':
    case 'threats.model.stride.spoofing':
    case 'threats.model.stride.tampering':
    case 'threats.generic.cia':
    case 'threats.generic.ciadie':
    case 'threats.generic.default':
    case 'threats.generic.eop':
    case 'threats.generic.linddun':
    case 'threats.generic.plot4ai':
    case 'threats.generic.stride': return translate(key);
    default: return key;
    }
};

export const translateProviderDisplayName = (translate, provider) => {
    switch (provider) {
    case 'desktop': return translate('providers.desktop.displayName');
    case 'github': return translate('providers.github.displayName');
    case 'gitlab': return translate('providers.gitlab.displayName');
    case 'bitbucket': return translate('providers.bitbucket.displayName');
    case 'google': return translate('providers.google.displayName');
    case 'local': return translate('providers.local.displayName');
    default: return '';
    }
};

export const translateProviderLogin = (translate, provider) => {
    switch (provider) {
    case 'desktop': return translate('providers.desktop.loginWith');
    case 'github': return translate('providers.github.loginWith');
    case 'gitlab': return translate('providers.gitlab.loginWith');
    case 'bitbucket': return translate('providers.bitbucket.loginWith');
    case 'google': return translate('providers.google.loginWith');
    case 'local': return translate('providers.local.loginWith');
    default: return '';
    }
};

export { translateKnownKey };
