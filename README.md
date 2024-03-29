# Modern remake of sailplanner.nl using Svelte

Install PHP first (`brew install php`)

```bash
npm install
npm run dev
```

Navigate to [localhost:8000](http://localhost:8000).

[Svelte API docs](https://svelte.dev/docs#script)
[Svelte tutorial](https://svelte.dev/tutorial/basics)


## Store API:

### Retrieve an existing planner

`GET store.php?key=<key>`

Response contains the JSON representation of a planner instance, described below.

If `authToken=<authToken>` is supplied, the response also contains the `authToken` token.

### Update an existing planner

`POST store.php?key=<key>&authToken=<authToken>`.

Update the state of the planner with JSON in body.

If the `authToken` provided is correct for key, the store is updated with the supplied body.
The server replies with status code `200` and body `{"success": true}`.

If the `authToken` provided is not correct for the key, the supplied body is ignored.
The server replies with status code `401`, and body `{"success": false, "message": "Incorrect credentials."}`

### Create a new planner

`POST store.php`

No authorization is required, the body is saved in the store, it is returned including the `authToken` key.

### JSON structure:
```
{
    // Unique key to retrieve a planner. Alphanumerical, usually part of a md5 hash.
    "key": "<key>",
    // If the planner is requested with the correct auth key,
    // or a new planner is created, the authToken is supplied here.
    "authToken": "<authToken>",
    // optionally the key the planner was copied from.
    "parent": "<key>",
    // URL pointing to the legacy/old UI implementation.
    "legacyUrl": "https://sailplanner.nl/view/#<key>",
    "comment": "Comment, markdown allowed.",
    "settings": {
        "average": 5,  // average speed over ground (SOG)
        "map": {
            "center": [52, 4],
            "zoom": 13
        }
    },
    "legs": [
        {
            "departure": "10:00",
            "path": "<< encode path >>",
            "comment": "Description of leg",
            "color": "#123456",
            "width": 2,  // line width, in pixels
        },
        {}
    ]
}
```

## Todo:
 - [x] Color picker.
 - [x] Leg without points cannot be edited.
 - [x] Edit main planner comment.
 - [x] Interaction with the backend.
 - [x] Export to GPX / KML.
 - [x] Read only mode.
 - [x] Update `location.hash` on key changes, watch it for changes too.
 - [x] Only show quickstart on first load, store state in `localStorage`.
 - [x] Test KML exporter
 - [x] Test GPX exporter



Technical improvent ideas:

- https://svelte.dev/examples#keyed-each-blocks
- https://svelte.dev/examples#context-api

Improvements from legacy
 - [ ] Show dirty state on global / leg
 - [ ] Cancel changes for one leg.
 - [ ] Reorganize order of legs
 - [ ] Autosave
 - [ ] Undo/redo?
