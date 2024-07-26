// import { Test, TestingModule } from '@nestjs/testing';
// import { LLMService } from './llm.service';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { ConfigModule } from '@nestjs/config';

// describe('LlmserviceService', () => {
//   let service: LLMService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports:[ConfigModule.forRoot()],
//       providers: [LLMService],
//     }).compile();

//     service = module.get<LLMService>(LLMService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('generateOutput', () => {


//     it('should generate an  output ', async () => {
//       const model = 'gpt-3.5-turbo';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product']
//       });


//       const output = await service.generateOutput(model, promptTemplate, {
//         product: 'cars',
//       })

//       expect(output).toBeDefined();
//     });

//     it("should throw if the model given is not available ", async () => {

//       const model = 'gpt-42';
//       const promptTemplate = new PromptTemplate({
//         template: 'What is a good name for a company that makes {product}?',
//         inputVariables: ['product']
//       });

//       await expect(
//         service.generateOutput(model, promptTemplate, {
//           product: 'cars'
//         }),

//       ).rejects.toThrow();


//     })
//   })

// });



import { Test, TestingModule } from '@nestjs/testing';
import { LLMService } from './llm.service';
import { PromptTemplate } from '@langchain/core/prompts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of } from 'rxjs'; // or any other method to mock
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

      // Mock the LLMChain call method if needed to return a dummy result
      const dummyResult = { output: 'SuperCars Inc.' };
      jest.spyOn(service as any, 'generateOutput').mockResolvedValue(dummyResult);

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
        }),
      ).rejects.toThrow(LLMNotAvailableError);
    });

    it("Should throw if the chain values do not match the inpout varaibles of the prompt template", async()=>{
      const model= 'gpt-3.5-turbo';
      const promptTemplate = new PromptTemplate({
        template: 'What is a good name for a company that makes {product}?',
        inputVariables : ['product'],
      });

      const output = await service.generateOutput(model, promptTemplate,{
        wrongValue: 'cars',
      });
      expect(output).rejects.toThrow(PromptTemplateFormateError)
    });



    describe('generateRefineOutput', () => {
      
      it("Should generate the correct output form a chunked document",async()=>{
        const model='gpt-3.5-tubo';
        const text=`
        This is the first sentence of the testing text.\n
        This is the second sentence of the testing text. It contains the tagged value of output: llm-organizer`

        const document= await service.splitDocument(text, 100,0);
        const initialPromptTemplate= new PromptTemplate({
          template: `Give the following text, please write the value to output.
          -------------
          {context}
          -------------
          Output:`,
          inputVariables: ['context']
        });

        const refinePromptTemplate = new PromptTemplate({
          template: `
          Given the following text, please only write the tagged value to output.
          -------------
          You have provided an existing output:
          {existing_answer}
          
          We have the opportunity to reine the original output to give a better answer.
          If the context isn't useful , return the existing output.`,
          inputVariables: ['existing_answer', 'context']
        });

        const output = await service.generateRefineOutput(
          model,
          initialPromptTemplate,
          refinePromptTemplate,
          {
            input_documents: document ,
          }
        );

        expect(output).toBeDefined()
        expect(output['output-text']).toContain('llm-organizer');
      },70000)
    })
    it("Should throw if the chain values do not match the input variables of the prompt template", async () => {
      const model = 'gpt-3.5-turbo';
      const promptTemplate = new PromptTemplate({
      template: 'What is a good name for a company that makes {product}?',
      inputVariables: ['product'],
      });

      const output = await service.generateOutput(model, promptTemplate, {
      wrongValue: 'cars',
      });
      expect(output).rejects.toThrow(PromptTemplateFormateError);
    });
      const model = 'gpt-3.5-turbo';
      const promptTemplate = new PromptTemplate({
      template: 'What is a good name for a company that makes {product}?',
      inputVariables: ['product'],
      });

      const output = await service.generateOutput(model, promptTemplate, {
      wrongValue: 'cars',
      });
      
      expect(output).rejects.toThrow(PromptTemplateFormateError);
    });
});
