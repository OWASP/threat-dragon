import diagrams from '@/service/migration/tdV1/diagrams/diagrams';

const convertContributors = (contributors) => {
    let v2contributors = new Array();
	
    contributors?.forEach((contributor) => {
        // v1.x provided an object ID '$$hashKey' which has no equivalent for v2.x
        v2contributors.push({'name': contributor.name});
    });
    return v2contributors;
};

const read = (detail, version) => {
    return {
        contributors: convertContributors(detail.contributors),
        diagrams: diagrams.read(detail.diagrams, version),
        diagramTop: detail?.diagrams ? detail.diagrams.length : 0,
	    reviewer: detail?.reviewer ? detail.reviewer : '',
        threatTop: 1000
    };
};

export default {
    read
};
