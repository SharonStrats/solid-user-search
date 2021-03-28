export async function getFriendsGroupRef(
  webId: string | null,
  createIfMissing: boolean
): Promise<string | null> {
  if (webId === null) {
    return null;
  }
  /*
  let ret = await determineUriRef(webId, as.following);

  if (createIfMissing && !ret) {
    ret = await createFriendsGroup(webId);
  }

  return ret;*/
  return null;
}
