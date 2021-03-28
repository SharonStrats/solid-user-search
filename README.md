# solid-user-search

### Solid User Search Library is a library for accessing Solid Users

Solid users are stored at foaf.knows and activitypub.following. In order to use this library solid-auth-client is needed because you to get the data from fetchConnections and fetchPersonTypeLists the user needs to be logged in.

### Installation

```bash
 npm install solid-user-search
```

### Usage

Then you can import components like this:

```javascript
import { PersonDetails, fetchPersonDetails } from 'solid-user-search';
import {
  PersonTypes,
  PersonTypeLists,
  fetchPersonTypeLists
} from 'solid-user-search';
import { fetchConnections } from 'solid-user-search';
```

### Description of objects and functionality available

### Objects used to store Solid Data for users

#### PersonTypes

This is an enumeration it is used to describe the status of the connection.  
The values are:

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>me</td>
    <td>Logged in user</td>
  </tr>
  <tr>
    <td>requester</td>
    <td>Another solid user that is requesting the logged in users friendship</td>
  </tr>
  <tr>
    <td>requested</td>
    <td>Solid users whome the logged in person has requested friendship</td>
  </tr>
  <tr>
    <td>friend</td>
    <td>Another solid user in which both parties have accepted a friendship</td>
  </tr>
  <tr>
    <td>blocked</td>
    <td>Solid users the logged in user has unfriended</td>
  </tr>
  <tr>
    <td>stranger</td>
    <td>Other solid users that are connected in some way to the logged in users current connections</td>
  </tr>
</table>

#### PersonDetails

Person Details describe a solid user in relation to the logged in user. The object includes the following details of the solid user themselves:

<table>
  <tr>
    <th>Name</th>
    <th>DataType</th>
  </tr>
  <tr>
    <td>webId</td>
    <td>string</td>
  </tr>
  <tr>
    <td>avatarUrl</td>
    <td>string | null</td>
  </tr>
    <tr>
    <td>fullName</td>
    <td>string | null</td>
  </tr>
  <tr>
    <td>follows</td>
    <td>string[] | null</td>
  </tr>
</table>

In addition it includes the status of the relationship to the logged in user:

<table>
<tr>
  <td>PersonType</td>
  <td>PersonType | null</td>
</tr>
</table>

#### PersonTypeLists

PersonTypeLists are Objects that organize the collection of friends by PersonType. This can be used if...

```javascript
export type PersonTypeLists = {
  [type in PersonType]: {
    [webId: string]: PersonDetails;
  };
};
```

### Functions to search and return Solid Data

#### fetchPersonDetails

Fetches and returns the PersonDetails of the user with the given webId.
This can be used like this:

```javascript
const getUserDetails = async () => {
  try {
    await fetchPersonDetails(webId).then(() => {
      //do something
    });
  } catch (e) {
    console.log(e);
  }
};
```

#### fetchPersonTypeLists

Fetches and returns the PersonTypeLists for the logged in user. It takes an array of PersonTypes for the data you want to retrieve. If no argument is passed in it will return everything.
This function is an async generator.
It can be used like this:

```javascript
(async () => {
  let generator = fetchPersonTypeLists();
  for await (let users of generator) {
    //do something
  }
})();
```

#### fetchConnections

Fetches and returns an array of PersonDetails for the logged in user. This function is an async generator. It takes an array of PersonTypes for the data you want to retrieve. If no argument is passed in it will return everything.
It can be used like this:

```javascript
(async () => {
  let generator = fetchConnections([PersonType.friend]);
  for await (let friends of generator) {
    //do something
  }
})();
```

## Changelog

See [CHANGELOG](CHANGELOG.md).

## License

MIT © [Inrupt](https://inrupt.com)
