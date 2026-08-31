import analytics from '@/service/analytics.js';
import { localeSelected } from '@/store/actions/locale.js';
import { providerSelected } from '@/store/actions/provider.js';
import { threatmodelFetch } from '@/store/actions/threatmodel.js';

const providers = Object.freeze(['local', 'github', 'gitlab', 'bitbucket', 'google']);
const remoteProviders = Object.freeze(['github', 'gitlab', 'bitbucket', 'google']);

const analyticsPlugin = (store) => {
    store.subscribeAction({
        after: (action, state) => {
            switch (action.type) {
            case providerSelected:
                if (providers.includes(action.payload)) {
                    analytics.track('PROVIDER_SELECTED', { provider: action.payload });
                }
                break;
            case localeSelected:
                analytics.track('APPLICATION_LANGUAGE_USED', { language: state.locale.locale });
                break;
            case threatmodelFetch:
                if (remoteProviders.includes(state.provider.selected)) {
                    analytics.track('THREAT_MODEL_OPENED', { source: state.provider.selected });
                }
                break;
            default:
                break;
            }
        }
    });
};

export default analyticsPlugin;
