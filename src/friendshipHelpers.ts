import { vcard, foaf } from 'rdf-namespaces';
import { getUriSub, determineUriRef } from './uriHelpers';
import { createFriendsGroup } from './createFriendsGroup';

const as = {
  following: 'https://www.w3.org/TR/activitypub/#following'
};

export async function lists(
  webId1: string,
  webId2: string
): Promise<boolean | null> {
  const followsCollection = await getFollowsCollection(webId1);
  if (!followsCollection) {
    return null;
  }

  return followsCollection.indexOf(webId2) !== -1;
}
export async function getFriendsGroupRef(
  webId: string | null,
  createIfMissing: boolean
): Promise<string | null> {
  if (webId === null) {
    return null;
  }
  try {
    let ret = await determineUriRef(webId, as.following);

    if (createIfMissing && !ret) {
      try {
        ret = await createFriendsGroup(webId);
      } catch (e) {
        console.log(e);
      }
    }

    return ret;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getFollowsCollection(
  webId: string,
  createIfMissing = false
): Promise<string[] | null> {
  try {
    const friendsGroupRef: string | null = await getFriendsGroupRef(
      webId,
      createIfMissing
    );
    //if there there is no friend reference..  friend.ttl#this..  return null
    if (!friendsGroupRef) {
      return null;
    }

    const friendsGroupSub = await getUriSub(friendsGroupRef);
    if (!friendsGroupSub) {
      const profile = await getUriSub(webId);
      if (profile) {
        return profile.getAllRefs(foaf.knows);
      } else {
        return null;
      }
    }

    const friends = friendsGroupSub.getAllRefs(vcard.hasMember);

    const profile = await getUriSub(webId);
    if (profile) {
      return friends.concat(profile.getAllRefs(foaf.knows));
    }
    return friends;
  } catch (e) {
    // console.log('something went wrong while fetching (403?)', friendsGroupRef);
    const profile = await getUriSub(webId);
    if (profile) {
      return profile.getAllRefs(foaf.knows);
    }
    return null;
  }
}
