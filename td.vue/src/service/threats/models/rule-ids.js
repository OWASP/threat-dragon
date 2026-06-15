const ruleIds = {
    CIA: {
        confidentiality: '0f20e64c-5d03-42ac-b0ae-ed105a38ee1f',
        integrity: '42511938-37d9-4bb6-866c-947a7c776e7e',
        availability: '52453492-f49f-411e-a59d-5fc2dd98664b'
    },
    CIADIE: {
        confidentiality: '0f20e64c-5d03-42ac-b0ae-ed105a38ee1f',
        integrity: '42511938-37d9-4bb6-866c-947a7c776e7e',
        availability: '52453492-f49f-411e-a59d-5fc2dd98664b',
        distributed: 'f3fb94f4-7a4d-4271-80f4-01c450003128',
        immutable: '8dc67be7-1f2d-45b6-afb9-d44564871f28',
        ephemeral: '4c09f8a2-e738-432f-a378-08bc9e53a63f'
    },
    LINDDUN: {
        linkability: '896abdef-0e7e-46ec-aeaa-b8e70c233d57',
        identifiability: '9128c587-bc76-41d0-a02d-5de3b539ecc0',
        nonRepudiation: '74834f24-8f89-40bb-b0c6-d1fdd8b8accc',
        detectability: 'df43b091-9ffb-44e3-9eb9-471b9ee56d39',
        disclosureOfInformation: '9d576610-5c53-4f84-90c5-ec70751a339d',
        unawareness: '8d0993c0-9d92-4c51-99f5-6772270a7d88',
        nonCompliance: '6e80d2fc-747a-4ae8-a435-acce06617139'
    },
    PLOT4AI: {
        techniqueProcesses: '7f26d4ca-597f-4523-b718-fd00f6b5eab0',
        accessibility: '4e188e3e-1e91-4b92-909a-d40d8c39e8ee',
        identifiabilityLinkability: 'a44e067f-8f1b-4c0b-9bf0-fdd90235469b',
        security: 'b3ae581d-a9df-4597-8e65-c308badae03b',
        safety: '9b534b87-e41d-45a9-89a0-5452b7fdf30f',
        unawareness: '0aae25b8-9bd6-40da-bf5a-df6c90156b1c',
        ethicsHumanRights: '0aee0047-54b9-4627-a551-0ddf3557af52',
        nonCompliance: 'b0f987e2-885b-4759-aaa8-2279ba2798c7'
    },
    STRIDE: {
        spoofing: 'b2a6d40d-d3f8-4750-8e4d-c02cc84b13dc',
        tampering: '4adaa48a-0345-4533-a189-64c98c4420dd',
        repudiation: '87bc37e2-798e-4d68-bb96-feb1da26da48',
        informationDisclosure: '13000296-b17d-4b72-9cc4-f5cc33f80e4c',
        denialOfService: 'edb05d76-a695-455f-947b-7d67b78bc31d',
        elevationOfPrivilege: 'c1377855-ea20-4c97-8861-f95c364fb8d2'
    }
};

export const getRuleId = (modelType, threatType, translationKey) => {
    const normalizedModelType = modelType?.toUpperCase() === 'DIE'
        ? 'CIADIE'
        : modelType?.toUpperCase();
    const translatedModelType = translationKey?.split('.')[2]?.toUpperCase();

    return ruleIds[normalizedModelType]?.[threatType] ??
        ruleIds[translatedModelType]?.[threatType];
};

export default ruleIds;
