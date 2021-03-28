export async function getFollowsCollection(
  webId: string,
  createIfMissing = false
): Promise<string[] | null> {
  /*try {
    const friendsGroupRef: string | null = await getFriendsGroupRef(
      webId,
      createIfMissing
    );
    if (!friendsGroupRef) {
      return null;
    }
    const friendsGroupSub = await getUriSub(friendsGroupRef);
    if (!friendsGroupSub) {
      return null;
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
  } */
  return null;
}
