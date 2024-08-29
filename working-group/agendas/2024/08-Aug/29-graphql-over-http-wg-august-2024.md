<!--

# How to join (copied directly from /JoiningAMeeting.md)

Hello! You're welcome to join our subcommittee meeting and add to the agenda by
following these three steps:

1.  Add your name to the list of attendees (in alphabetical order).

    - To respect meeting size, attendees should be relevant to the agenda. That
      means we expect most who join the meeting to participate in discussion. If
      you'd rather just watch, check out our YouTube[1].

    - Please include the organization (or project) you represent, and the
      location (including country code[2]) you expect to be located in during
      the meeting.

    - If you're willing to help take notes, add "✏️" after your name (eg. Ada
      Lovelace ✏). This is hugely helpful!

2.  If relevant, add your topic to the agenda (sorted by expected time).

    - Every agenda item has four parts: 1) the topic, 2) an expected time
      constraint, 3) who's leading the discussion, and 4) a list of any relevant
      links (RFC docs, issues, PRs, presentations, etc). Follow the format of
      existing agenda items.

    - Know what you want to get out of the agenda topic - what feedback do you
      need? What questions do you need answered? Are you looking for consensus
      or just directional feedback?

    - If your topic is a new proposal it's likely an "RFC 0"[3]. The barrier of
      entry for documenting new proposals is intentionally low, writing a few
      sentences about the problem you're trying to solve and the rough shape of
      your proposed solution is normally sufficient.

      You can create a link for this:

      - As an issue against this repo.
      - As a GitHub discussion in this repo.
      - As an RFC document into the rfcs/ folder of this repo.

3.  Review our guidelines and agree to our Spec Membership & CLA.

    - Review and understand our Spec Membership Agreement, Participation &
      Contribution Guidelines, and Code of Conduct. You'll find links to these
      in the first agenda item of every meeting.

    - If this is your first time, our bot will comment on your Pull Request with
      a link to our Spec Membership & CLA. Please follow along and agree before
      your PR is merged.

      Your organization may sign this for all of its members. To set this up,
      please ask operations@graphql.org.

PLEASE TAKE NOTE:

- By joining this meeting you must agree to the Specification Membership
  Agreement and Code of Conduct.

- Meetings are recorded and made available on YouTube[1], by joining you consent
  to being recorded.

[1] Youtube: https://www.youtube.com/channel/UCERcwLeheOXp_u61jEXxHMA [2]
Country codes:
https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes#Current_ISO_3166_country_codes
[3] RFC stages:
https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md#rfc-contribution-stages


-->

| This is an open meeting: To attend, read [JoiningAMeeting.md][] then edit and PR this file. (Edit: ✎ above, or press "e") |
| ---------------------------------------------------------------------------------------- |

# GraphQL-over-HTTP WG — August 2024

The GraphQL-over-HTTP Working Group meets regularly to discuss changes to the
[GraphQL-over-HTTP Specification](https://graphql.github.io/graphql-over-http/).
This is an open meeting in which anyone in the GraphQL community may attend.

We typically meet on the last Thursday of the month.

- **Date & Time**: [August 29, 2024, 5:30 – 6:30 PM UTC](https://www.timeanddate.com/worldclock/converter.html?iso=20240829T173000&&p1=3775&p2=110&p3=24&p4=37&p5=188&p6=496&p7=676&p8=438&p9=268&p10=234&p11=78&p12=604)
  - View the [calendar][], or subscribe ([Google Calendar][], [ical file][]).
  - _Please Note:_ The date or time may change. Please check this agenda the
    week of the meeting to confirm. While we try to keep all calendars accurate,
    this agenda document is the source of truth.
- **Video Conference Link**: https://zoom.us/j/92781382543
  - _Password:_ httpwg
- **Live Notes**: [Live Notes][]

[calendar]: https://calendar.google.com/calendar/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com
[google calendar]: https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
[ical file]: https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics
[JoiningAMeeting.md]: https://github.com/graphql/graphql-over-http/blob/main/JoiningAMeeting.md
[live notes]: https://docs.google.com/document/d/1hUi3kSdcINQLWD6s8DBZIwepnqy51dwPZShDn8c1GZU/edit?usp=sharing

## Attendees

<!-- prettier-ignore -->
| Name                 | GitHub        | Organization       | Location              |
| :------------------- | :------------ | :----------------- | :-------------------- |
| Benjie Gillam (Host) | @benjie       | Graphile           | Chandler's Ford, UK   |
| Martin Bonnin        | @martinbonnin | Apollo             | Paris, FR             |


## Agenda

1. Agree to Membership Agreement, Participation & Contribution Guidelines and Code of Conduct (1m, Host)
   - [Specification Membership Agreement](https://github.com/graphql/foundation)
   - [Participation Guidelines](https://github.com/graphql/graphql-wg#participation-guidelines)
   - [Contribution Guide](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md)
   - [Code of Conduct](https://github.com/graphql/foundation/blob/master/CODE-OF-CONDUCT.md)
1. Introduction of attendees (5m, Host)
1. Determine volunteers for note taking (1m, Host)
1. Review agenda (2m, Host)
1. Review previous meeting's action items (5m, Host)
   - [Ready for review](https://github.com/graphql/graphql-over-http/issues?q=is%3Aissue+is%3Aopen+label%3A%22Ready+for+review+%F0%9F%99%8C%22+sort%3Aupdated-desc)
   - [All open action items (by last update)](https://github.com/graphql/graphql-over-http/issues?q=is%3Aissue+is%3Aopen+label%3A%22Action+item+%3Aclapper%3A%22+sort%3Aupdated-desc)
1. Identifier syntax
   - Are we good on https://github.com/graphql/graphql-over-http/pull/296?
