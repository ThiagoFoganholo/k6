import { sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {BaseChecks, BaseRest, BaseService, ENDPOINTS, testeConfig} from '../../../../../support/base/baseTest.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const base_uri = testeConfig.environments.hml.url;
const baseRest = new BaseRest(base_uri);
const baseChecks = new BaseChecks();

export const options = testeConfig.options.LoadThresholds;

const data_tickets = new SharedArray('movie', function () {
    const jsonData = JSON.parse(open('../../../../../../../k6/projeto-base-k6/data/dynamic/tickets.json'));
    return jsonData; // must be an array
});

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export function setup() { 
  const res = baseRest.get(ENDPOINTS.TICKETS);
  const jsonData = JSON.parse(res.body);
  const id_array = jsonData.map(item => item._id);
  
  return {id_array};
}

export default function () {

  const {id_array} = setup();

  const randomTicketID = randomItem(id_array);

  //console.log(randomTicketID);

  const resDelMovie = baseRest.delete(ENDPOINTS.TICKETS + `/${randomTicketID}`);

  baseChecks.checkStatusCode(resDelMovie, 200);
  baseChecks.checkResponseTime(resDelMovie, 2000);
  
  // sleep(1);
}



