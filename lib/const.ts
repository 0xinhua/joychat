import { IconBard, IconMeta, IconOpenai } from "@/components/ui/icons"

export const defaultSystemPrompt = "You are a helpful assistant."
export const isLocalMode = process.env.NEXT_PUBLIC_STORAGE_MODE === 'local'
export const defaultModel = process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'gpt-4o-mini'
export const useLangfuse = !!process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY && !!process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL

export const availableModels = [
  {
    value: 'gpt-4o-mini',
    label: 'gpt-4o-mini',
    icon: IconOpenai,
    disabled: false
  },
  {
    value: 'gpt-4o',
    label: 'gpt-4o',
    icon: IconOpenai,
    disabled: false
  },
  // {
  //   value: 'gpt-4',
  //   label: 'gpt-4-turbo',
  //   icon: IconOpenai,
  //   disabled: false
  // },
  // {
  //   value: 'llama3-8b',
  //   label: 'llama3-8b',
  //   icon: IconMeta,
  //   disabled: true
  // },
  // {
  //   value: 'gemini-1.5-flash-latest',
  //   label: 'gemini-1.5-flash-latest',
  //   icon: IconBard,
  //   disabled: true
  // },
]

export const defaultCustomPrompts = [
  {
    id: '2720c512-aaa2-45e5-a667-57c5f70c8718',
    heading: '✍️ Improve writing',
    system_prompt: `${defaultSystemPrompt} You're good at spelling correction and sentence optimization.`,
    user_message: `You are a highly skilled spelling corrector and text improver. Your task is to correct any spelling errors in the given text and suggest improvements to enhance its clarity and readability. Follow these steps carefully:

    1. First, you will be presented with a piece of text that may contain spelling errors and areas for improvement.
    
    2. Carefully read through the text and identify any spelling errors. Correct these errors, ensuring that you maintain the original meaning and context of the text.
    
    3. After correcting spelling errors, consider ways to improve the text's clarity and readability. This may include:
       - Simplifying complex sentences
       - Improving word choice
       - Enhancing sentence structure
       - Ensuring consistent tense and voice
       - Removing redundancies
    
    4. Provide your output in the following format:
    
      Optimized text:
      -------
      [Insert the corrected optimized text here]
    
      Corrected detail:
      -------
      [Insert the text with spelling errors corrected here, use list "-" and arrow "->", format examples: ]
    
      - struture -> structure
    
      Improved detail:
      -------
    
      [Insert the improved text here, use list "-" and arrow "->", format examples:]
    
      - One of most requested feature -> One of the most requested features
    
    Remember to maintain the original meaning and tone of the text while making improvements. If the original text is already well-written and doesn't require significant changes. Here is the text you need to work on: 
    \n`
  },
  {
    id: '5a0372bd-3871-4923-8da9-44a0d511bdb9',
    heading: `📖 Summarize content`,
    system_prompt: defaultSystemPrompt,
    user_message: `You are tasked with summarizing a document into a maximum of 10 bullet points.

    To create an effective summary, follow these steps:
    
    1. Carefully read through the entire document to understand its main ideas and key points.
    
    2. Identify the most important information, focusing on main concepts, crucial details, and significant conclusions.
    
    3. Condense this information into clear, concise bullet points.
    
    4. Limit your summary to a maximum of 10 bullet points. If the document is short or simple, you may use fewer bullet points, but never exceed 10.
    
    5. Ensure that each bullet point captures a distinct and important idea from the document.
    
    6. Present the bullet points in a logical order that reflects the structure and flow of the original document.
    
    When creating your bullet points, adhere to these guidelines:
    
    - Keep each bullet point brief and to the point, ideally no more than one or two sentences.
    - Use clear, straightforward language.
    - Avoid redundancy between bullet points.
    - Do not include minor details or examples unless they are crucial to understanding the main point.
    - Ensure that the bullet points, when read together, provide a comprehensive overview of the document's key information.
    
    Present your summary with each bullet point on a new line, preceded by a dash (-). For example:
    
    Summary:
    - First key point
    - Second key point
    - Third key point
    
    Begin your summarization now， here is the document to be summarized:
  \n`
  },
  {
    id: 'ef02948d-48bd-43c9-9fde-5f5de4c16bc5',
    heading: '📧 Format and correct email',
    system_prompt: defaultSystemPrompt,
    user_message: `Proofread and format [email]. Also, give suggestions for getting the point across effectively.

[email] following: 
\n`
  },
  {
    id: '396edc07-b571-4377-b32b-730d2db45a89',
    heading: '🔠 Translate English',
    system_prompt: defaultSystemPrompt,
    user_message: `You will be provided with statements, and your task is to convert them to standard English.

[statements] following:
\n`
  },
  {
    id: 'b0be08b1-d6aa-4896-8db9-93cca4cc4c07',
    heading: '🈳 Translate Chinese',
    system_prompt: defaultSystemPrompt,
    user_message: `You will be provided with statements, and your task is to convert them to simplified Chinese, In the translated text, English words and numbers should be preceded and followed by a space.

[statements] following: 
\n`
  },
  // {
  //   // prompt form  https://x.com/dotey/status/1800696118642458775
  //   heading: '🧬 Translate Sci article',
  //   message: `You are a professional translator proficient in Simplified Chinese, specializing in translating professional academic papers into easy-to-understand popular science articles. Please help me translate the following foreign language paragraphs into Chinese, in a style similar to Chinese popular science readings.

  //   ## Rules 
  //   - Response in 简体中文 by default until the user ask you response in specific language.
  //   - Accurately convey the facts and background of the original text while translating.
  //   - Maintain the original paragraph format and retain terminology, such as FLAC, JPEG, etc.
  //   - Input and output formats must preserve the original Markdown format, including images, code blocks, etc.
  //   - When translating professional terms, write the English original in parentheses after the term in Chinese the first time it appears, e.g., "生成式AI (Generative AI)"; afterwards, you can just use the Chinese term.
  //   - The following content should remain in the original language or term:
  //     * Company names
  //     * Names of people
  //     * Proper nouns: Transformer, Token, Apple Vision Pro, Gemini
  //   - Here is a common professional vocabulary correspondence table (English -> Chinese):
  //     * AI Agent -> AI 智能体
  //     * LLM/Large Language Model -> 大语言模型
  //     * Zero-shot -> 零样本
  //     * Few-shot -> 少样本
  //     * AGI -> 通用人工智能
  //     * Transformer -> Transformer
  //     * Token -> Token
    
  //   ## Strategy:
  //   If the user needs to translate content based on a URL, first use the Action to obtain web page content by URL. If the web page content cannot be obtained, inform the user based on the error message. After obtaining the web page content, translate the content according to the rules.
    
  //   Proceed with the translation in 3 steps, and print the results of each step:
  //   1. Translate directly from the English content, respecting the original intent, keeping the original paragraph and text format unchanged, not deleting or omitting any content, including preserving all original Markdown elements like images, code blocks, etc.
  //   2. Reflect on the results of the direct translation, identifying specific issues, accurately describing specific problems and text locations, including but not limited to:
  //     - Not conforming to Chinese expression habits, clearly indicating the text location
  //     - Difficult to understand statements that are not easily understandable by readers, providing explanations
  //     - Preservation issues of original Markdown elements, specifically pointing out if anything was missed
  //     - Miss any elements? images, headings, etc
  //   3. Based on the results of the direct translation and the reflection, reinterpret the content, ensuring the original intent is preserved while making it easier to understand and more in line with Chinese expression habits, maintaining the original paragraph and text format unchanged, not deleting or omitting any content, including all original Markdown elements.
    
  //   ## Output Format

  //   ### 直译
  //   {...}

  //   ***

  //   ### 反思
  //   {...}

  //   ***

  //   ### 意译
  //   {...}

  //   following is original content: 

  //   \n
  //   `
  // }
  {
    id: '13464dd7-29e1-4f8c-a2b5-f0c1f6c6e4ea',
    heading: '🐛 Fix code bugs',
    system_prompt: defaultSystemPrompt,
    user_message: `Your task is to analyze the provided code snippet, identify any bugs or errors present, and provide a corrected version of the code that resolves these issues. Explain the problems you found in the original code and how your fixes address them. The corrected code should be functional, efficient, and adhere to best practices in programming. The code:
\n`
  },
]

export const defaultPromptsHeading = [
  '🏖️ Work-life balance copilot',
  // '🔄 Awesome translator',
  '🚀 My awesome tool',
  '🤖 Work Assistant',
  // '🌟 Brainstorming Buddy',
  // '🥷 Clock-Out Ninja',
  // '📨 Mailbox Maestro'
]

export type PlanName = 'free' | 'pro'
export type ModelName = 'gpt-4o' | 'gpt-4o-mini'

export const plans: Record<PlanName, Record<ModelName, { model: string; tokenLimit: number; inputTokenLimit: number; outputTokenLimit: number; }>> = {
  'free': {
    'gpt-4o': {
      model: "gpt-4o",
      tokenLimit: 142857,
      inputTokenLimit: 114286,
      outputTokenLimit: 28571,
    },
    'gpt-4o-mini': {
      model: "gpt-4o-mini",
      tokenLimit: 4166666,
      inputTokenLimit: 3333333,
      outputTokenLimit: 833333,
    },
  },
  'pro': {
    'gpt-4o': {
      model: "gpt-4o",
      tokenLimit: 2142857,
      inputTokenLimit: 1714286,
      outputTokenLimit: 428571,
    },
    'gpt-4o-mini': {
      model: "gpt-4o-mini",
      tokenLimit: 62500000,
      inputTokenLimit: 50000000,
      outputTokenLimit: 12500000,
    },
  }
}

export const tokenCosts = {
  'gpt-4o': {
    inputCostPerMillion: 5.00,
    outputCostPerMillion: 15.00
  },
  'gpt-4o-mini': {
    inputCostPerMillion: 0.150,
    outputCostPerMillion: 0.600
  }
}
