import { useState } from 'react';
import { Send, Bot, User, Loader2, Plus, Library } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Question } from '@/types/paper';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  generatedQuestion?: Question;
}

interface ChatBotProps {
  onGenerateQuestion?: (question: Question) => void;
  onToggleChatBot?: () => void;
}

export const ChatBot = ({ onGenerateQuestion, onToggleChatBot }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you generate questions for your paper. You can ask me to create questions on specific topics, with particular difficulty levels, or for certain mark allocations.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateBotResponse(inputValue);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        generatedQuestion: response.question
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): { text: string; question?: Question } => {
    const input = userInput.toLowerCase();
    
    if (input.includes('algebra') || input.includes('equation')) {
      const question: Question = {
        id: `ai-q-${Date.now()}`,
        text: 'Solve for x: 3x + 7 = 22',
        type: 'Short Answer',
        difficulty: 'Medium',
        marks: 3,
        chapter: 'Algebra'
      };
      return {
        text: 'I\'ve generated an algebra question for you. You can add it to your paper using the button below.',
        question
      };
    } else if (input.includes('geometry') || input.includes('triangle')) {
      const question: Question = {
        id: `ai-q-${Date.now()}`,
        text: 'In a right-angled triangle, if one angle is 30°, find the other two angles.',
        type: 'Short Answer',
        difficulty: 'Easy',
        marks: 2,
        chapter: 'Geometry'
      };
      return {
        text: 'Here\'s a geometry question about triangles. Click the button below to add it to your paper.',
        question
      };
    } else if (input.includes('easy') || input.includes('simple')) {
      const question: Question = {
        id: `ai-q-${Date.now()}`,
        text: 'What is 15% of 200?',
        type: 'Short Answer',
        difficulty: 'Easy',
        marks: 2,
        chapter: 'Percentage'
      };
      return {
        text: 'I\'ve created an easy percentage question for you.',
        question
      };
    } else if (input.includes('hard') || input.includes('difficult')) {
      const question: Question = {
        id: `ai-q-${Date.now()}`,
        text: 'Prove that the sum of squares of the sides of a parallelogram equals the sum of squares of its diagonals.',
        type: 'Long Answer',
        difficulty: 'Hard',
        marks: 5,
        chapter: 'Geometry'
      };
      return {
        text: 'Here\'s a challenging geometry proof question.',
        question
      };
    } else {
      return {
        text: 'I can help you create questions! Try asking me to generate questions for specific topics like "Create an algebra question" or "Generate a hard geometry problem".'
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    'Generate an easy algebra question',
    'Create a 5-mark geometry problem',
    'Make a medium difficulty calculus question',
    'Generate questions for Chapter 5'
  ];

  return (
    <div className="flex-1 bg-background border-r border-border flex flex-col">
      <div className="p-6 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">AI Question Generator</h2>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleChatBot}
            className="flex items-center space-x-1"
          >
            <Library className="h-4 w-4" />
            <span className="text-sm">Question Library</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Ask me to generate questions for your paper
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-4 w-4 mt-0.5 text-primary" />
                  )}
                  {message.sender === 'user' && (
                    <User className="h-4 w-4 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.generatedQuestion && (
                      <div className="mt-3 p-3 bg-card border border-border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">Generated Question:</p>
                        <p className="text-sm font-medium mb-2">{message.generatedQuestion.text}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {message.generatedQuestion.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {message.generatedQuestion.difficulty}
                            </Badge>
                            <span>{message.generatedQuestion.marks} marks</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => onGenerateQuestion?.(message.generatedQuestion!)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add to Paper
                          </Button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generating response...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border bg-card/30">
        {/* Quick Prompts */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => setInputValue(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to generate a question..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};