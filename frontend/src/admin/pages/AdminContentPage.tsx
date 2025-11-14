import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'urql';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { GET_ADMIN_PAGE_CONTENT, UPDATE_PAGE_CONTENT } from '../../graphql/admin';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FileText, Save, Code, Eye } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { gql, useMutation as useUrqlMutation } from 'urql';
import { Textarea } from '../../components/ui/textarea';

export default function AdminContentPage() {
  const [selectedPage, setSelectedPage] = useState<string>('contact');
  const [sections, setSections] = useState<Record<string, string>>({});
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [codeViewMode, setCodeViewMode] = useState<Record<string, boolean>>({});
  
  const [{ data, fetching }, reexecuteQuery] = useQuery({
    query: GET_ADMIN_PAGE_CONTENT,
    variables: { pageKey: selectedPage },
  });

  const [, updatePageContent] = useMutation(UPDATE_PAGE_CONTENT);
  const GENERATE_PAGE_SEO = gql`
    mutation GeneratePageSEO($pageKey: String!, $title: String, $content: String!) {
      generatePageSEO(pageKey: $pageKey, title: $title, content: $content) {
        success
        message
        seoData {
          metaTitle
          metaDescription
          metaKeywords
          searchKeywords
          seoTranslations
          structuredData
          aiSuggestions
          seoScore
        }
      }
    }
  `;
  const [, generatePageSEO] = useUrqlMutation(GENERATE_PAGE_SEO);

  // Update sections when data changes
  useEffect(() => {
    if (data?.adminPageContent?.sections) {
      const sectionsMap: Record<string, string> = {};
      data.adminPageContent.sections.forEach((section: any) => {
        sectionsMap[section.key] = section.content || '';
      });
      setSections(sectionsMap);
    }
  }, [data]);

  const handleSave = async () => {
    const sectionsInput = Object.entries(sections).map(([key, content]) => ({
      key,
      content,
    }));

    const result = await updatePageContent({
      pageKey: selectedPage,
      input: { sections: sectionsInput },
    });

    if (result.error) {
      toast.error(result.error.message || 'Failed to update page content');
    } else {
      toast.success('Page content updated successfully');
      reexecuteQuery({ requestPolicy: 'network-only' });
    }
  };

  const handleGenerateSEO = async () => {
    const body = sections['body'] || Object.values(sections).join('\n');
    if (!body || body.trim() === '') {
      toast.error('Please add page body/content before generating SEO.');
      return;
    }
    setIsGeneratingSEO(true);
    try {
      const title = data?.adminPageContent?.pageName || selectedPage;
      const res = await generatePageSEO({ pageKey: selectedPage, title, content: body });
      const payload = res.data?.generatePageSEO;
      if (!payload?.success) {
        throw new Error(payload?.message || 'Failed to generate page SEO');
      }
      const seo = payload.seoData;
      setSections(prev => ({
        ...prev,
        meta_title: seo.metaTitle || prev.meta_title || '',
        meta_description: seo.metaDescription || prev.meta_description || '',
        meta_keywords: Array.isArray(seo.metaKeywords) ? seo.metaKeywords.join(', ') : (seo.metaKeywords || prev.meta_keywords || ''),
        structured_data: JSON.stringify(seo.structuredData || {}, null, 2),
        search_keywords: seo.searchKeywords || '',
      }));
      toast.success('Page SEO generated. Review and Save to apply.');
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate SEO');
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const handleSectionChange = (key: string, value: string) => {
    setSections(prev => ({ ...prev, [key]: value }));
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Page Content Management</h2>
          <p className="text-muted-foreground mt-1">
            Edit content for different pages across your site
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Page to Edit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full max-w-xs">
              <Label>Page</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Homepage</SelectItem>
                  <SelectItem value="contact">Contact Us</SelectItem>
                  <SelectItem value="about">About Us</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="privacy">Privacy Policy</SelectItem>
                  <SelectItem value="terms">Terms & Conditions</SelectItem>
                  <SelectItem value="returns">Returns & Warranty</SelectItem>
                  <SelectItem value="cookies">Cookie Policy</SelectItem>
                  <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                  <SelectItem value="warranty">Warranty</SelectItem>
                  <SelectItem value="dispute">Dispute Resolution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {fetching ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading page content...
              </div>
            ) : (
              <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                  {data?.adminPageContent?.pageName || 'Page Content'}
                  </h3>
                  <Button onClick={handleGenerateSEO} disabled={isGeneratingSEO} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {isGeneratingSEO ? 'Generating SEO…' : 'Generate SEO'}
                  </Button>
                </div>

                {data?.adminPageContent?.sections?.map((section: any) => {
                  const isRichText =
                    section.key.includes('content') ||
                    section.key === 'body' ||
                    section.key === 'mission' ||
                    section.key === 'vision';
                  const isCodeView = codeViewMode[section.key] || false;

                  return (
                    <div key={section.key} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor={section.key}>{section.label}</Label>
                        {isRichText && (
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            className="h-7 px-2 text-xs"
                            onClick={() =>
                              setCodeViewMode((prev) => ({
                                ...prev,
                                [section.key]: !prev[section.key],
                              }))
                            }
                          >
                            {isCodeView ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Rich view
                              </>
                            ) : (
                              <>
                                <Code className="h-3 w-3 mr-1" />
                                Code view
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {isRichText ? (
                        isCodeView ? (
                          <Textarea
                            id={section.key}
                            className="font-mono text-xs min-h-[160px]"
                            value={sections[section.key] || ''}
                            onChange={(e) =>
                              handleSectionChange(section.key, e.target.value)
                            }
                            placeholder="<p>HTML content…</p>"
                          />
                        ) : (
                          <div className="border rounded-md">
                            <ReactQuill
                              theme="snow"
                              value={sections[section.key] || ''}
                              onChange={(value) =>
                                handleSectionChange(section.key, value)
                              }
                              modules={quillModules}
                              className="bg-white"
                            />
                          </div>
                        )
                      ) : (
                        <Input
                          id={section.key}
                          value={sections[section.key] || ''}
                          onChange={(e) =>
                            handleSectionChange(section.key, e.target.value)
                          }
                          placeholder={section.label}
                        />
                      )}
                    </div>
                  );
                })}

                {/* SEO Fields */}
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={sections['meta_title'] || ''}
                    onChange={(e) => handleSectionChange('meta_title', e.target.value)}
                    placeholder="Best SEO Title for the page"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    id="meta_description"
                    value={sections['meta_description'] || ''}
                    onChange={(e) => handleSectionChange('meta_description', e.target.value)}
                    placeholder="150-160 characters compelling description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Meta Keywords (comma separated)</Label>
                  <Input
                    id="meta_keywords"
                    value={sections['meta_keywords'] || ''}
                    onChange={(e) => handleSectionChange('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="structured_data">Structured Data (JSON-LD)</Label>
                  <div className="border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={sections['structured_data'] || ''}
                      onChange={(value) => handleSectionChange('structured_data', value)}
                      modules={quillModules}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      reexecuteQuery({ requestPolicy: 'network-only' });
                      toast.info('Page content refreshed');
                    }}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Content Editor Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use the rich text editor for longer content sections</li>
                <li>• Regular input fields are for short titles and headings</li>
                <li>• Changes are saved to database and applied immediately</li>
                <li>• You can add links, images, and formatting using the toolbar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

