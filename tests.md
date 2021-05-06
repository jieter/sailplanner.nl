# Create from scratch
 - Open the test url without hash in an incognito tab.
 - [x] Verify the quickstart modal is shown initially.
 - Refresh the page,
 - [x] Verify the quickstart not shown initially.
 - Close your incognito session.

 - Add a leg between IJmuiden and Lowestoft,
 - [x] Verify the DOG is about 100M, equalling 20 hours with an average SOG of 5kts.
 - Press save.
 - [x] Verify a hash is added to the url, containing two keys separated by a pipe char (`|`)
 - [x] Verify this exact hash is also in the 'editable URL' field.
 - Open the 'Read only URL' in an incognito tab.
 - [x] Verify the same legs are visible, but they cannot be edited.

# Fork existing
 - Use the key `zomer2011` to open
 - [x] Verify existing planner is not changed when saving changes.

# Fork from legacy
 - Use key `zomer2011actual`
 - [ ] Verify a trip around the North sea is present.
 - [ ] Verify 'this is a legacy planner' is present, containing a working link to the legacy (Google maps based) version of sailplanner.nl.
