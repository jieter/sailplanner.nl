# Create from scratch
 - Open the test url without hash in an incognito tab.
 - [ ] Verify the quickstart modal is shown initially.
 - Refresh the page,
 - [ ] Verify the quickstart not shown initially.
 - Close your incognito session.

 - Add a leg between IJmuiden and Lowestoft,
 - [ ] Verify the DOG is about 100M, equalling 20 hours with an average SOG of 5kts.
 - Press save.
 - [ ] Verify a hash is added to the url, containing two keys separated by a pipe char (`|`)
 - [ ] Verify this exact hash is also in the 'editable URL' field.
 - Open the 'Read only URL' in an incognito tab.
 - [ ] Verify the same legs are visible, but they cannot be edited.

# Fork existing
 - Use the key `zomer2011` to open
 - [ ] Verify existing planner is not changed when saving changes.

# Fork from legacy
 - Use key `zomer2011actual`
 - [ ] Verify a trip around the North sea is present.
 - [ ] Verify 'this is a legacy planner' is present, containing a working link to the legacy (Google maps based) version of sailplanner.nl.
