// import { Test, TestingModule } from '@nestjs/testing';
// import { LLMService } from './llm.service';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { LLMNotAvailableError, PromptTemplateFormateError } from './exceptions/exceptions';

// describe('LLMService', () => {
//   let service: LLMService;
//   let configService: ConfigService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [ConfigModule.forRoot()],
//       providers: [
//         LLMService,
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn().mockImplementation((key: string) => {
//               switch (key) {
//                 case 'openApiKey':
//                   return 'test-openai-api-key';
//                 default:
//                   return null;
//               }
//             }),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<LLMService>(LLMService);
//     configService = module.get<ConfigService>(ConfigService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('generateOutput', () => {
//     it('should generate an output', async () => {
//       const model = 'gpt-3.5-turbo';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       const dummyResult = { output: 'SuperCars Inc.' };
//       jest.spyOn(service, 'generateOutput').mockResolvedValue(dummyResult);

//       const output = await service.generateOutput(model, promptTemplate, {
//         product: 'cars',
//       });

//       expect(output).toBeDefined();
//       expect(output).toEqual(dummyResult);
//     });

//     it('should throw if the model given is not available', async () => {
//       const model = 'gpt-42';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       await expect(
//         service.generateOutput(model, promptTemplate, {
//           product: 'cars',
//         })
//       ).rejects.toThrow(LLMNotAvailableError);
//     });

//     it('should throw if the chain values do not match the input variables of the prompt template', async () => {
//       const model = 'gpt-3.5-turbo';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       await expect(
//         service.generateOutput(model, promptTemplate, {
//           wrongValue: 'cars',
//         })
//       ).rejects.toThrow(PromptTemplateFormateError);
//     });
//   });

//   describe('generateRefineOutput', () => {
//     it('should generate the correct output from a chunked document', async () => {
//       const model = 'gpt-3.5-turbo';
//       const text = `
//         This is the first sentence of the testing text.
//         This is the second sentence of the testing text. It contains the tagged value of output: llm-organizer`;

//       const document = await service.splitDocument(text, 100, 0);
//       const initialPromptTemplate = new PromptTemplate({
//         template: `Given the following text, please write the value to output.
//         -------------
//         {context}
//         -------------
//         Output:`,
//         inputVariables: ['context'],
//       });

//       const refinePromptTemplate = new PromptTemplate({
//         template: `
//         Given the following text, please only write the tagged value to output.
//         -------------
//         You have provided an existing output:
//         {existing_answer}

//         We have the opportunity to refine the original output to give a better answer.
//         If the context isn't useful, return the existing output.`,
//         inputVariables: ['existing_answer', 'context'],
//       });

//       const output = await service.generateRefineOutput(
//         model,
//         initialPromptTemplate,
//         refinePromptTemplate,
//         {
//           input_documents: document,
//         }
//       );

//       expect(output).toBeDefined();
//       expect(output['output-text']).toContain('llm-organizer');
//     }, 70000);


//     it('should throw if the model given is not available', async () => {
//       const model = 'gpt-42';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       await expect(
//         service.generateRefineOutput(model, promptTemplate, promptTemplate, {
//          input_documents: [],
//         })
//       ).rejects.toThrow(LLMNotAvailableError);
//     });


//     it('should throw if there are reserved input variables in chainValues  ', async () => {
//       const model = 'gpt-3.5-turbo';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       const output =await  service.generateRefineOutput(model, promptTemplate, promptTemplate, {
//             input_documents: [],
//             context: 'Not allowed'
//           },
//       )
//       expect(output).toThrow('Reserved input variables are not allowed');
//     });


//     it('should throw if inital prompt template does not have context inut variable ', async () => {
//       const model = 'gpt-3.5-turbo';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       const output =await  service.generateRefineOutput(model, promptTemplate,promptTemplate, {
//             input_documents: [],
//           },
//       )
//       expect(output).toThrow('Initial prompt template must have context input variable');
//     });


//     it('should throw if refine prompt template does not have context have variable ', async () => {
//       const model = 'gpt-3.5-turbo';
//       const initailPromptTemplate  = new PromptTemplate({
//         template: 'What is a good name for a company that makes {context}?',
//         inputVariables: ['context'],
//       });

//       const refinePromptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       const output =await  service.generateRefineOutput(model, initailPromptTemplate,refinePromptTemplate, {
//             input_documents: [],
//           },
//       )
//       expect(output).toThrow('Refine prompt template must have context input variable');
//     });


//     it('should tthrow if the refine prompt template does not have existing_answer input variable ', async () => {
//       const model = 'gpt-3.5-turbo';
//       const initailPromptTemplate  = new PromptTemplate({
//         template: 'What is a good name for a company that makes {context}?',
//         inputVariables: ['context'],
//       });

//       const refinePromptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product'],
//       });

//       const output =await  service.generateRefineOutput(model, initailPromptTemplate,refinePromptTemplate, {
//             input_documents: [],
//           },
//       )
//       expect(output).toThrow('Refine prompt template must have context input variable');
//     });

//   });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { LLMService } from './llm.service';
import { PromptTemplate } from '@langchain/core/prompts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LLMNotAvailableError, PromptTemplateFormateError } from './exceptions/exceptions';

describe('LLMService', () => {
  let service: LLMService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        LLMService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'openApiKey':
                  return 'test-openai-api-key';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LLMService>(LLMService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateOutput', () => {
    it('should generate an output', async () => {
      const model = 'gpt-3.5-turbo';
      const promptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      const dummyResult = { output: 'SuperCars Inc.' };
      jest.spyOn(service, 'generateOutput').mockResolvedValue(dummyResult);

      const output = await service.generateOutput(model, promptTemplate, {
        product: 'cars',
      });

      expect(output).toBeDefined();
      expect(output).toEqual(dummyResult);
    });

    it('should throw if the model given is not available', async () => {
      const model = 'gpt-42';
      const promptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      await expect(
        service.generateOutput(model, promptTemplate, {
          product: 'cars',
        })
      ).rejects.toThrow(LLMNotAvailableError);
    });

    it('should throw if the chain values do not match the input variables of the prompt template', async () => {
      const model = 'gpt-3.5-turbo';
      const promptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      await expect(
        service.generateOutput(model, promptTemplate, {
          wrongValue: 'cars',
        })
      ).rejects.toThrow(PromptTemplateFormateError);
    });
  });

  describe('generateRefineOutput', () => {
    it('should generate the correct output from a chunked document', async () => {
      const model = 'gpt-3.5-turbo';
      const text = `
        This is the first sentence of the testing text.
        This is the second sentence of the testing text. It contains the tagged value of output: llm-organizer`;

      const document = await service.splitDocument(text, 100, 0);
      const initialPromptTemplate = new PromptTemplate({
        template: `Given the following text, please write the value to output.
        -------------
        {context}
        -------------
        Output:`,
        inputVariables: ['context'],
      });

      const refinePromptTemplate = new PromptTemplate({
        template: `
        Given the following text, please only write the tagged value to output.
        -------------
        You have provided an existing output:
        {existing_answer}
        
        We have the opportunity to refine the original output to give a better answer.
        If the context isn't useful, return the existing output.`,
        inputVariables: ['existing_answer', 'context'],
      });

      const output = await service.generateRefineOutput(
        model,
        initialPromptTemplate,
        refinePromptTemplate,
        {
          input_documents: document,
        }
      );

      expect(output).toBeDefined();
      expect(output['output-text']).toContain('llm-organizer');
    }, 70000);

    it('should throw if the model given is not available', async () => {
      const model = 'gpt-42';
      const promptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      await expect(
        service.generateRefineOutput(model, promptTemplate, promptTemplate, {
          input_documents: [],
        })
      ).rejects.toThrow(LLMNotAvailableError);
    });

    it('should throw if there are reserved input variables in chainValues', async () => {
      const model = 'gpt-3.5-turbo';
      const promptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      await expect(
        service.generateRefineOutput(model, promptTemplate, promptTemplate, {
          input_documents: [],
          context: 'Not allowed'
        })
      ).rejects.toThrow('Reserved input variables are not allowed');
    });

    it('should throw if initial prompt template does not have context input variable', async () => {
      const model = 'gpt-3.5-turbo';
      const initialPromptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      const refinePromptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {context}?',
        inputVariables: ['context'],
      });

      await expect(
        service.generateRefineOutput(model, initialPromptTemplate, refinePromptTemplate, {
          input_documents: [],
        })
      ).rejects.toThrow('Initial prompt template must have context input variable');
    });

    it('should throw if refine prompt template does not have context input variable', async () => {
      const model = 'gpt-3.5-turbo';
      const initialPromptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {context}?',
        inputVariables: ['context'],
      });

      const refinePromptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      await expect(
        service.generateRefineOutput(model, initialPromptTemplate, refinePromptTemplate, {
          input_documents: [],
        })
      ).rejects.toThrow('Refine prompt template must have context input variable');
    });

    it('should throw if refine prompt template does not have existing_answer input variable', async () => {
      const model = 'gpt-3.5-turbo';
      const initialPromptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {context}?',
        inputVariables: ['context'],
      });

      const refinePromptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables: ['product'],
      });

      await expect(
        service.generateRefineOutput(model, initialPromptTemplate, refinePromptTemplate, {
          input_documents: [],
        })
      ).rejects.toThrow('Refine prompt template must have existing_answer input variable');
    });
  });
});