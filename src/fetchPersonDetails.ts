import { vcard } from 'rdf-namespaces';
import { getUriSub } from './uriHelpers';
import { getFollowsCollection, lists } from './friendshipHelpers';
import { getMyWebId } from './getMyWebId';

export enum PersonType {
  me = 'me',
  requester = 'requester',
  requested = 'requested',
  friend = 'friend',
  blocked = 'blocked',
  stranger = 'stranger'
}

// This is basically a model in the MVC sense.
// null means gave up on trying to determine it.
// There may be cases where the view doesn't need to know all aspects of
// the model, but for simplicity, `fetchPersonDetails` will always try to
// be as complete as possible.
export type PersonDetails = {
  webId: string;
  avatarUrl: string | null;
  fullName: string | null;
  follows: string[] | null;
  personType: PersonType | null;
};

export async function getPersonType(
  theirWebId: string
): Promise<PersonType | null> {
  const myWebId = await getMyWebId();

  if (!myWebId) {
    return null;
  }
  if (theirWebId === myWebId) {
    return PersonType.me;
  }
  try {
    const iAmOnTheirList = await lists(theirWebId, myWebId);
    const theyAreOnMyList = await lists(myWebId, theirWebId);

    if (iAmOnTheirList) {
      if (theyAreOnMyList) {
        return PersonType.friend;
      } else {
        return PersonType.requester;
      }
    } else {
      if (theyAreOnMyList) {
        return PersonType.requested;
      } else {
        return PersonType.stranger;
      }
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getPersonDetails(
  webId: string,
  createFriendsGroupIfMissing = false
): Promise<PersonDetails | null> {
  try {
    const profileSub = await getUriSub(webId);
    if (profileSub === null) {
      return null;
    }

    const ret = {
      webId,
      avatarUrl: profileSub.getRef(vcard.hasPhoto) || null,
      fullName: profileSub.getString(vcard.fn) || null,
      follows: await getFollowsCollection(webId, createFriendsGroupIfMissing),
      personType: await getPersonType(webId)
    };
    return ret;
  } catch (e) {
    console.log(e);
    return null; // think about what kind of errors I can return
  }
}

export async function fetchPersonDetails(
  webId: string | null,
  createFriendsGroupIfMissing = false
): Promise<PersonDetails | null | undefined> {
  let personDetails: PersonDetails | null | undefined = null;
  if (webId && !personDetails) {
    try {
      personDetails = await getPersonDetails(
        webId,
        createFriendsGroupIfMissing
      );
      return personDetails;
    } catch (e) {
      console.error(e.message);
      return undefined;
    }
  }
  if (webId === null) {
    return null;
  }
}
