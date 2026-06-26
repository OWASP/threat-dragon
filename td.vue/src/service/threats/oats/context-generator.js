

function fixupByContext(suggestions, modelType){
    return suggestions.map((suggestion) => {
        switch(suggestion.type){
        case 'threats.model.linddun.linkability':
            if(modelType==='STRIDE')
                suggestion.type = 'threats.model.stride.informationDisclosure';
            else if (modelType === 'CIA')
                suggestion.type = 'threats.model.cia.confidentiality';
            break;
        case 'threats.model.linddun.identifiability':
            if(modelType==='STRIDE')
                suggestion.type = 'threats.model.stride.spoofing';
            else if(modelType==='CIA')
                suggestion.type = 'threats.model.cia.confidentiality';
            break;
        case 'threats.model.stride.repudiation':
            if(modelType==='LINDDUN')
                suggestion.type='threats.model.linddun.nonRepudiation';
            else if (modelType==='CIA')
                suggestion.type = 'threats.model.cia.integrity';
            break;
        case 'threats.model.linddun.detectability':
            if(modelType==='STRIDE')
                suggestion.type = 'threats.model.stride.informationDisclosure';
            else if(modelType==='CIA')
                suggestion.type = 'threats.model.cia.confidentiality';
            break;
        case 'threats.model.linddun.disclosureOfInformation':
            if(modelType==='STRIDE')
                suggestion.type = 'threats.model.stride.informationDisclosure';
            else if(modelType==='CIA')
                suggestion.type = 'threats.model.cia.confidentiality';
            break;
        case 'threats.model.linddun.unawareness':
            if(modelType==='STRIDE')
                suggestion.type = 'threats.model.stride.elevationOfPrivilege';
            else if(modelType==='CIA')
                suggestion.type = 'threats.model.cia.integrity';
            break;
        case 'threats.model.stride.tampering':
            if(modelType==='LINDDUN')
                suggestion.type = 'threats.model.linddun.nonCompliance';
            else if(modelType === 'CIA')
                suggestion.type = 'threats.model.cia.integrity';
            break;
        }
        return suggestion;
    });
}




export const GetContextSuggestions = (element, model) => {
    const suggestions = [];
    const diagram = (model == 'STRIDE' || model == 'LINDDUN' || model == 'CIA')?model:'null';
    
    if((diagram==='null')||((element.type==='tm.Actor'&&!element.providesAuthentication)||(element.type==='tm.Flow'&&(!element.isPublicNetwork&&!element.isEncrypted))))
    {
        suggestions.push({
            title: 'No Suggestions available',
            type: '',
            description:'No suggestions available for this context. Add one manually please',
            mitigation:'',
            ruleId: 'eeb8d742-5213-44b2-bfc3-c454e4e03fbf'
        });
        return suggestions;
    }
    if((element.type==='tm.Actor'&&element.providesAuthentication)){
        suggestions.push({
            title: 'CAPTCHA defeat',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #9:\nAutomation is used in an attempt to analyse and determination the answers to CAPTCHA tests and related puzzles',
            mitigation:'Defences include guarding against automation, unguessable CAPTCHA and proper enforcement of behavioral workflow',
            ruleId: '5b0d4c4e-8245-4bea-a2ad-cf0be0a441f5'
        });
        suggestions.push({
            title: 'Credential stuffing',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'See OWASP Automated Threat #8:\nLists of stolen authentication credentials are tested against the application’s authentication mechanisms to identify whether users have re-used the same login credentials',
            mitigation:'Defences against Credential Stuffing are described in the OWASP Credential Stuffing Prevention Cheat Sheet, Multi-Factor Authentication being a primary counter-measure',
            ruleId: 'da483c51-1891-46ac-8453-6b1706b2a3d6'
        });
    }
    
    if((element.type==='tm.Flow'&&element.isPublicNetwork&&!element.isEncrypted)){
        suggestions.push({
            title: 'Use encryption',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'Unencrypted data sent over a public network may be intercepted and read by an attacker',
            mitigation:'Data should be encrypted either at the message or transport level',
            ruleId: '021ab22d-8d51-4501-9bb8-6dabf9c27f0d'
        });
    }
    
    if((element.type==='tm.Flow'&&element.isEncrypted)){
        suggestions.push({
            title: 'Vulnerable transport protocol',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'Older transport protocols are vulnerable and have known vulnerabilities',
            mitigation:'Use up to date cryptography and transport protocols',
            ruleId: 'ff2fca4d-dedf-46f2-b9ac-aed70055bb4d'
        });
    }

    if((element.type==='tm.Flow'&&element.isPublicNetwork)){
        suggestions.push({
            title: 'Fingerprinting',
            type: 'threats.model.linddun.linkability',
            description:'See OWASP Automated Threat #4:\nSpecific requests are sent to the application eliciting information in order to profile the application',
            mitigation:'Defence includes restricting what information is provided, for example version numbers and package details',
            ruleId: 'f5f817d5-a067-4415-a40a-b500cb2ab9ad'
        });
    }
    
    if((element.type==='tm.Process'&&element.privilegeLevel!==''&&element.privilegeLevel!==undefined)){
        suggestions.push({
            title: 'Least privilege',
            type: 'threats.model.linddun.unawareness',
            description:'If a process is comprimised and under control of a malicious actor, horizontal/lateral elevation of privilege can be used to comprimise other processes',
            mitigation:'Processes should run with least privilege that is practical, to minimise the impact of horizontal elevation of privilege',
            ruleId: '6463e063-e7c5-4305-9d8d-0c8e978ab86b'
        });
    }
    
    if((element.type==='tm.Process')){
        suggestions.push({
            title: 'Expedition',
            type: 'threats.model.stride.tampering',
            description:'See OWASP Automated Threat #6:\nUsing speed to violate explicit or implicit assumptions about the application’s normal use to achieve unfair individual gain',
            mitigation:'Defences include providing enforcement of behavioral workflow and anti-automation',
            ruleId: 'ea1adb4d-097d-45a8-8e48-b728a996f487'
        });
    }
    
    if((element.type==='tm.Process')){
        suggestions.push({
            title: 'Vulnerability scanning',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'See OWASP Automated Threat #14:\nSystematic enumeration and examination in order to find weaknesses and points where a security vulnerability might exist',
            mitigation:'Defence includes providing anti-automation',
            ruleId: 'd97bcb80-f96d-44af-869a-d0441761be05'
        });
    }
    
    if((element.type==='tm.Process')){
        suggestions.push({
            title: 'Denial of Service',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #15:\nUsage may resemble legitimate application usage but leads to exhaustion of resources',
            mitigation:'Mitigation or prevention such as providing backoff, resource management and avoiding forced deadlock',
            ruleId: 'ce2fe37e-0742-4278-8915-40dc2226150e'
        });
    }
    
    if((element.type==='tm.Process'&&element.handlesCardPayment)){
        suggestions.push({
            title: 'Carding',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'See OWASP Automated Threat #1:\nLists of full credit/debit card data are tested against a merchant`s payment processes to identify valid card details',
            mitigation:'Defences include control of interaction frequency, enforcement of a single unique a action and preventing abuse of functionality',
            ruleId: '6cc27f83-ae03-4589-8e9b-24d4c2d4d8cd'
        });
        suggestions.push({
            title: 'Card cracking',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'See OWASP Automated Threat #10:\nBrute force attack against application payment card process to identify the missing values for start date, expiry date and card security code',
            mitigation:'Defences include control of interaction frequency, preventing brute force attacks and anti-automation',
            ruleId: '505afd31-7b3f-4733-b91c-71abb488d2eb'
        });
    }
    
    if((element.type==='tm.Process'&&element.handlesCardPayment)){
        suggestions.push({
            title: 'Cashing out',
            type: 'threats.model.stride.repudiation',
            description:'See OWASP Automated Threat #12:\nObtaining currency or higher-value merchandise via the application using stolen previously validated payment cards or account login credentials',
            mitigation:'Defences include control of interaction frequency, enforcement of a single unique action, anti-automation and preventing abuse of functionality',
            ruleId: 'c7b098d3-34df-432a-ad52-8f10c4ef6b07'
        });
    }
    
    if((element.type==='tm.Process'&&element.isWebApplication)){
        suggestions.push({
            title: 'Footprinting',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'See OWASP Automated Threat #18:\nInformation gathering with the objective of learning as much as possible about the composition, configuration and security mechanisms of the application',
            mitigation:'Defences include shutting down unnecessary services/ports and excluding information that could identify and compromise security of the organisation',
            ruleId: '20527bee-aae7-4593-acac-7a07169ccc4f'
        });
    }
    
    if((element.type==='tm.Process'&&element.handlesGoodsOrServices)){
        suggestions.push({
            title: 'Footprinting',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #5:\nMass acquisition of goods or services using the application in a manner that a normal user would be unable to undertake manually',
            mitigation:'Defences against this automated threat include control of interaction frequency, enforcement of a single unique a action and enforcement of behavioral workflow',
            ruleId: 'c50e8d53-5e0a-45e7-8c69-be92492ad7dc'
        });
        suggestions.push({
            title: 'Sniping',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #13:\nAutomated exploitation of system latencies in the form of timing attacks',
            mitigation:'Defences include anti-automation and prevention of abuse of functionality',
            ruleId: 'd6d15882-15d5-4da1-88a5-dc3eae0b4a64'
        });
        suggestions.push({
            title: 'Denial of inventory',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #21:\nSelection and deliberate holding of items from a limited inventory or stock such that other users are unable to buy/pay/confirm the items',
            mitigation:'Defences include control of interaction frequency and anti-automation',
            ruleId: '7403fdb4-9d89-4fb7-be5c-c37ce142af5e'
        });
    }
    if((element.type==='tm.Store')){
        suggestions.push({
            title: 'Scraping',
            type: 'threats.model.linddun.linkability',
            description:'See OWASP Automated Threat #11:\nCollecting accessible data and/or processed output from the application',
            mitigation:'Detect fake or compromised accounts, ensure information is accessible only with authentication and authorisation',
            ruleId: '80f32309-4f8a-4676-993b-7a37cbf62df1'
        });
        suggestions.push({
            title: 'Skewing',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #16:\nAutomated repeated clicking or requesting or submitting content, affecting application based metrics such as counts, and measures of frequency and/or rate',
            mitigation:'Defences include control of interaction frequency or proper enforcement of a single unique action',
            ruleId: '40aee5ad-37ff-4c70-91d4-9ab6d91d1463'
        });
        suggestions.push({
            title: 'Spamming',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #17:\nStoring malicious such as malware, Iframe distribution, photographs & videos, advertisements, referrer spam and tracking/surveillance code',
            mitigation:'Defences include detecting embedded malicious code, controling interaction frequency and enforcement of a single unique action',
            ruleId: 'fe90a897-3ff2-47a5-94db-2a4d6f17bb57'
        });
    }
    
    if((element.type==='tm.Store'&&element.storesCredentials)){
        suggestions.push({
            title: 'Credential cracking',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'See OWASP Automated Threat #7:\nBrute force, dictionary and guessing attacks used against authentication processes of the application to identify valid account credentials',
            mitigation:'Defences include restriction of excessive authentication attempts, control of interaction frequency and enforcement of a single unique action',
            ruleId: 'dc09cecf-cb06-455d-9e77-b9372bf6c8eb'
        });
        suggestions.push({
            title: 'Account creation',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #19:\nBulk account creation, and sometimes profile population, by using the application’s account signup processes',
            mitigation:'Defences include control of interaction frequency, enforcement of a single unique a action and enforcement of behavioral workflow',
            ruleId: 'd960d589-80da-41dc-a7c2-33136bdda7e0'
        });
        suggestions.push({
            title: 'Account aggregation',
            type: 'threats.model.linddun.identifiability',
            description:'See OWASP Automated Threat #20:\nCompilation of credentials and information from multiple application accounts into another system',
            mitigation:'Defences include control of interaction frequency and prevention of abuse of functionality',
            ruleId: '7b1c36b3-104a-4d82-97bb-a64c12284641'
        });
    }
    if((element.type==='tm.Store'&&element.storesInventory)){
        suggestions.push({
            title: 'Coupon cracking',
            type: 'threats.model.stride.tampering',
            description:'See OWASP Automated Threat #2:\nMass enumeration (for example coupon numbers, voucher codes, discount tokens) providing some form of user benefit within the application',
            mitigation:'Defences include providing anti-automation, guarding against brute force, and preventing abuse of functionality',
            ruleId: '3853aaed-f262-4310-98df-484c5ef6609a'
        });
    }
    if((element.type==='tm.Store'&&element.storesInventory)){
        suggestions.push({
            title: 'Scalping',
            type: 'threats.model.linddun.unawareness',
            description:'See OWASP Automated Threat #5:\nMass acquisition of goods or services using the application in a manner that a normal user would be unable to undertake manually',
            mitigation:'Defences against this automated threat include control of interaction frequency, enforcement of a single unique a action and enforcement of behavioral workflow',
            ruleId: 'c50e8d53-5e0a-45e7-8c69-be92492ad7dc'
        });    
    }
    if((element.type==='tm.Store'&&element.isEncrypted)){
        suggestions.push({
            title: 'Vulnerable encryption algorithms',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'Out of date encryption algorithms are vulnerable and have known vulnerabilities',
            mitigation:'Use up to date cryptography for all signatures and encryption',
            ruleId: '4fb623f6-2896-4209-8689-ff1b8a932105'
        });    
    }
    if((element.type==='tm.Store'&&element.isSigned)){
        suggestions.push({
            title: 'Vulnerable cryptography',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'Out of date cryptographic techniques are vulnerable and have known vulnerabilities',
            mitigation:'Use up to date cryptographic methods for checksums, signatures and certificates',
            ruleId: '034095d9-9012-4cb5-a7a8-1e19ab72bba3'
        });    
    }
    if((element.type==='tm.Store'&&element.isALog)){
        suggestions.push({
            title: 'Log contains sensetive data',
            type: 'threats.model.linddun.disclosureOfInformation',
            description:'Logs are read by unauthorised users or made public, sensitive data is then disclosed',
            mitigation:'Minimise any sensitive data contained in logs, consider encryption techniques',
            ruleId: '7942656e-51dd-4b15-a38d-deab704878e1'
        });    
    }
    fixupByContext(suggestions, diagram);
    return suggestions;
};


