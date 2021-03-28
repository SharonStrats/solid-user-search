import {
  PersonType,
  fetchPersonDetails,
  PersonDetails
} from './fetchPersonDetails';
import { getMyWebId } from './getMyWebId';

export type PersonTypeLists = {
  [type in PersonType]: {
    [webId: string]: PersonDetails;
  };
};

export interface ListObject {
  batch: string[];
  lists: PersonTypeLists;
}

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
export async function* fetchPersonTypeLists() {
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

  try {
    const me: string | null = await getMyWebId();
    if (me !== null) {
      batch = batch.concat(me);
    }
  } catch (error) {
    console.log(error);
  }
  while (batch.length) {
    try {
      processedWebIds = processedWebIds.concat(batch);
      await processBatch(batch)
        .then(() => {
          batch = removeProcessedWebIds(batch, processedWebIds);
        })
        .then(yield lists);
    } catch (error) {
      console.log(error);
    }
  }
  return lists;

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
