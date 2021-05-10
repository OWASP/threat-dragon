const isVersion1x = (threatModel) => !threatModel.version;

const convertToVersion2 = (original) => ({
        version: '2.0',
        title: original.summary.title || '',
        owner: original.summary.owner || '',
        reviewer: original.reviewer || '',
        description: original.summary.description || '',
        contributors: (original.detail.contributors || []).map((x) => x.name),
        // Will need to update the diagrams when we are ready to update graph lib
        diagrams: original.detail.diagrams
    });

export default {
    convertToVersion2,
    isVersion1x
};
