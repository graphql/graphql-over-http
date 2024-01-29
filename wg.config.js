// @ts-check

/** @type {import('wgutils').Config} */
const config = {
  name: "GraphQL-over-HTTP WG",
  repoUrl: "https://github.com/graphql/graphql-over-http",
  repoSubpath: "working-group",
  videoConferenceDetails: `https://zoom.us/j/92781382543
  - _Password:_ httpwg`,
  liveNotesUrl:
    "https://docs.google.com/document/d/1hUi3kSdcINQLWD6s8DBZIwepnqy51dwPZShDn8c1GZU/edit?usp=sharing",
  timezone: "UTC",
  frequency: "monthly",
  // For "last" set nth to -1
  nth: -1,
  weekday: "Th", // M, Tu, W, Th, F, Sa, Su
  time: "17:30-18:30", // 24-hour clock, range
  attendeesTemplate: `\
| Name                 | GitHub        | Organization       | Location              |
| :------------------- | :------------ | :----------------- | :-------------------- |
| Benjie Gillam (Host) | @benjie       | Graphile           | Chandler's Ford, UK   |
`,
  dateAndTimeLocations:
    "&p1=3775&p2=110&p3=24&p4=37&p5=188&p6=496&p7=676&p8=438&p9=268&p10=234&p11=78&p12=604",
  joiningAMeetingFile: "JoiningAMeeting.md",
  description: `\
The GraphQL-over-HTTP Working Group meets regularly to discuss changes to the
[GraphQL-over-HTTP Specification](https://graphql.github.io/graphql-over-http/).
This is an open meeting in which anyone in the GraphQL community may attend.

We typically meet on the last Thursday of the month.`
  /*
  // Additional configuration (optional):

  agendasFolder: "agendas",
  filenameFragment: "wg-primary",
  description: `\
The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is the primary monthly meeting, which typically meets on the first Thursday
of the month. In the case we have additional agenda items or follow ups, we also
hold additional secondary meetings later in the month.`,
  links: {
    "graphql specification": "https://github.com/graphql/graphql-spec",
    calendar: "https://calendar.google.com/calendar/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com",
"google calendar": "https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
"ical file": "https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics",
  },
  secondaryMeetings: [
    {
      // Wednesday, not Thursday
      dayOffset: -1,
      nth: 2,
      time: "16:00-17:00",
      name: "Secondary, APAC",
      // filenameFragment: "wg-secondary-apac",
      description: `\
The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is a secondary meeting, timed to be acceptable for those in Asia Pacific
timezones, which typically meets on the second Wednesday of the month. The
primary meeting is preferred for new agenda, where this meeting is for overflow
agenda items, follow ups from the primary meeting, or agenda introduced by those
who could not make the primary meeting time.`,
    },
    {
      nth: 3,
      time: "10:30-12:00",
      name: "Secondary, EU",
      filenameFragment: "wg-secondary-eu",
      description: `\
The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is a secondary meeting, timed to be acceptable for those in European
timezones, which typically meets on the third Thursday of the month. The
primary meeting is preferred for new agenda, where this meeting is for overflow
agenda items, follow ups from the primary meeting, or agenda introduced by those
who could not make the primary meeting time.`,
    },
  ],
*/
};

module.exports = config;
