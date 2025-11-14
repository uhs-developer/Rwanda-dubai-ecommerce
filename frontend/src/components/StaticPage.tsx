import { useQuery } from 'urql';
import { GET_PAGE_CONTENT } from '../graphql/storefront';
import { PageWrapper } from './PageWrapper';

interface StaticPageProps {
  pageKey: string;
  titleFallback?: string;
  subtitleFallback?: string;
}

export function StaticPage({ pageKey, titleFallback = '', subtitleFallback = '' }: StaticPageProps) {
  const [{ data }] = useQuery({
    query: GET_PAGE_CONTENT,
    variables: { pageKey },
  });

  const pageContent = data?.adminPageContent;

  const getContent = (key: string, fallback = '') => {
    const section = pageContent?.sections?.find((s: any) => s.key === key);
    return section?.content || fallback;
  };

  const title = getContent('title', titleFallback);
  const heroTitle = getContent('hero_title', title || titleFallback);
  const heroSubtitle = getContent('hero_subtitle', subtitleFallback);

  const sections = (pageContent?.sections ?? []).filter(
    (s: any) => !['title', 'hero_title', 'hero_subtitle'].includes(s.key)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <PageWrapper className="py-10">
          <h1 className="text-3xl font-bold text-gray-900">{heroTitle}</h1>
          {heroSubtitle ? <p className="text-gray-600 mt-2">{heroSubtitle}</p> : null}
        </PageWrapper>
      </div>
      <PageWrapper className="py-10">
        <div className="prose max-w-none prose-lg">
          {sections.map((s: any) => (
            <section key={s.key}>
              {s.label ? <h2>{s.label}</h2> : null}
              <div dangerouslySetInnerHTML={{ __html: s.content }} />
            </section>
          ))}
        </div>
      </PageWrapper>
    </div>
  );
}


