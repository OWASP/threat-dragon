import data_sets from '@/service/migration/tmBom/diagrams/sets';
import tmBomModel from '../test-model';

const nodes = [
    {
        data: {
            type: 'tm.Actor',
            name: 'User',
            description: 'External user interacting with the HuskyAI system via the API Gateway.',
        },
        id: 'user'
    },
    {
        data: {
            type: 'tm.Store',
            name: 'Training And Validation Images Storage Blob',
            description: 'Contains images used for training and validation of machine learning models.',
            isEncrypted: false
        },
        id: 'training-images-blob'
    },
    {
        data: {
            type: 'tm.Store',
            name: 'API Key Storage',
            description: 'Stores API keys for secure access to external services.',
            isEncrypted: false
        },
        id: 'api-key-storage'
    },
    {
        data: {
            type: 'tm.Store',
            name: 'Authorized Keys Storage',
            description: 'Contains SSH keys used for securing administrative access.',
            isEncrypted: false
        },
        id: 'secret-key-storage'
    },
    {
        data: {
            type: 'tm.Store',
            name: 'Machine Learning Model Storage Blob',
            description: 'Contains storage for machine learning models in serialized format.',
            isEncrypted: false
        },
        id: 'ml-models-blob'
    },
    {
        data: {
            type: 'tm.Store',
            name: 'Source Code And Configuration Storage',
            description: 'Stores source code and configuration files for deployment and production setup.',
            isEncrypted: false
        },
        id: 'source-code-config-storage'
    },
    {
        data: {
            type: 'tm.Store',
            name: 'Bastion Logs Storage',
            description: 'Contains logs related to SSH access and activity through the Bastion.',
            isEncrypted: false
        },
        id: 'bastion-logs-storage'
    },
    {
        data: {
            type: 'tm.Store',
            name: 'Azure Cache for Redis',
            description: 'Provides an in-memory data structure store for caching and message brokering.',
            isEncrypted: false
        },
        id: 'uploaded-images-redis'
    },
    {
        data: {
            type: 'tm.Process',
            name: 'Jupyter Notebook',
            description: 'A Jupyter Notebook environment that processes the images stored in Training and Validation Images, executes code using external ML libraries, and provides a UI for engineers to interact with and manipulate data, allowing for iterative model development. It can save trained machine learning models to Machine Learning Model storage.',
        },
        id: 'jupyter'
    },
    {
        data: {
            type: 'tm.Process',
            name: 'Deployment Service',
            description: 'Handles the deployment of the machine learning model by packaging the model and all necessary source code and configuration stored in Source Code and Configuration. It receives the final model from Jupyter Notebook and prepares it for deployment to the production environment.',
        },
        id: 'deployment-service'
    }
];

describe('service/migration/tmBom/diagrams/sets.js', () => {
    describe('updates component descriptions', () => {
        let components = data_sets.merge(tmBomModel, nodes);

        it('adds the data set title', () => {
            expect(components[0].data.description).not.toContain('Data set:');
            expect(components[1].data.description).toContain('Data set: Training and Validation Images');
            expect(components[2].data.description).toContain('Data set: API Keys');
            expect(components[7].data.description).toContain('Data set: Uploaded Images');
            expect(components[9].data.description).not.toContain('Data set:');
        });

        it('adds the data set description', () => {
            expect(components[1].data.description).toContain('Contains images used for training');
            expect(components[3].data.description).toContain('Contains SSH keys used for securing');
            expect(components[7].data.description).toContain('Contains images that users upload');
        });

        it('sets the encryption flag', () => {
            expect(components[1].data.isEncrypted).toBe(true);
            expect(components[4].data.isEncrypted).toBe(false);
            expect(components[7].data.isEncrypted).toBe(false);
        });

        it('adds the number of records', () => {
            expect(components[0].data.description).not.toContain('maximum of');
            expect(components[1].data.description).toContain('maximum of 100000');
            expect(components[5].data.description).toContain('maximum of 200');
            expect(components[7].data.description).toContain('maximum of 100000000');
            expect(components[8].data.description).not.toContain('maximum of');
        });

        it('adds the data sensitivity', () => {
            expect(components[0].data.description).not.toContain('data sensitivity of');
            expect(components[2].data.description).toContain('data sensitivity of cred');
            expect(components[6].data.description).toContain('data sensitivity of biz');
            expect(components[7].data.description).toContain('data sensitivity of  ');
            expect(components[8].data.description).not.toContain('data sensitivity of');
        });

        it('adds the access control methods', () => {
            expect(components[0].data.description).not.toContain('control methods');
            expect(components[1].data.description).toContain('control methods of rbac');
            expect(components[6].data.description).toContain('control methods of acl');
            expect(components[9].data.description).not.toContain('control methods');
        });
    });
});
