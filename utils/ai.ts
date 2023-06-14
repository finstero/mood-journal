import { PromptTemplate } from 'langchain'
import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('The mood of the person who wrote the journal entry.'),
    subject: z.string().describe('The subject of the journal entry.'),
    summary: z.string().describe('Short summary of the entire journal entry.'),
    negative: z
      .boolean()
      .describe(
        'Is the journal entry negative? (For example, does it contain negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'A hexidecimal color code that represents the mood of the journal entry. Example #0101fe for blue representing happiness.'
      ),
  })
)

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({ entry: content })
  console.log('input', input);
  
  return input
}

export const analyze = async (content) => {
  // temperature (can be 0-1) basically describes the variance in how random the output will be
  // higher temperature (1) makes it more creative/silly, lower temp makes it more factual/real
  const input = await getPrompt(content)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const result = await model.call(input)

  console.log('result', result)
}
