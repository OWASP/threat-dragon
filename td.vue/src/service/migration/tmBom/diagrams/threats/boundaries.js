const merge = (model, control) => {
    let newControl = JSON.parse(JSON.stringify(control));

    let boundary = find(model.trust_boundaries, newControl.trust_boundary);

    if (boundary) {
        newControl.description += '\nApplied across boundaries ' + boundary.trust_zone_a + ' and ' + boundary.trust_zone_b;
        if (boundary.access_control_methods) {
            newControl.description += '\nAccess control methods: ' + boundary.access_control_methods;
        }
        if (boundary.authentication_methods) {
            newControl.description += '\nAuthentication methods: ' + boundary.authentication_methods;
        }
        if (boundary.access_token_expires) {
            newControl.description += '\nAccess token expiry: ' + boundary.access_token_expires;
        }
        if (boundary.access_token_ttl && boundary.access_token_expires) {
            newControl.description += '\nAccess token time to live: ' + boundary.access_token_ttl + 's';
        }
        if (boundary.has_refresh_token) {
            newControl.description += '\nRefresh tokens are present';
        }
        if (boundary.refresh_token_expires && boundary.has_refresh_token) {
            newControl.description += '\nRefresh token expires: ' + boundary.refresh_token_expires;
        }
        if (boundary.refresh_token_ttl && boundary.has_refresh_token) {
            newControl.description += '\nRefresh token time to live: ' + boundary.refresh_token_ttl + 's';
        }
        if (boundary.can_user_logout) {
            newControl.description += '\nUser logout provided';
        }
        if (boundary.can_system_logout) {
            newControl.description += '\nSystem logout provided';
        }
    }

    return newControl;
};

const find = (trustBoundaries, trustBoundary) => {
    if (!trustBoundaries || !trustBoundary) {
        return null;
    }

    for (const boundary of trustBoundaries) {
        // trust_boundaries do not (yet) have an ID, so match values instead
        if (boundary.trust_zone_a === trustBoundary.trust_zone_a
            && boundary.trust_zone_b === trustBoundary.trust_zone_b
        ) {
            // found, no need to search further
            return boundary;
        }
    }

    return null;
};

export default {
    find,
    merge
};
