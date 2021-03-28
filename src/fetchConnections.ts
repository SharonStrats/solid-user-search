import {
  PersonType,
  fetchPersonDetails,
  PersonDetails
} from './fetchPersonDetails';
import { PersonTypeLists, ListObject } from './fetchPersonTypeLists';
import { getMyWebId } from './getMyWebId';

function removeProcessedWebIds(
  batch: string[],

  processedWebIds: string[]
): string[] {
  let newBatch: string[] = [];
  /* not sure why below isn't working
  return batch.filter(webId => {
    processedWebIds.indexOf(webId) > -1;
  }); */
  batch.map(webId => {
    if (processedWebIds.indexOf(webId) === -1) {
      newBatch = newBatch.concat(webId);
    }
  });

  return newBatch;
}
//I think I should add an async iterator to the PersonDetails object in order to define the type to return
//Could make this return faster if PersonType is me, or direct connection...
export async function* fetchConnections(personTypes?: PersonType[]) {
  let lists: PersonTypeLists = {
    [PersonType.me]: {},
    [PersonType.requester]: {},
    [PersonType.requested]: {},
    [PersonType.friend]: {},
    [PersonType.blocked]: {},
    [PersonType.stranger]: {}
  };
  let batch: string[] = [];
  let processedWebIds: string[] = [];
  let personDetailsList: PersonDetails[] = [];

  try {
    const me: string | null = await getMyWebId();
    if (me !== null) {
      batch = batch.concat(me);
    }
  } catch (e) {
    console.log(e);
  }

  while (batch.length) {
    try {
      processedWebIds = processedWebIds.concat(batch);
      await processBatch(batch)
        .then(() => {
          batch = removeProcessedWebIds(batch, processedWebIds);
        })
        .then(yield personDetailsList);
    } catch (e) {
      console.log(e);
    }
  }

  return personDetailsList;

  async function processBatch(batch: string[]): Promise<ListObject> {
    return Promise.all(batch.map(considerWebId)).then(result => {
      result.forEach(value => {
        batch = batch.concat(value);
      });
      return { batch, lists };
    });
  }
  async function considerWebId(webId: string): Promise<string[]> {
    await fetchPersonDetails(webId).then(personDetails => {
      if (personDetails && personDetails.personType) {
        if (
          personTypes === undefined ||
          personTypes.indexOf(personDetails.personType) !== -1
        ) {
          personDetailsList = personDetailsList.concat(personDetails);
        }
        if (!lists[personDetails.personType][personDetails.webId]) {
          lists[personDetails.personType][personDetails.webId] = personDetails;
          if (personDetails.follows) {
            batch = batch.concat(personDetails.follows);
          }
        }
      }
    });
    return batch;
  }
}
