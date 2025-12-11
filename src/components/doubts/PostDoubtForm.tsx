
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, X } from 'lucide-react';

const doubtSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  domain: z.string().min(1, 'Please select a domain'),
  tags: z.string().min(1, 'Please add at least one tag'),
});

type DoubtFormData = z.infer<typeof doubtSchema>;

interface PostDoubtFormProps {
  onSuccess: () => void;
}

const domains = [
  'AI/Machine Learning',
  'Quantum Computing',
  'Embedded Systems',
  'Robotics',
  'Compilers',
  'Security/Cryptography',
  'Distributed Systems',
  'Computer Vision',
  'Natural Language Processing',
  'Hardware Design',
  'Performance Optimization',
  'Other'
];

const PostDoubtForm = ({ onSuccess }: PostDoubtFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<DoubtFormData>({
    resolver: zodResolver(doubtSchema),
    defaultValues: {
      title: '',
      description: '',
      domain: '',
      tags: '',
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue('tags', newTags.join(', '));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags.join(', '));
  };

  const onSubmit = async (data: DoubtFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('doubts')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          domain: data.domain,
          tags: tags,
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your doubt has been posted successfully.',
      });

      form.reset();
      setTags([]);
      onSuccess();
    } catch (error) {
      console.error('Error posting doubt:', error);
      toast({
        title: 'Error',
        description: 'Failed to post your doubt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Doubt</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief summary of your doubt (e.g., 'How to optimize CUDA kernel performance?')"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the relevant domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your issue in detail. Include what you've tried, error messages, code snippets, etc."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Doubt'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PostDoubtForm;
