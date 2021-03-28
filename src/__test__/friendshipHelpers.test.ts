import {
  getFriendsGroupRef,
  getFollowsCollection,
  lists
} from '../friendshipHelpers';

//Test getFriendsGroupRef which calls 2 async functions
//determineUriRef(webId, as.following) and createFriendsGroup(webId)
//returns the friendsGroupReference
describe('getFriendsGroupRef', () => {
  jest.mock('../__mocks__/getFollowsCollection');
  jest.mock('../__mocks__/getFriendsGroupRef');
  jest.mock('../__mocks__/getUriSub');
  jest.mock('../friendshipHelpers');
  //Test getFollowsCollection
  //getFollowsCollection calls 2 async functions getFriendsGroupRef and getUriSub
  it('should ..', async () => {
    const mockGetFriendsGroupRef: jest.Mock = require.requireMock(
      '../friendshipHelpers'
    ).getFriendsGroupRef;
    mockGetFriendsGroupRef.mockReturnValueOnce(null);
    expect(
      await getFollowsCollection(
        'https://be-my-friend.inrupt.net/profile/card#me'
      )
    ).toBeNull;
  });
  it('if there is no UriSub returned getFollowsCollection should be null', async () => {
    const mockGetFriendsGroupRef: jest.Mock = require.requireMock(
      '../__mocks__/getFriendsGroupRef'
    ).getFriendsGroupRef;
    mockGetFriendsGroupRef.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/friends.ttl#this'
    );

    const mockGetUriSub: jest.Mock = require.requireMock(
      '../__mocks__/getUriSub'
    ).getUriSub;
    mockGetUriSub.mockReturnValueOnce(null);
    expect(
      await getFollowsCollection(
        'https://be-my-friend.inrupt.net/profile/card#me'
      )
    ).toBeNull;
  });
  it('should create if missing', async () => {
    const mockDetermineUriRef: jest.Mock = require.requireMock('../uriHelpers')
      .determineUriRef;
    mockDetermineUriRef.mockReturnValueOnce(null);
    expect(
      await getFriendsGroupRef(
        'https://be-my-friend.inrupt.net/profile/card#me',
        false
      )
    ).toBeNull;
  });
  it('should throw an error if determineUriRef throws an error', async () => {
    const mockDetermineUriRef: jest.Mock = require.requireMock('../uriHelpers')
      .determineUriRef;
    mockDetermineUriRef.mockImplementation(() => {
      throw new Error('error getting reference');
    });

    expect(
      await getFriendsGroupRef(
        'https://be-my-friend.inrupt.net/profile/card#me',
        false
      )
    ).toBeNull;
  });
  it('should throw an error createFriendsGroup throws an error', async () => {
    const mockCreateFriendsGroup: jest.Mock = require.requireMock(
      '../createFriendsGroup'
    ).createFriendsGroup;
    mockCreateFriendsGroup.mockImplementation(() => {
      throw new Error('error creating group');
    });

    expect(
      await getFriendsGroupRef(
        'https://be-my-friend.inrupt.net/profile/card#me',
        true
      )
    ).toBeNull;
  });
  it('should create a Friends group if createIfMissing and Reference not found', async () => {
    const mockDetermineUriRef: jest.Mock = require.requireMock('../uriHelpers')
      .determineUriRef;
    mockDetermineUriRef.mockReturnValueOnce(null);
    const mockCreateFriendsGroup: jest.Mock = require.requireMock(
      '../createFriendsGroup'
    ).createFriendsGroup;
    mockCreateFriendsGroup.mockImplementation(() => {
      return true;
    });

    expect(
      await getFriendsGroupRef(
        'https://be-my-friend.inrupt.net/profile/card#me',
        true
      )
    ).toBeTruthy;
  });
  it('should return null if webId is null', async () => {
    expect(
      await getFriendsGroupRef(
        'https://be-my-friend.inrupt.net/profile/card#me',
        false
      )
    ).toMatch('https://be-my-friend.inrupt.net/friends.ttl#this');
  });
  //Test lists function
  it('should return null if not following', async () => {
    const mockGetFollowsCollection: jest.Mock = require.requireMock(
      '../__mocks__/getFollowsCollection'
    ).getFollowsCollection;
    mockGetFollowsCollection.mockReturnValueOnce(null);
    expect(
      await lists(
        'https://be-my-friend.inrupt.net/profile/card#me',
        'https://example-user.inrupt.net/profile/card#me'
      )
    ).toBeNull;
  });
  it('should return true if the value is there', async () => {
    const mockGetFollowsCollection: jest.Mock = require.requireMock(
      '../friendshipHelpers'
    ).getFollowsCollection;
    mockGetFollowsCollection.mockReturnValueOnce([
      'https://example-user.inrupt.net/profile/card#me'
    ]);

    expect(
      await lists(
        'https://be-my-friend.inrupt.net/profile/card#me',
        'https://example-user.inrupt.net/profile/card#me'
      )
    ).toBeTruthy;
  });
  it('should return false if the value is not there', async () => {
    const mockGetFollowsCollection: jest.Mock = require.requireMock(
      '../friendshipHelpers'
    ).getFollowsCollection;
    mockGetFollowsCollection.mockReturnValueOnce([]);

    expect(
      await lists(
        'https://be-my-friend.inrupt.net/profile/card#me',
        'https://example-user.inrupt.net/profile/card#me'
      )
    ).toBeFalsy;
  });
});
