import {
  fetchPersonDetails,
  getPersonType,
  PersonType
} from '../fetchPersonDetails';

jest.mock('../getMyWebId');
//jest.mock('../__mocks__/getFollowsCollection');
//jest.mock('../__mocks__/getFriendsGroupRef');
//jest.mock('../__mocks__/getUriSub');
jest.mock('../friendshipHelpers');

describe('fetchPersonDetals', () => {
  it('A Public person details object should return data even if a user is not logged in', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(null);

    expect(
      await fetchPersonDetails(
        'https://be-my-friend.inrupt.net/profile/card#me'
      )
    ).not.toBeNull();
  });

  //Test Types
  //if you are logged in as be-my-friend
  //find a friend to test each type
  //if be-my-friend logged in and search for be-my-friend type=="me"
  // ..  requested, requestor, friend, blocked, stranger
  //how will i test this as in do I set up the data
  it('if the user logged in is requesting their own details they should return with PersonType == me', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/profile/card#me'
    );

    const mockGetFollowsCollection: jest.Mock = require.requireMock(
      '../friendshipHelpers'
    ).getFollowsCollection;
    mockGetFollowsCollection.mockReturnValueOnce([]);
    expect(
      await fetchPersonDetails(
        'https://be-my-friend.inrupt.net/profile/card#me'
      )
    ).toMatchObject({
      avatarUrl:
        'https://be-my-friend.inrupt.net/profile/Screenshot%202019-11-27%2016.17.39_1574869325000_.png',
      follows: [],
      fullName: 'B. Mai Frent',
      personType: 'me',
      webId: 'https://be-my-friend.inrupt.net/profile/card#me'
    });
  });

  it('should return PersonType equal to me', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/profile/card#me'
    );
    const mockGetFollowsCollection: jest.Mock = require.requireMock(
      '../friendshipHelpers'
    ).getFollowsCollection;
    mockGetFollowsCollection.mockReturnValueOnce([]);
    expect(
      await fetchPersonDetails(
        'https://be-my-friend.inrupt.net/profile/card#me'
      )
    ).toMatchObject({
      avatarUrl:
        'https://be-my-friend.inrupt.net/profile/Screenshot%202019-11-27%2016.17.39_1574869325000_.png',
      follows: [],
      fullName: 'B. Mai Frent',
      personType: 'me',
      webId: 'https://be-my-friend.inrupt.net/profile/card#me'
    });
  });
  //Test getPersonType function
  it('should return friend when they each have the other on their friends list', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/profile/card#me'
    );
    const mockLists: jest.Mock = require.requireMock('../friendshipHelpers')
      .lists;
    mockLists.mockReturnValueOnce(true).mockReturnValueOnce(true);

    expect(
      await getPersonType('https://example-user.inrupt.net/profile/card#me')
    ).toBe(PersonType.friend);
  });
  it('should return stranger when neither have the other on their friends list', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/profile/card#me'
    );
    const mockLists: jest.Mock = require.requireMock('../friendshipHelpers')
      .lists;
    mockLists.mockReturnValueOnce(false).mockReturnValueOnce(false);

    expect(
      await getPersonType('https://example-user.inrupt.net/profile/card#me')
    ).toBe(PersonType.stranger);
  });
  it('should return stranger when neither have the other on their friends list', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/profile/card#me'
    );
    const mockLists: jest.Mock = require.requireMock('../friendshipHelpers')
      .lists;
    mockLists.mockReturnValueOnce(true).mockReturnValueOnce(false);

    expect(
      await getPersonType('https://example-user.inrupt.net/profile/card#me')
    ).toBe(PersonType.requester);
  });
  it('should return stranger when neither have the other on their friends list', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/profile/card#me'
    );
    const mockLists: jest.Mock = require.requireMock('../friendshipHelpers')
      .lists;
    mockLists.mockReturnValueOnce(false).mockReturnValueOnce(true);

    expect(
      await getPersonType('https://example-user.inrupt.net/profile/card#me')
    ).toBe(PersonType.requested);
  });
  it('should throw error if list function fails', async () => {
    const mockFetchCurrentUser: jest.Mock = require.requireMock('../getMyWebId')
      .getMyWebId;
    mockFetchCurrentUser.mockReturnValueOnce(
      'https://be-my-friend.inrupt.net/profile/card#me'
    );
    const mockLists: jest.Mock = require.requireMock('../friendshipHelpers')
      .lists;
    mockLists.mockReturnValueOnce(new Error('Problem finding lists'));

    expect(
      await getPersonType('https://example-user.inrupt.net/profile/card#me')
    ).toThrowError;
  });
});
