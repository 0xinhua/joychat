import { IconBard, IconMeta, IconOpenai } from "@/components/ui/icons"
import { nanoid } from "./utils"

export const defaultSystemPrompt = "You are a helpful assistant, you always give concise answers."
export const isLocalMode = process.env.NEXT_PUBLIC_STORAGE_MODE === 'local'
export const defaultModel = process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'gpt-4o'
export const useLangfuse = !!process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY && !!process.env.NEXT_PUBLIC_LANGFUSE_BASE_URL

export const models = [
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

export const quickstartMessages = [
  {
    heading: '💡 Data analysis',
    message: `Summarize the key characteristics of this dataset. Include information on data types, missing values, and basic statistics. The following dataset: 
\n`
  },
  {
    heading: `📖 Summarize content`,
    message: `Your task is to review the provided content and create a concise summary that captures the essential information.
Use clear and professional language. summarized content use the language in which the user entered the content, organize the summary logically with appropriate formatting, such as headings, subheadings, and bullet points. Ensure that the summary is easy to understand.
  \n The content: 
  \n`
  },
  {
    heading: '📧 Format and correct email',
    message: `Proofread and format [email]. Also, give suggestions for getting the point across effectively.

[email] following: 
\n`
  },
  {
    heading: '🔠 Translate English',
    message: `You will be provided with statements, and your task is to convert them to standard English.

[statements] following:
\n`
  },
  {
    heading: '🈳 Translate Chinese',
    message: `You will be provided with statements, and your task is to convert them to simplified Chinese, In the translated text, English words and numbers should be preceded and followed by a space.

[statements] following: 
\n`
  },
  {
    // prompt form  https://x.com/dotey/status/1800696118642458775
    heading: '🧬 Translate Sci article',
    message: `You are a professional translator proficient in Simplified Chinese, specializing in translating professional academic papers into easy-to-understand popular science articles. Please help me translate the following foreign language paragraphs into Chinese, in a style similar to Chinese popular science readings.

    ## Rules 
    - Response in 简体中文 by default until the user ask you response in specific language.
    - Accurately convey the facts and background of the original text while translating.
    - Maintain the original paragraph format and retain terminology, such as FLAC, JPEG, etc.
    - Input and output formats must preserve the original Markdown format, including images, code blocks, etc.
    - When translating professional terms, write the English original in parentheses after the term in Chinese the first time it appears, e.g., "生成式AI (Generative AI)"; afterwards, you can just use the Chinese term.
    - The following content should remain in the original language or term:
      * Company names
      * Names of people
      * Proper nouns: Transformer, Token, Apple Vision Pro, Gemini
    - Here is a common professional vocabulary correspondence table (English -> Chinese):
      * AI Agent -> AI 智能体
      * LLM/Large Language Model -> 大语言模型
      * Zero-shot -> 零样本
      * Few-shot -> 少样本
      * AGI -> 通用人工智能
      * Transformer -> Transformer
      * Token -> Token
    
    ## Strategy:
    If the user needs to translate content based on a URL, first use the Action to obtain web page content by URL. If the web page content cannot be obtained, inform the user based on the error message. After obtaining the web page content, translate the content according to the rules.
    
    Proceed with the translation in 3 steps, and print the results of each step:
    1. Translate directly from the English content, respecting the original intent, keeping the original paragraph and text format unchanged, not deleting or omitting any content, including preserving all original Markdown elements like images, code blocks, etc.
    2. Reflect on the results of the direct translation, identifying specific issues, accurately describing specific problems and text locations, including but not limited to:
      - Not conforming to Chinese expression habits, clearly indicating the text location
      - Difficult to understand statements that are not easily understandable by readers, providing explanations
      - Preservation issues of original Markdown elements, specifically pointing out if anything was missed
      - Miss any elements? images, headings, etc
    3. Based on the results of the direct translation and the reflection, reinterpret the content, ensuring the original intent is preserved while making it easier to understand and more in line with Chinese expression habits, maintaining the original paragraph and text format unchanged, not deleting or omitting any content, including all original Markdown elements.
    
    ## Output Format

    ### 直译
    {...}

    ***

    ### 反思
    {...}

    ***

    ### 意译
    {...}

    following is original content: 

    \n
    `
  }
]

export type Plan = 'free' | 'pro';

export const plans: Record<Plan | string, { name: string; model: string; tokenLimit: number; }> = {
  'free': {
    "name": "free",
    "model": "gpt-4o",
    "tokenLimit": 199800,
  },
  'pro': {
    "name": "pro",
    "model": "gpt-4o",
    "tokenLimit": 1114286,
  }
}

export const inputCostPerMillion = 5.00
export const outputCostPerMillion = 15.00