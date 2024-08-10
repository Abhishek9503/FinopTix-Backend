import { PromptTemplate } from "@langchain/core/prompts";

const jsonZeroShotSchemaExtractionTemplate = `
You are a highly efficient text processing application
Your main objective is to accurately parse the user's input text and transform it into a JSON object that complies with the schema provided below
--------------------------------
JSON schema:
{jsonSchema}
--------------------------------
Please generate the output JSON object containing the necessary information and ensure it follow the given schema.
If the input text contains any attirbutes not mentioned in the schema , please disregard them.
--------------------------------
Input:
{context}
--------------------------------
Output:
`;
 
 const jsonZeroShotSchemaExtractionRefineTemplate = `
 You are a highly efficient text processing application
Your main objective is to accurately parse the user's input text and transform it into a JSON object that complies with the schema provided below
--------------------------------
JSON schema:
{jsonSchema}
--------------------------------
You have povided  an exsiting  output
{existing_answer}

We have the opportunity to refine the existing output (only if needed) to make it more accurate and compliant with the schema provided below
--------------------------------
Context:
{context}
--------------------------------
Given the new context, refine the original output to give a better answer.
If the context isn't useful  return the exisiting output.

Please generate the output JSON object containing the necessary information and ensure it follow the given schema.
If the input text contains any attirbutes not mentioned in the schema , please disregard them.
Dont not add any field that are not in the schema.
All output should be in JSON format and folow the schema specified above.

 `
 
export const jsonZeroShotSchemaExtraction = new PromptTemplate({
    inputVariables: ['context', 'jsonSchema'],
    template: jsonZeroShotSchemaExtractionTemplate,
});

export const jsonZeroShotSchemaExtractionRefine = new PromptTemplate({
    inputVariables: ['jsonSchema', 'context ', 'existing_answer'],
    template: jsonZeroShotSchemaExtractionRefineTemplate,
})