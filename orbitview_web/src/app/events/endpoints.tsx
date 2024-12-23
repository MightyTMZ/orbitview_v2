import { backendServer } from "@/components/importantLinks";

// OrbitView aims to tie events and networking with learning too
// OrbitView's value is that events complements one's learning

const comprehensiveEventsEndpoint = `${backendServer}/events-hub/events/comprehensive/`;
const simpleEventsEndpoint = `${backendServer}/events-hub/events/simple/`;
const ultraSimpleEventsEndpoint = `${backendServer}/events-hub/events/ultra-simple/`;

export {
  comprehensiveEventsEndpoint,
  simpleEventsEndpoint,
  ultraSimpleEventsEndpoint,
};
