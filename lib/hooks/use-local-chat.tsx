import { useState, useEffect, useRef, useCallback } from 'react'
import { Message } from 'ai'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { defaultModel } from '@/lib/const'

interface UseChatOptions {
  initialMessages?: Message[]
  id?: string;
  body?: {
    id?: string;
    previewToken?: string | null
    model?: string
  }
  onResponse?: (response: Response) => void
  onFinish?: (message: Message) => void
}

export function useLocalChat({
  initialMessages = [],
  id,
  body,
  onResponse,
  onFinish
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const router = useRouter();
  const path = usePathname();
  const { data: session } = useSession();
  const updatedMessages = useRef<Message[]>([]);
  const streamedMessageContent = useRef('');
  const apiResponseId = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const appendStreamContent = useCallback((content: string) => {
    streamedMessageContent.current += content;
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: streamedMessageContent.current
        };
      } else {
        newMessages.push({
          id: apiResponseId.current || crypto.randomUUID(),
          role: 'assistant',
          content: streamedMessageContent.current
        });
      }
      return newMessages;
    });
  }, []);

  const append = useCallback(async (message: Message) => {
    setIsLoading(true);
    streamedMessageContent.current = '';
    apiResponseId.current = null;
    updatedMessages.current = [...updatedMessages.current, message];
    setMessages(prev => [...prev, message]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${body?.previewToken}`
        },
        body: JSON.stringify({
          model: body?.model || defaultModel,
          messages: updatedMessages.current.map(msg => ({ role: msg.role, content: msg.content })),
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      onResponse?.(response);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '' || trimmedLine === 'data: [DONE]') continue;

          try {
            const data = JSON.parse(trimmedLine.slice(6));
            if (data.id && !apiResponseId.current) {
              apiResponseId.current = data.id;
            }
            const content = data.choices[0]?.delta?.content || '';
            if (content) {
              appendStreamContent(content);
            }
          } catch (error) {
            console.error('Error parsing stream:', error);
          }
        }
      }

      const finalMessage: Message = {
        id: apiResponseId.current || crypto.randomUUID(),
        role: 'assistant',
        content: streamedMessageContent.current
      };
      updatedMessages.current.push(finalMessage);
      onFinish?.(finalMessage);

      if (!path.includes('chat')) {
        router.replace(`/chat/${id}`);
      }

    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error in chat completion:', error);
        toast.error('An error occurred while processing your request.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [body, id, path, router, onResponse, onFinish, appendStreamContent]);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      toast.success('Output stopped');
    }
  }, []);

  // regenerate response
  const reload = useCallback(() => {
    if (messages.length < 2) {
      toast.error('Not enough messages to reload.');
      return;
    }
  
    const lastUserMessageIndex = messages.findLastIndex(message => message.role === 'user');
    
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[lastUserMessageIndex]
      messages.splice(lastUserMessageIndex + 1);
      setMessages([...messages])
      updatedMessages.current = messages;

      stop();

      append(lastUserMessage);
    } else {
      toast.error('No user message found to reload.');
    }
  }, [messages, append, stop]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return {
    messages,
    setMessages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  };
}