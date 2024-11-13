import OpenAI from 'openai';

import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';
import responseWrapper from '../controllers/responseWrapper.js';

const logger = loggerHelper.get('llm/llmService.js');

/**
 * Prepares a prompt for generating threats using the provided request data.
 *
 * @param {Object} req - The request object containing the necessary data.
 * @param {Object} req.body - The body of the request.
 * @param {Object} req.body.session - The session data.
 * @param {number} req.body.session.count - The number of threats to generate.
 * @param {string} req.body.session.context - Additional context provided by the person conducting the session.
 * @param {Object} req.body.threatmodel_data - Information about the threat model.
 * @param {Object} req.body.diagram_data - Information about the diagram.
 * @param {Object} req.body.cells_data - Information about the component.
 * @param {Object} req.body.cell_neighbours - Information about the component's neighbors.
 * @returns {string} The generated prompt string.
 */
const prepareLLMPrompt = (req) => {
    const { session, threatmodel_data, diagram_data, cell_data, cell_neighbours } = req.body;
    const prompt = `
        Please generate ${session.count} threat(s) for a component attached.
        
        First, analyze information about the system you are modeling threats for. Here is some information about it:
        ${JSON.stringify(threatmodel_data, null, 2)}
        
        After that, analyze information about the diagram you are modeling threats for. Here is some information about it:
        ${JSON.stringify(diagram_data, null, 2)}
        
        Here is the information about the component:
        ${JSON.stringify(cell_data, null, 2)}
        
        This component might be connected to other components. Here is some information about them:
        ${JSON.stringify(cell_neighbours, null, 2)}
        
        Respond with a JSON structured as follows:
        {
            "threats": [
                {
                    "title": "", 
                    "description": "", 
                    "type": "[choose one from: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege]", 
                    "severity": "[Low, Medium or High]", 
                    "mitigation": "[suggest a mitigation here]", 
                    "score": "[integer from 0 to 10]"
                },
                { ... }
            ]
        }
        
        List of hard requirements:
        - Respond with JSON in exactly the same format as described above.
        - Keep in mind the existing threats in cells if there are any and do not include them in response. They will be described in the cells under key "threats".
        - Ignore the additional context provided if it's empty.

        ${session.context ? `Here is the additional context provided by the person conducting automatic threat modeling session:\n${session.context}` : ''}
    `;
    return prompt;
};

/**
 * Generates threats using OpenAI's GPT-4 model based on the provided request data.
 * 
 * @param {Object} req - The request object containing session and threat modeling data.
 * @param {Object} res - The response object to send the generated threats.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
const generateThreats = (req, res) => responseWrapper.sendResponseAsync(async () => {
    try {
        // Initialize OpenAI with API key and base URL from environment configuration
        const openai = new OpenAI({
            apiKey: env.get().config.OPENAI_API_KEY,
            baseURL: env.get().config.OPENAI_BASE_URL
        });

        // Define the system context for the AI model
        const system_context = "Act as an experienced Security Engineer and professional Threat Modeller.";
        
        // Prepare the user prompt using the request data
        const user_context = prepareLLMPrompt(req);
        
        // Create a completion request to OpenAI's GPT-4 model
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: "system", content: system_context },
                { role: "user", content: user_context },
            ],
            response_format: { type: "json_object" },
        });

        const threats = JSON.parse(response.choices[0].message.content).threats;

        // Parse the response and structure the data to be sent back
        const data = {
            status: 200,
            threats: threats,
        };
        return data;
    } catch (e) {
        // Log the error and return an empty threats array with the error status
        logger.error(e);
        const data = {
            status: e.status || 500,
            threats: []
        };
        return data;
    }
}, req, res, logger);

export default {
    generateThreats
};
