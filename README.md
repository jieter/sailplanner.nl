# Modern remake of sailplanner.nl using Svelte

```bash
npm install
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000).

[Svelte API docs](https://svelte.dev/docs#script)
[Svelte tutorial](https://svelte.dev/tutorial/basics)


## Store API:

### Retrieve an existing planner

`GET /store/<key>.json`

Response contains the JSON representation of a planner instance, described below.

If headers: `Authorization: basic <authKey>` are supplied, the response also contains the `authKey` key.

### Update an existing planner

`POST /store/<key>.json`, headers: `Authorization: basic <authKey>`.

Update the state of the planner with JSON in body.

If the `authKey` provided is correct for key, the store is updated with the supplied body.
The server replies with status code `200` and body `{"success": true}`.

If the `authKey` provided is not correct for the key, the supplied body is ignored.
The server replies with status code `401`, and body `{"success": false, "message": "Incorrect credentials."}`

### Create a new planner

`POST /store/`

No authorization is required, the body is saved in the store, it is returned including the `authKey` key.

### JSON structure:
```JSON
{
    "key": "<key>",
    "authKey": "<authKey>", // If the planner is requested with the correct auth key,
                            // or a new planenr is created, the authKey is supplied here.
    "parent": "<key>",  // optionally the key the planner was copied from.
    "url": "https://sailplanner.nl/#<key>",  // URL pointing to the current implementation.
    "legacyUrl": "https://sailplanner.nl/view/#<key>",  // URL pointing to the old UI implementation.
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
            "width": 2,  // line with, number of pixels
        },
        {}
    ]
}
```

## Todo:
 - [x] Color picker.
 - [ ] Leg without points cannot be edited.
 - [ ] Edit main planner comment.
 - [x] Interaction with the backend.
 - [x] Export to GPX / KML.
 - [x] Read only mode.

Technical improvent ideas:

- https://svelte.dev/examples#keyed-each-blocks
- https://svelte.dev/examples#context-api

Improvements from legacy

 - [ ] Reorganize order of legs
 - [ ] Autosave
 - [ ] Undo/redo?
