import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from "@langchain/openai";
// import { BaseLanguageModel } from  "@langchain/core/base_langugage";
import { BaseLanguageModel } from '@langchain/core/language_models/base'
import { PromptTemplate } from '@langchain/core/prompts';
import { ChainValues } from '@langchain/core/dist/utils/types';
import { LLMChain, loadQARefineChain } from 'langchain/chains'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { LLMNotAvailableError, PromptTemplateFormateError, RefinePromptInputVaribalesError, RefineReservedChainValuesError } from './exceptions/exceptions';
import { Document } from 'langchain/document'

@Injectable()
export class LLMService {
    constructor(private configService: ConfigService) { }

    private gpt3_5 = new ChatOpenAI({
        cache: true,
        maxConcurrency: 10,
        maxRetries: 3,
        modelName: 'gpt-3.5-turbo',
        openAIApiKey: this.configService.get<string>('openApiKey'),
        temperature: 0,

    });

    private gpt4 = new ChatOpenAI({
        cache: true,
        maxConcurrency: 10,
        maxRetries: 3,
        modelName: 'gpt-4',
        openAIApiKey: this.configService.get<string>('openApiKey'),
        temperature: 0,

    });


    private availabemodels = new Map<string, BaseLanguageModel>([
        ['gpt-3.5-turbo', this.gpt3_5],
        ['gpt-4', this.gpt4]
    ])


    async generateOutput(
        model: string,
        promptTemplate: PromptTemplate,
        chainValues: ChainValues
    ) {
        if (!this.availabemodels.has(model)) {
            throw new LLMNotAvailableError(model);
        }

        try{
            await promptTemplate.format(chainValues)
        }
        catch(e){
            throw new PromptTemplateFormateError();
        }


        const llmChain = new LLMChain({
            llm: this.availabemodels.get(model),
            prompt: promptTemplate,
        });


        const output = await llmChain.call(chainValues)
        return output;
    }



    async splitDocument(
        document: string,
        chunkSize = 2000,
        chunkOverlap = 200,) {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,

        });

        const output = await splitter.createDocuments([document]);
        return output
    }


    async generateRefineOutput(
        model: string,
        initialPromptTemplate: PromptTemplate,
        refinePromptTemplate: PromptTemplate,
        chainValues: ChainValues & { input_documents: Document[] },
    ) {
        if (!this.availabemodels.has(model)) {
            throw new LLMNotAvailableError(model);
        }

        if (chainValues['context'] || chainValues['existing_answer']) {
            throw new RefineReservedChainValuesError('context or existing_answer')
        }

        this.throwErrorInputVariableMissing(
            'initailPromptTemplate',
            'context',
            initialPromptTemplate.inputVariables,
        );

        this.throwErrorInputVariableMissing(

            'refinePromptTemplate',
            'context',
            refinePromptTemplate.inputVariables,
        );

        this.throwErrorInputVariableMissing(
            'refineTemplate',
            'existing_answer',
            refinePromptTemplate.inputVariables,
        )
        const refineChain = loadQARefineChain(this.availabemodels.get(model), {
            questionPrompt: initialPromptTemplate,
            refinePrompt: refinePromptTemplate,
        });

        const output = await refineChain.call(chainValues)
        return output;
    }



    private throwErrorInputVariableMissing(
        templateName: string,
        variableName: string,
        inputVariables: string[],
    ) {
        if (!inputVariables.includes(variableName)) {
            throw new RefinePromptInputVaribalesError(templateName, variableName);

        }
    }
}
