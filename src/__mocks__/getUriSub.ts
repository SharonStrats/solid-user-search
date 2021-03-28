import { TripleSubject } from 'tripledoc';
import { getDocument } from '../DocumentCache';
export async function getUriSub(
  uri: string,
  docUrl?: string
): Promise<TripleSubject | null> {
  if (!docUrl) {
    docUrl = uri;
  }
  const doc = await getDocument(docUrl);
  if (doc === null) {
    return null;
  }
  return Object.assign(
    {
      save: doc.save.bind(doc)
    },
    doc.getSubject(uri)
  );
}
