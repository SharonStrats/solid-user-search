import { getDocument } from './DocumentCache';
import { TripleSubject } from 'tripledoc';

const pim = {
  storage: 'http://www.w3.org/ns/pim/space#storage'
};
export async function determineUriRef(
  uri: string,
  ref: string,
  doc?: string
): Promise<string | null> {
  const uriSub = await getUriSub(uri, doc);
  if (uriSub === null) {
    return null;
  }
  const ret = uriSub.getRef(ref);
  // console.log('determined uri ref', uri, ref, ret);
  return ret;
}
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
export async function getPodRoot(webId: string | null): Promise<string | null> {
  if (webId === null) {
    return null;
  }

  return determineUriRef(webId, pim.storage);
}
