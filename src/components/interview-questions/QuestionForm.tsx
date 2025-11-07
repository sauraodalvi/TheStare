import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuestionFormProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  company: string;
  setCompany: (company: string) => void;
  question: string;
  setQuestion: (question: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  company,
  setCompany,
  question,
  setQuestion,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Question Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g., Google, Amazon, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="question">Your Question</Label>
        <Textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your interview question here..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Analyzing...' : 'Analyze Question'}
      </Button>
    </form>
  );
};

export default QuestionForm;
