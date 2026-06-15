const ruleIds = {
    'No Suggestions available': 'eeb8d742-5213-44b2-bfc3-c454e4e03fbf',
    'CAPTCHA defeat': '5b0d4c4e-8245-4bea-a2ad-cf0be0a441f5',
    'Credential stuffing': 'da483c51-1891-46ac-8453-6b1706b2a3d6',
    'Use encryption': '021ab22d-8d51-4501-9bb8-6dabf9c27f0d',
    'Vulnerable transport protocol': 'ff2fca4d-dedf-46f2-b9ac-aed70055bb4d',
    Fingerprinting: 'f5f817d5-a067-4415-a40a-b500cb2ab9ad',
    'Least privilege': '6463e063-e7c5-4305-9d8d-0c8e978ab86b',
    Expedition: 'ea1adb4d-097d-45a8-8e48-b728a996f487',
    'Vulnerability scanning': 'd97bcb80-f96d-44af-869a-d0441761be05',
    'Denial of Service': 'ce2fe37e-0742-4278-8915-40dc2226150e',
    Carding: '6cc27f83-ae03-4589-8e9b-24d4c2d4d8cd',
    'Card cracking': '505afd31-7b3f-4733-b91c-71abb488d2eb',
    'Cashing out': 'c7b098d3-34df-432a-ad52-8f10c4ef6b07',
    Footprinting: '20527bee-aae7-4593-acac-7a07169ccc4f',
    Sniping: 'd6d15882-15d5-4da1-88a5-dc3eae0b4a64',
    'Denial of inventory': '7403fdb4-9d89-4fb7-be5c-c37ce142af5e',
    Scraping: '80f32309-4f8a-4676-993b-7a37cbf62df1',
    Skewing: '40aee5ad-37ff-4c70-91d4-9ab6d91d1463',
    Spamming: 'fe90a897-3ff2-47a5-94db-2a4d6f17bb57',
    'Credential cracking': 'dc09cecf-cb06-455d-9e77-b9372bf6c8eb',
    'Account creation': 'd960d589-80da-41dc-a7c2-33136bdda7e0',
    'Account aggregation': '7b1c36b3-104a-4d82-97bb-a64c12284641',
    'Coupon cracking': '3853aaed-f262-4310-98df-484c5ef6609a',
    Scalping: 'c50e8d53-5e0a-45e7-8c69-be92492ad7dc',
    'Vulnerable encryption algorithms': '4fb623f6-2896-4209-8689-ff1b8a932105',
    'Vulnerable cryptography': '034095d9-9012-4cb5-a7a8-1e19ab72bba3',
    'Log contains sensetive data': '7942656e-51dd-4b15-a38d-deab704878e1'
};

export const getRuleId = (suggestion) => suggestion.title === 'Footprinting' &&
    suggestion.description.includes('Automated Threat #5:')
    ? ruleIds.Scalping
    : ruleIds[suggestion.title];

export default ruleIds;
